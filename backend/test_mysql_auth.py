import asyncio
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
# Disable heavy ML imports for testing auth rapidly
os.environ['USE_TF'] = '0'
os.environ['USE_TORCH'] = '1'

async def test_login(email: str, raw_password: str):
    from database import AsyncSessionLocal
    from models import DBUser
    from sqlalchemy import select
    from core.security import verify_password
    
    async with AsyncSessionLocal() as session:
        print(f"[*] Querying MySQL for user: {email}")
        query = select(DBUser).where(DBUser.email == email)
        result = await session.execute(query)
        db_user = result.scalars().first()
        
        if db_user:
            print(f"[+] User Found: {db_user.username} ({db_user.email})")
            print(f"[*] Stored Hash: {db_user.password_hash}")
            
            # Use the actual security functions
            is_valid = verify_password(raw_password, db_user.password_hash)
            
            if is_valid:
                print(f"[✅] SUCCESS: Password verified correctly!")
            else:
                print(f"[❌] FAILED: Password failed verification.")
        else:
            print(f"[-] User not found with email: {email}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python test_mysql_auth.py <email> <password>")
        sys.exit(1)
        
    email = sys.argv[1]
    pwd = sys.argv[2]
    asyncio.run(test_login(email, pwd))
