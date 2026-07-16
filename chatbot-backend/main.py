import socket
# Patch socket to force IPv4 and bypass broken IPv6 DNS resolutions
orig_getaddrinfo = socket.getaddrinfo
def getaddrinfo_ipv4_only(host, port, family=0, type=0, proto=0, flags=0):
    if family == socket.AF_UNSPEC or family == 0:
        family = socket.AF_INET
    return orig_getaddrinfo(host, port, family, type, proto, flags)
socket.getaddrinfo = getaddrinfo_ipv4_only

import os
import logging
import re
import json
import warnings
from typing import List
from pathlib import Path
from datetime import datetime

# Suppress model-loading warnings and HF noise before importing sentence_transformers
warnings.filterwarnings("ignore", message=".*UNEXPECTED.*")
warnings.filterwarnings("ignore", message=".*different task/architecture.*")
warnings.filterwarnings("ignore", message=".*can be ignored when loading.*")
logging.getLogger("transformers").setLevel(logging.ERROR)
logging.getLogger("sentence_transformers").setLevel(logging.ERROR)
os.environ.setdefault("HF_HUB_DISABLE_PROGRESS_BARS", "1")
os.environ.setdefault("TRANSFORMERS_VERBOSITY", "error")

import numpy as np
import requests
import pymongo
import google.generativeai as genai
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from dotenv import load_dotenv
from pypdf import PdfReader
from sentence_transformers import SentenceTransformer
import faiss

# Load env variables
load_dotenv()

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("chatbot")

app = FastAPI(title="Adibot FastAPI RAG Service")

# Add CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.detail}
    )

# Connect to MongoDB
MONGODB_URI = os.getenv("MONGODB_URI")
if not MONGODB_URI:
    logger.error("MONGODB_URI environment variable is missing!")

db = None
try:
    client = pymongo.MongoClient(MONGODB_URI)
    try:
        db = client.get_default_database()
    except Exception:
        # Mongoose defaults to "test" database when none is specified in URI path
        db = client["test"]
    logger.info(f"Connected to MongoDB database: {db.name}")
except Exception as e:
    logger.error(f"Failed to connect to MongoDB: {e}")

# --- RAG config ---
CHUNK_SIZE = 400
CHUNK_OVERLAP = 80
TOP_K = 7

# Startup: confirm push notification config
_ntfy = (os.getenv("NTFY_TOPIC") or "").strip()
if _ntfy:
    print(f"Push notifications: NTFY_TOPIC is set (topic: {_ntfy[:4]}...{_ntfy[-2:]})", flush=True)
else:
    print("Push notifications: NTFY_TOPIC is not set — add NTFY_TOPIC=your_topic to .env", flush=True)


def push(text, title="Notification from App"):
    """Send notification via ntfy.sh. Returns True if sent, False otherwise."""
    ntfy_topic = (os.getenv("NTFY_TOPIC") or "").strip()
    if not ntfy_topic:
        return False
    url = f"https://ntfy.sh/{ntfy_topic}"
    try:
        r = requests.post(
            url,
            data=text.encode("utf-8"),
            headers={"Title": title},
            timeout=15,
            verify=True,
        )
        return 200 <= r.status_code < 300
    except Exception as e:
        print(f"Push failed: {e}", flush=True)
        return False


def chunk_text(text: str, chunk_size: int = CHUNK_SIZE, overlap: int = CHUNK_OVERLAP):
    """Split text into overlapping chunks."""
    text = re.sub(r"\s+", " ", text).strip()
    if not text:
        return []
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunk = text[start:end]
        if chunk.strip():
            chunks.append(chunk.strip())
        start = end - overlap
    return chunks


def load_documents():
    """Load PDFs and summary from me/ into list of (source, text) tuples."""
    docs = []
    me_dir = Path(__file__).resolve().parent / "me"
    if not me_dir.exists():
        me_dir.mkdir(parents=True, exist_ok=True)
        
    summary_path = me_dir / "summary.txt"
    if summary_path.is_file():
        try:
            with open(summary_path, "r", encoding="utf-8") as f:
                docs.append(("summary.txt", f.read()))
        except Exception as e:
            print(f"Error reading summary.txt: {e}", flush=True)
            
    # PDFs
    for name in ["linkedin.pdf", "Resume.pdf", "resume.pdf", "Linkedin.pdf"]:
        path = me_dir / name
        if path.is_file():
            try:
                reader = PdfReader(path)
                text = ""
                for page in reader.pages:
                    t = page.extract_text()
                    if t:
                        text += t
                if text:
                    docs.append((name, text))
            except Exception as e:
                print(f"Error reading PDF {name}: {e}", flush=True)
    return docs


