from motor.motor_asyncio import AsyncIOMotorClient
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
import os
import certifi
from dotenv import load_dotenv

# Load Environment
env_path = os.path.join(os.path.dirname(__file__), "..", ".env")
load_dotenv(dotenv_path=env_path)

# --- SQL Configuration (PostgreSQL — primary storage for all relational data) ---
# Primary storage for: Auth, Identity, Tokens
POSTGRES_URL = os.getenv(
    "POSTGRES_URL",
    "postgresql+asyncpg://postgres:12345678@localhost:5432/mindful_ai"
)

engine = create_async_engine(
    POSTGRES_URL, 
    echo=False, 
    pool_pre_ping=True,
    pool_size=5,
    max_overflow=10
)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
Base = declarative_base()

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
