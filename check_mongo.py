import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

async def check_mongo():
    load_dotenv()
    mongo_url = os.getenv("MONGO_DETAILS")
    if not mongo_url:
        print("❌ MONGO_DETAILS not found in .env")
        return
        
    print(f"Attempting to connect to MongoDB...")
    client = AsyncIOMotorClient(mongo_url)
    try:
        # The ismaster command is cheap and does not require auth.
        await client.admin.command('ismaster')
        print("✅ MongoDB Connection Successful!")
    except Exception as e:
        print(f"❌ MongoDB Connection Failed: {e}")

if __name__ == "__main__":
    asyncio.run(check_mongo())
