from fastapi import APIRouter, HTTPException
from models import Session, SessionCreate
from typing import List, Optional
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent.parent
load_dotenv(ROOT_DIR / '.env')

router = APIRouter(prefix="/api/sessions", tags=["Sessions"])

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

@router.get("", response_model=List[Session])
async def get_sessions(visible_only: Optional[bool] = None):
    query = {}
    if visible_only:
        query["visible"] = True
    sessions = await db.sessions.find(query).sort("order", 1).to_list(100)
    return [Session(**session) for session in sessions]

@router.get("/{session_id}", response_model=Session)
async def get_session(session_id: str):
    session = await db.sessions.find_one({"id": session_id})
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return Session(**session)

@router.post("", response_model=Session)
async def create_session(session: SessionCreate):
    count = await db.sessions.count_documents({})
    data = session.dict()
    data.pop("order", None)  # Remove order from input to use count
    session_obj = Session(**data, order=count)
    await db.sessions.insert_one(session_obj.dict())
    return session_obj

@router.put("/{session_id}", response_model=Session)
async def update_session(session_id: str, session: SessionCreate):
    existing = await db.sessions.find_one({"id": session_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Session not found")
    update_data = {k: v for k, v in session.dict().items() if v is not None}
    await db.sessions.update_one({"id": session_id}, {"$set": update_data})
    updated = await db.sessions.find_one({"id": session_id})
    return Session(**updated)

@router.patch("/{session_id}/visibility")
async def toggle_visibility(session_id: str, data: dict):
    existing = await db.sessions.find_one({"id": session_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Session not found")
    await db.sessions.update_one({"id": session_id}, {"$set": {"visible": data.get("visible", True)}})
    return {"message": "Visibility updated", "visible": data.get("visible", True)}

@router.patch("/reorder")
async def reorder_sessions(data: dict):
    order_list = data.get("order", [])
    for idx, session_id in enumerate(order_list):
        await db.sessions.update_one({"id": session_id}, {"$set": {"order": idx}})
    return {"message": "Sessions reordered successfully"}

@router.delete("/{session_id}")
async def delete_session(session_id: str):
    result = await db.sessions.delete_one({"id": session_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Session not found")
    return {"message": "Session deleted successfully"}