class RAGStore:
    """RAG index using Hugging Face sentence-transformers + FAISS vector store."""
    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        self.model = None
        self.chunks = []
        self.index = None
        self.dimension = 384
        self.model_name = model_name

    def load_model(self):
        if self.model is None:
            print(f"Loading embedding model: {self.model_name}", flush=True)
            self.model = SentenceTransformer(self.model_name)
            self.dimension = self.model.get_sentence_embedding_dimension()

    def index_documents(self, documents):
        """Build FAISS index from list of (source_name, text) tuples."""
        self.chunks = []
        for source, text in documents:
            for chunk in chunk_text(text):
                self.chunks.append((source, chunk))
        if not self.chunks:
            print("No documents found to index in RAGStore.", flush=True)
            return
        
        self.load_model()
        texts = [c[1] for c in self.chunks]
        embeddings = self.model.encode(texts, normalize_embeddings=True)
        embeddings = np.ascontiguousarray(embeddings.astype(np.float32))
        self.index = faiss.IndexFlatIP(self.dimension)
        self.index.add(embeddings)
        print(f"Successfully indexed {len(self.chunks)} chunks in FAISS.", flush=True)

    def retrieve(self, query: str, top_k: int = TOP_K) -> str:
        """Return top-k relevant chunks using FAISS similarity search."""
        if not self.chunks or self.index is None:
            return ""
        self.load_model()
        q_emb = self.model.encode([query], normalize_embeddings=True)
        q_emb = np.ascontiguousarray(q_emb.astype(np.float32))
        scores, indices = self.index.search(q_emb, min(top_k, len(self.chunks)))
        indices = indices.flatten()
        parts = []
        for i in indices:
            if i < 0 or i >= len(self.chunks):
                continue
            source, chunk = self.chunks[i]
            parts.append(f"[{source}]\n{chunk}")
        return "\n\n---\n\n".join(parts)


# Initialize and load index at startup
rag_store = RAGStore()
try:
    docs = load_documents()
    if docs:
        rag_store.index_documents(docs)
except Exception as e:
    print(f"Error during initial document indexing: {e}", flush=True)

