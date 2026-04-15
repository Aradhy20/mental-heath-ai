from motor.motor_asyncio import AsyncIOMotorClient
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
import os
import certifi
from dotenv import load_dotenv

# Load Environment
env_path = os.path.join(os.path.dirname(__file__), "..", ".env")
load_dotenv(dotenv_path=env_path)

# --- NoSQL Configuration (MongoDB Atlas) ---
# Primary storage for: Journals, Moods, AI Analysis logs
MONGO_URL = os.getenv("MONGO_URL", os.getenv("MONGO_DETAILS", "mongodb://localhost:27017"))
DB_NAME = os.getenv("MONGO_DB_NAME", "mental_health_db")
client = AsyncIOMotorClient(MONGO_URL, tlsCAFile=certifi.where(), serverSelectionTimeoutMS=5000)
db = client[DB_NAME]

# Collections
analysis_logs_collection = db["analysis_logs"]
sessions_collection = analysis_logs_collection # Alias for Fusion service
moods_collection = db["moods"]
journals_collection = db["journals"]

# --- SQL Configuration (MySQL — confirmed available at /usr/local/mysql) ---
# Primary storage for: Auth, Identity, Tokens
MYSQL_URL = os.getenv(
    "MYSQL_URL",
    "mysql+aiomysql://root:12345678@127.0.0.1:3306/mindful_ai"
)

engine = create_async_engine(
    MYSQL_URL, 
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
