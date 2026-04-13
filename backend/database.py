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
MONGO_URL = os.getenv("MONGO_DETAILS", "mongodb://localhost:27017")
DB_NAME = os.getenv("MONGO_DB_NAME", "mindfulai_db")
client = AsyncIOMotorClient(MONGO_URL, tlsCAFile=certifi.where())
db = client[DB_NAME]

# Collections
users_profile_collection = db["user_profiles"] # Extra profile metadata
otps_collection = db["otps"]
analysis_logs_collection = db["analysis_logs"]
sessions_collection = analysis_logs_collection # Alias for Fusion service
moods_collection = db["moods"]
journals_collection = db["journals"]

# --- SQL Configuration (MySQL via SQLAlchemy) ---
# Primary storage for: Auth, Identity, Tokens
# User: root, Pass: 12345678, DB: mindful_ai
MYSQL_URL = "mysql+aiomysql://root:12345678@localhost/mindful_ai"
engine = create_async_engine(MYSQL_URL, echo=False)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
Base = declarative_base()

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