# Contact intent helper
_EMAIL_RE = re.compile(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+")

def _user_wants_contact_and_email(msg):
    """If the user message looks like contact intent and contains an email, return (email, name, notes). Else None."""
    if not msg or not isinstance(msg, str):
        return None
    m = _EMAIL_RE.search(msg)
    if not m:
        return None
    email = m.group(0)
    lower = msg.lower()
    if not any(w in lower for w in ("contact", "touch", "reach", "email", "reach out", "get in touch", "connect", "hear from")):
        return None
    
    name = "Name not provided"
    for pat in [
        r"(?:i'm|i am|my name is|name is|this is)\s+([A-Za-z][A-Za-z\s]{0,40}?)(?:\.|,|\s+and|\s+my|\s*$)", 
        r"^([A-Za-z][A-Za-z\s]{0,40}?)(?:\s+here|\s+writing)"
    ]:
        m2 = re.search(pat, msg, re.IGNORECASE)
        if m2:
            name = m2.group(1).strip()[:80]
            break
            
    notes = msg.strip()
    notes = notes.replace(email, "").strip()
    contact_phrases = [
        r"my email is", r"email is", r"email:", r"contact me at", r"reach me at",
        r"get in touch", r"contact", r"reach out", r"connect", r"hear from"
    ]
    for phrase in contact_phrases:
        notes = re.sub(phrase, "", notes, flags=re.IGNORECASE)
    notes = re.sub(r'\s+', ' ', notes).strip()
    if not notes or len(notes.split()) <= 2:
        notes = "User wants to get in touch"
    return (email, name, notes[:500])


# --- Tool definitions ---
def record_user_details(email: str, name: str = "Name not provided", notes: str = "not provided") -> dict:
    """Record that a user is interested in being in touch and provided an email address.
    
    Args:
        email: The email address of this user.
        name: The user's name, if they provided it.
        notes: Any additional information or message content left by the user.
    """
    print(f"Tool called: record_user_details(email={email}, name={name}, notes={notes})", flush=True)
    
    # Clean inputs
    clean_name = str(name).strip()[:80] if name else "Name not provided"
    if "{" in clean_name or "[" in clean_name:
        clean_name = "Name not provided"
        
    clean_notes = str(notes).strip()[:500] if notes else "User wants to get in touch"
    if "{" in clean_notes or "[" in clean_notes:
        clean_notes = "User wants to get in touch"
        
    # Save to MongoDB contacts collection
    if db is not None:
        try:
            date_submitted = datetime.now().strftime("%m/%d/%Y, %I:%M:%S %p")
            db.contacts.insert_one({
                "name": clean_name,
                "email": email,
                "message": clean_notes,
                "dateSubmitted": date_submitted
            })
            print("Recorded contact details successfully to MongoDB.", flush=True)
        except Exception as ex:
            print(f"Database error writing contact details: {ex}", flush=True)
            
    # Send push notification
    body = f"{clean_name} | {email} | {clean_notes}"
    push(body, title="Someone wants to contact you")
    return {"recorded": "ok"}


def record_unknown_question(question: str) -> dict:
    """Record that a question could not be answered from the retrieved context.
    
    Args:
        question: The user's exact question that could not be answered.
    """
    print(f"Tool called: record_unknown_question(question={question})", flush=True)
    
    # Save to MongoDB unknown_questions collection
    if db is not None:
        try:
            date_submitted = datetime.now().strftime("%m/%d/%Y, %I:%M:%S %p")
            db.unknown_questions.insert_one({
                "question": question,
                "dateSubmitted": date_submitted
            })
            print("Recorded unknown question successfully to MongoDB.", flush=True)
        except Exception as ex:
            print(f"Database error writing unknown question: {ex}", flush=True)
            
    # Send push notification
    push(f"Recording: {question}", title="Unknown Question")
    return {"recorded": "ok"}


class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]

