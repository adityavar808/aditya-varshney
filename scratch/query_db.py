import os
from dotenv import load_dotenv
import pymongo
from pathlib import Path

env_path = Path("p:/portfolio/chatbot-backend/.env")
print("Loading dotenv from:", env_path)
load_dotenv(env_path)
uri = os.getenv("MONGODB_URI")
print("URI:", uri)

try:
    client = pymongo.MongoClient(uri)
    try:
        db = client.get_default_database()
    except Exception:
        db = client["test"]
    print("Database:", db.name)
    print("Collections:", db.list_collection_names())
    
    print("\n--- Adibot Config ---")
    for doc in db.adibots.find():
        print(doc)
        
    print("\n--- Services ---")
    for doc in db.services.find():
        print(doc)
        
    print("\n--- Projects ---")
    for doc in db.projects.find():
        print(doc)
        
    print("\n--- Skills ---")
    for doc in db.skills.find():
        print(doc)
        
    print("\n--- About ---")
    for doc in db.abouts.find():
        print(doc)
        
except Exception as e:
    print("Error:", e)
