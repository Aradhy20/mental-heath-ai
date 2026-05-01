import asyncio
import asyncpg
import sys

async def setup_db():
    try:
        # Connect to the default 'postgres' database
        conn = await asyncpg.connect(
            user='postgres',
            password='12345678',
            host='localhost',
            port=5432,
            database='postgres'
        )
        
        # Check if mindful_ai exists
        exists = await conn.fetchval("SELECT 1 FROM pg_database WHERE datname = 'mindful_ai'")
        
        if not exists:
            print("Creating database 'mindful_ai'...")
            # We can't use transactions for CREATE DATABASE
            await conn.execute('CREATE DATABASE mindful_ai')
            print("✅ Database 'mindful_ai' created successfully!")
        else:
            print("✨ Database 'mindful_ai' already exists.")
            
        await conn.close()
    except Exception as e:
        print(f"❌ Error setting up PostgreSQL: {e}")
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(setup_db())
