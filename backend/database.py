from motor.motor_asyncio import AsyncIOMotorClient
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
import os
import certifi
from dotenv import load_dotenv

# Load Environment
env_path = os.path.join(os.path.dirname(__file__), "..", ".env")
load_dotenv(dotenv_path=env_path)

# --- SQL Configuration (SQLite — for portability and demo-ready stability) ---
SQLITE_URL = "sqlite+aiosqlite:///./mindful.db"

engine = create_async_engine(
    SQLITE_URL, 
    echo=False, 
    pool_pre_ping=True
)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
Base = declarative_base()

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
