import re
from typing import List
from fastapi import HTTPException
import google.generativeai as genai
from config.database import db, logger
from models.schemas import Message
from services.rag_service import rag_store
from services.tools_service import record_user_details, record_unknown_question

_EMAIL_RE = re.compile(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+")

def _user_wants_contact_and_email(msg: str):
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


def generate_chat_response(messages: List[Message]) -> dict:
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
