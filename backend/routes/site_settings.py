from fastapi import APIRouter
from models import SiteSettings, SiteSettingsUpdate
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent.parent
load_dotenv(ROOT_DIR / '.env')

router = APIRouter(prefix="/api/settings", tags=["Settings"])

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

DEFAULT_SETTINGS = SiteSettings().dict()

@router.get("", response_model=SiteSettings)
async def get_settings():
    settings = await db.site_settings.find_one({"id": "site_settings"})
    if not settings:
        await db.site_settings.insert_one(DEFAULT_SETTINGS)
        return SiteSettings(**DEFAULT_SETTINGS)
    return SiteSettings(**settings)

@router.put("")
async def update_settings(settings: SiteSettingsUpdate):
    update_data = {k: v for k, v in settings.dict().items() if v is not None}
    existing = await db.site_settings.find_one({"id": "site_settings"})
    if not existing:
        full_settings = {**DEFAULT_SETTINGS, **update_data}
        await db.site_settings.insert_one(full_settings)
    else:
        await db.site_settings.update_one({"id": "site_settings"}, {"$set": update_data})
    updated = await db.site_settings.find_one({"id": "site_settings"})
    return SiteSettings(**updated)
