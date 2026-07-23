from fastapi import APIRouter
from models.schemas import ChatRequest
from controllers.chat_controller import handle_chat_request

router = APIRouter(prefix="/api", tags=["Chat"])

@router.post("/chat")
async def chat_endpoint(request: ChatRequest):
    return await handle_chat_request(request)
