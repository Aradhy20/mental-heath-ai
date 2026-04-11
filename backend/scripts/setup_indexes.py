import asyncio
import os
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

async def create_indexes():
    # Load Environment
    env_path = "/Users/aradhyjain/Desktop/project/.env"
    load_dotenv(dotenv_path=env_path)
    
    mongo_url = os.getenv("MONGO_DETAILS")
    db_name = os.getenv("MONGO_DB_NAME", "mindfulai_db")
    
    if not mongo_url:
        print("❌ MONGO_DETAILS not found in .env")
        return

    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    print(f"🔄 Creating indexes for database: {db_name}...")
    
    # 1. User Profiles (Identity Sync)
    await db.user_profiles.create_index("user_id", unique=True)
    await db.user_profiles.create_index("email", sparse=True)
    await db.user_profiles.create_index("phone", sparse=True)
    
    # 2. Analysis Logs (Time-series optimization)
    await db.analysis_logs.create_index([("user_id", 1), ("created_at", -1)])
    await db.analysis_logs.create_index("type")
    
    # 3. OTP TTL (Security Index)
    # Ensure any field 'expire_at' exists in OTP docs for this to work
    await db.otps.create_index("identifier", unique=True)
    print("✅ MongoDB Indexes Created Successfully")

if __name__ == "__main__":
    asyncio.run(create_indexes())