@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    if db is None:
        raise HTTPException(status_code=500, detail="Database connection is offline.")
        
    messages = request.messages
    if not messages:
        raise HTTPException(status_code=400, detail="Messages history array is required.")

    try:
        # 1. Fetch Adibot configuration (API key and custom context)
        adibot_config = db.adibots.find_one()
        if not adibot_config:
            default_context = """### ADITYA'S PROFILE CONTEXT

Name: Aditya Varshney
Role: Computer Science Engineering Student & Full Stack AI Developer
Tech Stack: React, Next.js, Node.js, Express, MongoDB, PyTorch, Python, TensorFlow
GitHub: https://github.com/adityavar808
LinkedIn: https://www.linkedin.com/in/adityaavarshney/

Guidelines:
- Act as Adibot, Aditya's personal AI agent.
- Keep responses concise, professional, friendly, and matching the portfolio's cyberpunk/omnitrix aesthetic.
- ALWAYS use the exact LinkedIn URL: https://www.linkedin.com/in/adityaavarshney/ and GitHub URL: https://github.com/adityavar808. Do NOT guess or change them.
- You can explain Aditya's projects, tech capabilities, and guide visitors to contact him via the form."""
            db.adibots.insert_one({
                "customContext": default_context,
                "geminiApiKey": ""
            })
            adibot_config = db.adibots.find_one() or {}
            
        api_key = adibot_config.get("geminiApiKey", "")
        custom_context = adibot_config.get("customContext", "")
        
        if not api_key:
            raise HTTPException(
                status_code=400, 
                detail="Gemini AI API Key is not configured. Please register it in the Admin Dashboard."
            )
 
        # 2. Fetch dynamic database context items
        services = list(db.services.find().sort("serviceId", 1))
        projects = list(db.projects.find().sort("projectId", 1))
        skills = list(db.skills.find().sort("skillId", 1))
 
        # Format database context
        services_text = "\n".join([f"- {s.get('name')} ({s.get('subtitle')}): {s.get('description')}" for s in services])
        projects_text = "\n".join([f"- {p.get('name')} [Category: {p.get('category')}]: Live URL: {p.get('liveUrl')}" for p in projects])
        skills_text = "\n".join([f"- {sk.get('name')}: {sk.get('tagline')}" for sk in skills])
 
        last_message = messages[-1].content

        # 3. Retrieve relevant chunks from local PDF/summary documents
        retrieved_context = rag_store.retrieve(last_message)

        # 4. Fallback check for contact details
        combined = last_message
        if len(messages) > 1:
            combined = f"{messages[-2].content}\n{last_message}"
        contact_info = _user_wants_contact_and_email(combined)
        if contact_info:
            try:
                record_user_details(contact_info[0], name=contact_info[1], notes=contact_info[2])
            except Exception:
                pass

        # 5. Build unified system instruction
        system_instruction = f"""You are Adibot, Aditya Varshney's personal AI representative.
Your task is to answer user queries about Aditya Varshney, his projects, skills, services, and profile.
You should act extremely friendly, helpful, professional, and matching the sleek cyberpunk/omnitrix portfolio aesthetic.
Answer as if you represent Aditya's brand.

Use ONLY the retrieved context and database records below to answer. Never invent or guess information.
If the context does NOT contain the answer: call record_unknown_question with the user's question, then reply with ONLY this short message:
'Sorry, that is not under my context. Please ask relevant questions about my background, skills, experience, or projects.'
Do NOT give long explanations, do NOT make up any facts, do NOT inflate the answer. Keep the out-of-context reply short and exactly as above.

If the user wants to get in touch, ask for their email and use record_user_details.
When you use tools, do NOT show function call syntax or JSON in your response.

---
PROFILE CONTEXT RETRIEVED FROM DATABASE:
{custom_context}

CURRENT SERVICES OFFERED:
{services_text or 'No services added.'}

CURRENT COMPLETED PROJECTS:
{projects_text or 'No projects added.'}

CURRENT TECHNICAL SKILLS:
{skills_text or 'No skills added.'}
---
ADDITIONAL DOCUMENTATION CONTEXT (RAG):
{retrieved_context or 'No additional document context found.'}
---
"""

        # 6. Initialize Gemini SDK
        genai.configure(api_key=api_key)
        
        # Pass Python functions directly as tools
        tools_list = [record_user_details, record_unknown_question]
        
        model = genai.GenerativeModel(
            model_name='gemini-3.1-flash-lite',
            system_instruction=system_instruction,
            tools=tools_list
        )

        # 7. Format chat history
        history = []
        for msg in messages[:-1]:
            role = "model" if msg.role == "model" else "user"
            history.append({
                "role": role,
                "parts": [msg.content]
            })

        # Start chat with automatic function execution
        chat = model.start_chat(history=history, enable_automatic_function_calling=True)
        response = chat.send_message(last_message)
        
        final_content = response.text
        
        # Clean up any potential function call formatting artifacts
        if final_content:
            final_content = re.sub(r'Function\s*=\s*\w+\s*>.*?</function>', '', final_content, flags=re.DOTALL | re.IGNORECASE)
            final_content = re.sub(r'<function>.*?</function>', '', final_content, flags=re.DOTALL | re.IGNORECASE)
            final_content = re.sub(r'Function\s*=\s*\w+.*', '', final_content, flags=re.DOTALL | re.IGNORECASE)
            final_content = re.sub(r'\n\s*\n\s*\n', '\n\n', final_content)
            final_content = final_content.strip()
            
        if not final_content:
            final_content = "I've processed your request. How else can I help you?"

        # Intercept and log unknown questions if the model replied that it does not know
        unknown_phrases = (
            "not under my context", "not under", "not aware", "don't have", "don't have that",
            "context does not", "no information", "not in the context", "not in the provided",
            "couldn't find", "could not find", "do not have", "does not contain",
            "relevant questions about my background",
        )
        if any(p in final_content.lower() for p in unknown_phrases):
            try:
                record_unknown_question(last_message)
            except Exception:
                pass
            return {
                "reply": "Sorry, that is not under my context. Please ask relevant questions about my background, skills, experience, or projects."
            }

        return {"reply": final_content}

    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Error during chatbot execution: {e}")
        raise HTTPException(status_code=500, detail=f"Adibot error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
