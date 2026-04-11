from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGO_URL)

# Get the database instance
db = client["mindfulai_db"]

# Collections
users_collection = db["users"]
sessions_collection = db["sessions"]
otps_collection = db["otps"]
