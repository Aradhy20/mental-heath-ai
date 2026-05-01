import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
import os
from dotenv import load_dotenv

async def check_postgres():
    load_dotenv()
    postgres_url = os.getenv("POSTGRES_URL", "postgresql+asyncpg://postgres:12345678@localhost:5432/mindful_ai")
    print(f"Attempting to connect to: {postgres_url}")
    
    engine = create_async_engine(postgres_url)
    try:
        async with engine.connect() as conn:
            print("✅ PostgreSQL Connection Successful!")
            return True
    except Exception as e:
        print(f"❌ PostgreSQL Connection Failed: {e}")
        return False
    finally:
        await engine.dispose()

if __name__ == "__main__":
    asyncio.run(check_postgres())
