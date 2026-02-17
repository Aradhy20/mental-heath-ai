"""
Quick test script to verify all services are running
Run this before starting the frontend to ensure backend is ready
"""

import asyncio
import httpx
from typing import Dict, Tuple

SERVICES = {
    "MongoDB": "mongodb://localhost:27017",
    "Auth Service": "http://localhost:8001/health",
    "Text Service": "http://localhost:8002/health",
    "Voice Service": "http://localhost:8003/health",
    "Face Service": "http://localhost:8004/health",
    "Fusion Service": "http://localhost:8005/health",
    "Mood/Journal Service": "http://localhost:8008/health",
    "Report Service": "http://localhost:8009/health",
}

async def check_service(name: str, url: str) -> Tuple[str, bool, str]:
    """Check if a service is responding"""
    if name == "MongoDB":
        try:
            from motor.motor_asyncio import AsyncIOMotorClient
            client = AsyncIOMotorClient(url, serverSelectionTimeoutMS=2000)
            await client.admin.command('ping')
            return name, True, "Connected"
        except Exception as e:
            return name, False, str(e)[:50]
    else:
        try:
            async with httpx.AsyncClient(timeout=2.0) as client:
                response = await client.get(url)
                if response.status_code == 200:
                    data = response.json()
                    return name, True, f"{data.get('status', 'ok')}"
                else:
                    return name, False, f"HTTP {response.status_code}"
        except Exception as e:
            return name, False, str(e)[:50]

async def main():
    print("=" * 60)
    print("[+] Mental Health App - Service Health Check")
    print("=" * 60)
    print()
    
    # Check all services concurrently
    tasks = [check_service(name, url) for name, url in SERVICES.items()]
    results = await asyncio.gather(*tasks)
    
    # Display results
    all_healthy = True
    for name, healthy, message in results:
        status = "[OK]" if healthy else "[XX]"
        print(f"{status} {name:25} - {message}")
        if not healthy:
            all_healthy = False
    
    print()
    print("=" * 60)
    
    if all_healthy:
        print("[+] All services are healthy! Ready to start frontend.")
        print()
        print("Next steps:")
        print("  1. cd frontend")
        print("  2. npm run dev")
        print("  3. Open http://localhost:3000")
    else:
        print("[!] Some services are not responding.")

        print()
        print("Troubleshooting:")
        print("  - Start MongoDB: net start MongoDB (or docker)")
        print("  - Start backend: python backend/start_services.py")
        print("  - Or use: start_complete_app.bat")
    
    print("=" * 60)
    
    return 0 if all_healthy else 1

if __name__ == "__main__":
    exit_code = asyncio.run(main())
    exit(exit_code)
