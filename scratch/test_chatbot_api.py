import socket
# Patch socket to force IPv4 and bypass broken IPv6 DNS resolutions
orig_getaddrinfo = socket.getaddrinfo
def getaddrinfo_ipv4_only(host, port, family=0, type=0, proto=0, flags=0):
    if family == socket.AF_UNSPEC or family == 0:
        family = socket.AF_INET
    return orig_getaddrinfo(host, port, family, type, proto, flags)
socket.getaddrinfo = getaddrinfo_ipv4_only

print("Socket patched for IPv4 preference.", flush=True)

import asyncio
from pydantic import BaseModel
from typing import List
import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parent.parent / "chatbot-backend"))
import main

class MockMessage(BaseModel):
    role: str
    content: str

class MockChatRequest(BaseModel):
    messages: List[MockMessage]

async def run_test():
    # Verify RAGStore retrieval
    print("--- 1. Testing RAGStore retrieval ---", flush=True)
    query = "tell me about Aditya's Deep Learning skill"
    retrieved = main.rag_store.retrieve(query)
    print("Retrieved context:", flush=True)
    print(retrieved, flush=True)
    print("-------------------------------------", flush=True)
    
    # Mock FastAPI call
    print("--- 2. Testing Chat Endpoint ---", flush=True)
    req = MockChatRequest(messages=[
        MockMessage(role="user", content="My name is John. Reach me at john.doe@example.com. I want to hire Aditya for an AI agent project.")
    ])
    
    real_req = main.ChatRequest(messages=[
        main.Message(role=m.role, content=m.content) for m in req.messages
    ])
    
    try:
        response = await main.chat_endpoint(real_req)
        print("Chat Endpoint Response:", flush=True)
        print(response, flush=True)
    except Exception as e:
        print("Error calling endpoint:", e, flush=True)
    print("-------------------------------------", flush=True)

if __name__ == "__main__":
    asyncio.run(run_test())
