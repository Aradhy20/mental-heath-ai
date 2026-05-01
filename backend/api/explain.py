from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_db
from core.security import get_current_user
from ai.explain_engine import explain_engine

router = APIRouter(tags=["Explain Engine"])

@router.get("/explain", summary="Get Cognitive Explanation")
async def explain_route(user_id: str = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    try:
        return await explain_engine.explain(user_id, db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
