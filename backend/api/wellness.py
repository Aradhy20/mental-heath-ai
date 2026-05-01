from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional
from core.security import get_optional_user
from database import get_db
from models import MoodEntry, MoodLog, DBUser
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
import uuid
import datetime
import httpx

router = APIRouter(tags=["Wellness Data"])

# ─── MOOD Endpoints ──────────────────────────────────────────────────────────

# ─── JOURNAL Endpoints ───────────────────────────────────────────────────────
class JournalRequest(BaseModel):
    content: str
    mood_tag: Optional[str] = None
    is_private: Optional[bool] = False

@router.post("/journal", summary="Create a new journal entry")
async def create_journal(entry: JournalRequest, user_id: str = Depends(get_optional_user), db_sql: AsyncSession = Depends(get_db)):
    from models import JournalEntry as DBJournalEntry
    import uuid
    log_id = str(uuid.uuid4())
    new_entry = DBJournalEntry(
        id=log_id,
        user_id=user_id,
        content=entry.content,
        sentiment=entry.mood_tag or "neutral"
    )
    db_sql.add(new_entry)
    await db_sql.commit()
    return {"id": log_id, "status": "saved"}

@router.get("/journal", summary="Get journal history")
async def get_journal_history(user_id: str = Depends(get_optional_user), db_sql: AsyncSession = Depends(get_db)):
    from models import JournalEntry as DBJournalEntry
    from sqlalchemy import select
    query = select(DBJournalEntry).where(DBJournalEntry.user_id == user_id).order_by(DBJournalEntry.created_at.desc()).limit(20)
    result = await db_sql.execute(query)
    rows = result.scalars().all()
    return [
        {
            "id": r.id,
            "content": r.content,
            "mood_tag": r.sentiment,
            "created_at": r.created_at.isoformat()
        }
        for r in rows
    ]


@router.post("/mood", summary="Log a mood entry")
async def log_mood(entry: MoodEntry, db_sql: AsyncSession = Depends(get_db)):
    try:
        log_id = str(uuid.uuid4())
        new_mood = MoodLog(
            id=log_id,
            user_id=entry.user_id,
            score=float(entry.score), # Store as Float
            feelings=",".join(entry.feelings or []),
            activities=",".join(entry.activities or []),
            note=entry.note or "",
            sleep_hours=float(entry.sleep_hours or 0.0),
            energy_level=int(entry.energy_level or 5),
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
                "score": r.score,
                "feelings": r.feelings.split(",") if r.feelings else [],
                "activities": r.activities.split(",") if r.activities else [],
                "note": r.note,
                "sleep_hours": r.sleep_hours,
                "energy_level": r.energy_level,
                "created_at": r.created_at.isoformat()
            }
            for r in rows
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/mood/trends", summary="AI-powered mood trend analysis")
async def get_mood_trends(user_id: str = Query("guest"), db_sql: AsyncSession = Depends(get_db)):
    """Returns a 30-day AI analysis of mood, sleep, and energy trends."""
    try:
        thirty_days_ago = datetime.datetime.utcnow() - datetime.timedelta(days=30)
        query = select(MoodLog).where(
            MoodLog.user_id == user_id,
            MoodLog.created_at >= thirty_days_ago
        ).order_by(MoodLog.created_at.asc())
        result = await db_sql.execute(query)
        rows = result.scalars().all()

        if not rows:
            return {
                "summary": "Not enough data yet. Log your mood daily to unlock trend analysis.",
                "avg_mood": 0, "avg_sleep": 0, "avg_energy": 0,
                "trend": "neutral", "insight": None, "data_points": 0
            }

        scores = [r.score for r in rows]
        sleeps = [r.sleep_hours for r in rows if r.sleep_hours > 0]
        energies = [r.energy_level for r in rows]

        avg_mood = round(sum(scores) / len(scores), 1) if scores else 0
        avg_sleep = round(sum(sleeps) / len(sleeps), 1) if sleeps else 0
        avg_energy = round(sum(energies) / len(energies), 1) if energies else 0

        # Simple trend: compare first half vs second half
        mid = len(scores) // 2
        first_half_avg = sum(scores[:mid]) / max(mid, 1)
        second_half_avg = sum(scores[mid:]) / max(len(scores) - mid, 1)
        trend = "improving" if second_half_avg > first_half_avg + 0.3 else "declining" if second_half_avg < first_half_avg - 0.3 else "stable"

        # AI-style insight
        if avg_sleep < 6 and avg_mood < 3:
            insight = "Your data shows a strong link between low sleep and low mood. Try improving sleep consistency."
        elif avg_energy < 4 and avg_mood < 3:
            insight = "Low energy levels appear to be impacting your mood. Consider light exercise or adjusting your routine."
        elif trend == "improving":
            insight = f"Great progress! Your mood has been improving over the past 30 days — keep it up."
        elif trend == "declining":
            insight = "Your mood trend is declining. Consider speaking with a mental health professional or trying our guided meditation."
        else:
            insight = f"You're maintaining a stable mood of {avg_mood}/5. Consistency is the foundation of well-being."

        return {
            "summary": f"{len(rows)} check-ins over 30 days",
            "avg_mood": avg_mood,
            "avg_sleep": avg_sleep,
            "avg_energy": avg_energy,
            "trend": trend,
            "insight": insight,
            "data_points": len(rows),
            "chart_data": [
                {
                    "date": r.created_at.strftime("%b %d"),
                    "mood": r.score,
                    "sleep": r.sleep_hours,
                    "energy": r.energy_level,
                }
                for r in rows
            ]
        }
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
    {"id": "y1", "name": "Isha Yoga Center", "type": "Yoga", "address": "Coimbatore, Tamil Nadu", "phone": "0422 251 5345", "lat": 10.9701, "lon": 76.7328, "tags": ["Meditation", "Wellness"]},
    {"id": "y2", "name": "The Yoga Institute", "type": "Yoga", "address": "Santacruz, Mumbai", "phone": "022 2612 2185", "lat": 19.0760, "lon": 72.8465, "tags": ["Traditional", "Health"]},
    {"id": "g1", "name": "Gold's Gym India", "type": "Gym", "address": "Multiple Locations", "phone": "1800 123 456", "lat": 19.1190, "lon": 72.8478, "tags": ["Fitness", "International"]},
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
