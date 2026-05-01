import subprocess
import time
import sys
import os

# Use the OPTIMIZED virtual environment Python
PYTHON_PATH = os.path.join(os.getcwd(), "backend", "mindfulai-env", "bin", "python3")

def cleanup_ports():
    print("🧹 Cleaning up ports 3000 and 8000...")
    subprocess.run("lsof -ti:3000,8000 | xargs kill -9 2>/dev/null || true", shell=True)

def run_backend():
    print("🚀 Starting MindfulAI Backend (FastAPI) - LOW RAM MODE...")
    # workers=1 is critical for memory management on 8GB RAM
    return subprocess.Popen(
        [PYTHON_PATH, "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1"],
        cwd=os.path.join(os.getcwd(), "backend")
    )

def run_frontend():
    print("🎨 Starting MindfulAI Frontend (Next.js)...")
    env = os.environ.copy()
    # Use the specific Node.js version required by Next.js
    node_path = os.path.expanduser("~/.nvm/versions/node/v22.22.2/bin")
    env["PATH"] = f"{node_path}:{env['PATH']}"
    return subprocess.Popen(
        ["npm", "run", "dev", "--", "-p", "3000"],
        cwd=os.path.join(os.getcwd(), "frontend"),
        env=env
    )

if __name__ == "__main__":
    cleanup_ports()
    backend_proc = None
    frontend_proc = None
    try:
        backend_proc = run_backend()
        time.sleep(2) # Backend starts fast in optimized mode
        frontend_proc = run_frontend()
        
        print("\n✅ MindfulAI is now running in LOW RAM OPTIMIZED mode!")
        print("   - Private Dashboard: http://localhost:3000")
        print("   - Clinical Backend: http://localhost:8000")
        print("\nPress Ctrl+C to safely terminate all services.\n")
        
        while True:
            time.sleep(2)
            if backend_proc.poll() is not None:
                print("❌ Backend stopped. It might have run out of memory or encountered an error.")
                break
            if frontend_proc.poll() is not None:
                print("❌ Frontend stopped.")
                break
                
    except KeyboardInterrupt:
        print("\n🛑 Stopping MindfulAI...")
    finally:
        if backend_proc:
            backend_proc.terminate()
        if frontend_proc:
            frontend_proc.terminate()
        sys.exit(0)
