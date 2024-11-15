from fastapi import APIRouter

from backend.api.endpoints import user, answer, progress

api_router = APIRouter()
api_router.include_router(user.router, tags=["user"])
api_router.include_router(answer.router, tags=["answer"])
api_router.include_router(progress.router, tags=["progress"])
