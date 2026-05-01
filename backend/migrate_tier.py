import asyncio
from database import AsyncSessionLocal
from sqlalchemy import text

async def migrate():
    async with AsyncSessionLocal() as session:
        try:
            # Catching gracefully if column already exists
            await session.execute(text("ALTER TABLE users ADD COLUMN subscription_tier VARCHAR(50) DEFAULT 'free';"))
            await session.commit()
            print("Successfully migrated users table.")
        except Exception as e:
            await session.rollback()
            print(f"Migration completed or column already exists: {e}")

if __name__ == "__main__":
    asyncio.run(migrate())
