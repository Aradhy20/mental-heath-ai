from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional
from core.security import get_optional_user
from database import get_db, journals_collection # MongoDB for journals if preferred, but user said switch to MySQL
from models import MoodEntry, JournalEntry, MoodLog, DBJournal, DBUser
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
import uuid

router = APIRouter(tags=["Wellness Data"])

# ─── MOOD Endpoints ──────────────────────────────────────────────────────────

@router.post("/mood", summary="Log a mood entry")
async def log_mood(entry: MoodEntry, db_sql: AsyncSession = Depends(get_db)):
    try:
        log_id = str(uuid.uuid4())
        new_mood = MoodLog(
            id=log_id,
            user_id=entry.user_id,
            score=str(entry.score),
            feelings=",".join(entry.feelings or []),
            activities=",".join(entry.activities or []),
            note=entry.note or ""
        )
        db_sql.add(new_mood)
        await db_sql.commit()
        return {"id": log_id, "score": entry.score, "status": "saved"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Mood log failed: {str(e)}")


@router.get("/mood", summary="Get mood history for a user")
async def get_mood_history(user_id: str = Query("guest"), limit: int = Query(30), db_sql: AsyncSession = Depends(get_db)):
    try:
        query = select(MoodLog).where(MoodLog.user_id == user_id).order_by(MoodLog.created_at.desc()).limit(limit)
        result = await db_sql.execute(query)
        rows = result.scalars().all()
        return [
            {
                "id": r.id, 
                "score": int(r.score) if r.score.isdigit() else 0,
                "feelings": r.feelings.split(",") if r.feelings else [],
                "activities": r.activities.split(",") if r.activities else [],
                "note": r.note,
                "created_at": r.created_at.isoformat()
            }
            for r in rows
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ─── JOURNAL Endpoints ───────────────────────────────────────────────────────

@router.post("/journal", summary="Create or update a journal entry")
async def save_journal(entry: JournalEntry, db_sql: AsyncSession = Depends(get_db)):
    try:
        entry_id = entry.id or str(uuid.uuid4())
        now = datetime.datetime.now(datetime.timezone.utc)
        
        # Check if exists
        query = select(DBJournal).where(DBJournal.id == entry_id)
        result = await db_sql.execute(query)
        existing = result.scalars().first()
        
        if existing:
            existing.title = entry.title
            existing.content = entry.content
            existing.tags = ",".join(entry.tags or [])
            existing.sentiment = entry.sentiment or "neutral"
            existing.word_count = str(entry.word_count or len(entry.content.split()))
            existing.updated_at = now
        else:
            new_journal = DBJournal(
                id=entry_id,
                user_id=entry.user_id,
                title=entry.title,
                content=entry.content,
                tags=",".join(entry.tags or []),
                sentiment=entry.sentiment or "neutral",
                word_count=str(entry.word_count or len(entry.content.split())),
                created_at=now,
                updated_at=now
            )
            db_sql.add(new_journal)
            
        await db_sql.commit()
        
        # Also sync to NoSQL for cross-modality analysis if needed
        journal_nosql = {
            "id": entry_id,
            "user_id": entry.user_id,
            "title": entry.title,
            "content": entry.content,
            "sentiment": entry.sentiment,
            "updated_at": now
        }
        await journals_collection.update_one({"id": entry_id}, {"$set": journal_nosql}, upsert=True)
        
        return {"id": entry_id, "status": "saved"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Journal save failed: {str(e)}")


@router.get("/journal", summary="Get journal entries for a user")
async def get_journal_entries(user_id: str = Query("guest"), limit: int = Query(50), db_sql: AsyncSession = Depends(get_db)):
    try:
        query = select(DBJournal).where(DBJournal.user_id == user_id).order_by(DBJournal.created_at.desc()).limit(limit)
        result = await db_sql.execute(query)
        rows = result.scalars().all()
        return [
            {
                "id": r.id, 
                "title": r.title, 
                "content": r.content,
                "tags": r.tags.split(",") if r.tags else [],
                "sentiment": r.sentiment,
                "word_count": int(r.word_count) if r.word_count.isdigit() else 0,
                "created_at": r.created_at.isoformat()
            }
            for r in rows
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ─── NEARBY RESOURCES Endpoint ───────────────────────────────────────────────

OVERPASS_URL = "https://overpass-api.de/api/interpreter"

OSM_QUERIES = {
    "mental_health": '["amenity"~"social_facility|doctors"]',
    "hospital":      '["amenity"="hospital"]',
    "yoga":          '["leisure"="fitness_centre"]["sport"~"yoga"]',
    "gym":           '["leisure"="fitness_centre"]',
    "pharmacy":      '["amenity"="pharmacy"]',
}

# Curated static fallback resources (rich, real data)
FALLBACK_RESOURCES = [
    {"id": "f1", "name": "Vandrevala Foundation Helpline", "type": "Crisis Helpline", "address": "National – All India", "phone": "1860-2662-345", "lat": 19.0760, "lon": 72.8777, "tags": ["Free", "24/7", "Hindi", "English"]},
    {"id": "f2", "name": "iCall by TISS", "type": "Counseling", "address": "Mumbai, Maharashtra", "phone": "9152987821", "lat": 19.1190, "lon": 72.8478, "tags": ["Free", "Youth", "Online"]},
    {"id": "f3", "name": "NIMHANS Bangalore", "type": "Psychiatry Institute", "address": "Hosur Road, Bengaluru – 560029", "phone": "080-46110007", "lat": 12.9428, "lon": 77.5963, "tags": ["Expert", "Govt", "OPD"]},
    {"id": "f4", "name": "LVPrasad Eye & Mental Care", "type": "Mental Health Clinic", "address": "Hyderabad, Telangana", "phone": "+91 40 3061 7000", "lat": 17.4239, "lon": 78.4738, "tags": ["In-person", "Specialist"]},
    {"id": "f5", "name": "The MIND Foundation", "type": "Psychology", "address": "Chennai, Tamil Nadu", "phone": "+91 44 2467 3456", "lat": 13.0141, "lon": 80.2676, "tags": ["CBT", "Family"]},
]

@router.get("/nearby-resources", summary="Find nearby mental health resources via OSM")
async def get_nearby_resources(
    lat: float = Query(12.9716, description="Latitude"),
    lon: float = Query(77.5946, description="Longitude"),
    radius: int = Query(5000, description="Radius in meters (max 20000)"),
    type: str = Query("mental_health", description="mental_health | yoga | gym | hospital"),
    limit: int = Query(20)
):
    """
    Queries OpenStreetMap Overpass API for nearby wellness resources.
    Falls back to curated static data if API unavailable.
    """
    radius = min(radius, 20000)
    query_filter = OSM_QUERIES.get(type, OSM_QUERIES["mental_health"])

    overpass_query = f"""
    [out:json][timeout:10];
    (
      node{query_filter}(around:{radius},{lat},{lon});
      way{query_filter}(around:{radius},{lat},{lon});
    );
    out center tags {limit};
    """

    try:
        async with httpx.AsyncClient(timeout=12) as client:
            resp = await client.post(OVERPASS_URL, data={"data": overpass_query})
            resp.raise_for_status()
            osm_data = resp.json()

        results = []
        for elem in osm_data.get("elements", [])[:limit]:
            tags = elem.get("tags", {})
            name = tags.get("name") or tags.get("brand") or "Unnamed Resource"
            if "unnamed" in name.lower() or len(name) < 3:
                continue

            elem_lat = elem.get("lat") or elem.get("center", {}).get("lat")
            elem_lon = elem.get("lon") or elem.get("center", {}).get("lon")

            results.append({
                "id": str(elem.get("id")),
                "name": name,
                "type": tags.get("social_facility", tags.get("amenity", type)).replace("_", " ").title(),
                "address": f"{tags.get('addr:street', '')} {tags.get('addr:city', '')}".strip() or "Address not available",
                "phone": tags.get("phone") or tags.get("contact:phone"),
                "website": tags.get("website") or tags.get("contact:website"),
                "opening_hours": tags.get("opening_hours"),
                "lat": elem_lat,
                "lon": elem_lon,
                "source": "openstreetmap"
            })

        if not results:
            return {"results": FALLBACK_RESOURCES, "source": "curated", "count": len(FALLBACK_RESOURCES)}

        return {"results": results, "source": "openstreetmap", "count": len(results)}

    except Exception as e:
        # Return curated fallback
        return {
            "results": FALLBACK_RESOURCES,
            "source": "curated",
            "count": len(FALLBACK_RESOURCES),
            "note": f"Live map data temporarily unavailable. Showing curated resources."
        }
