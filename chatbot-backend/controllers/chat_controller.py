from fastapi import HTTPException
from config.database import db
from models.schemas import ChatRequest
from services.llm_service import generate_chat_response

async def handle_chat_request(request: ChatRequest):
    if db is None:
        raise HTTPException(status_code=500, detail="Database connection is offline.")
    return generate_chat_response(request.messages)
