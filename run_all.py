import subprocess
import time
import sys
import os

# Explicitly use the Python 3.10 environment where dependencies were installed
PYTHON_PATH = "/Library/Frameworks/Python.framework/Versions/3.10/bin/python3"

def cleanup_ports():
    print("🧹 Cleaning up ports 3000 and 8000...")
    subprocess.run("lsof -ti:3000,8000 | xargs kill -9 2>/dev/null || true", shell=True)

def run_backend():
    print("🚀 Starting MindfulAI Backend (FastAPI)...")
    return subprocess.Popen(
        [PYTHON_PATH, "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"],
        cwd=os.path.join(os.getcwd(), "backend")
    )

def run_frontend():
    print("🎨 Starting MindfulAI Frontend (Next.js)...")
    return subprocess.Popen(
        ["npm", "run", "dev", "--", "-p", "3000"],
        cwd=os.path.join(os.getcwd(), "frontend")
    )

if __name__ == "__main__":
    cleanup_ports()
    backend_proc = None
    frontend_proc = None
    try:
        backend_proc = run_backend()
        time.sleep(4) # Wait for backend to initialize
        frontend_proc = run_frontend()
        
        print("\n✅ MindfulAI Clinical Intelligence is now running!")
        print("   - Private Dashboard: http://localhost:3000")
        print("   - Clinical Backend: http://localhost:8000")
        print("   - API Intelligence: http://localhost:8000/api/docs")
        print("\nPress Ctrl+C to safely terminate all services.\n")
        
        while True:
            time.sleep(2)
            if backend_proc.poll() is not None:
                print("❌ Backend process stopped unexpectedly. Check your dependencies.")
                break
            if frontend_proc.poll() is not None:
                print("❌ Frontend process stopped unexpectedly. Check npm logs.")
                break
                
    except KeyboardInterrupt:
        print("\n🛑 Safely stopping MindfulAI...")
    finally:
        if backend_proc:
            backend_proc.terminate()
        if frontend_proc:
            frontend_proc.terminate()
        sys.exit(0)
