import os
import google.generativeai as genai
from dotenv import load_dotenv
from pathlib import Path
import pymongo

env_path = Path("p:/portfolio/chatbot-backend/.env")
load_dotenv(env_path)

uri = os.getenv("MONGODB_URI")
client = pymongo.MongoClient(uri)
try:
    db = client.get_default_database()
except Exception:
    db = client["test"]
config = db.adibots.find_one()
api_key = config.get("geminiApiKey", "") if config else ""

print("Gemini API Key length:", len(api_key), flush=True)

if not api_key:
    print("No Gemini API key available.", flush=True)
    exit(0)

genai.configure(api_key=api_key)

def record_user_details(email: str, name: str = "Name not provided", notes: str = "not provided") -> dict:
    """Record that a user is interested in being in touch and provided an email address.
    
    Args:
        email: The email address of the user.
        name: The user's name.
        notes: Additional context notes.
    """
    print(f"--- TOOL CALLED: record_user_details({email}, {name}, {notes}) ---", flush=True)
    return {"status": "success", "message": "Details recorded"}

model = genai.GenerativeModel(
    model_name='gemini-3.1-flash-lite',
    tools=[record_user_details]
)

chat = model.start_chat(enable_automatic_function_calling=True)
response = chat.send_message("My name is John. Please contact me at john@example.com. I want to build a React website.")
print("Model Response:", flush=True)
print(response.text, flush=True)
print("History:", flush=True)
for message in chat.history:
    print(message.role, "->", [p.text if hasattr(p, 'text') else 'Function call/response' for p in message.parts], flush=True)
