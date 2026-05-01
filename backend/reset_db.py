import asyncio
import sys
import os

# Add the current directory to path so we can import database and models
sys.path.insert(0, os.path.dirname(__file__))

from database import engine, Base
import models

async def reset_db():
    print("[*] Connecting to MySQL to clear tables...")
    async with engine.begin() as conn:
        # Drop all tables
        print("[*] Dropping all existing tables...")
        await conn.run_sync(Base.metadata.drop_all)
        
        # Create all tables
        print("[*] Recreating all tables from models...")
        await conn.run_sync(Base.metadata.create_all)
        
    print("[✅] Database tables cleared and recreated successfully!")

if __name__ == "__main__":
    asyncio.run(reset_db())
