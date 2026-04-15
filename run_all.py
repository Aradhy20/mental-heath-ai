import subprocess
import os
import sys
import time
from threading import Thread

def run_backend():
    print("🚀 Starting MindfulAI Backend...")
    # Kill any zombie process holding port 8000
    try:
        subprocess.run("kill -9 $(lsof -t -i:8000) 2>/dev/null", shell=True)
    except:
        pass
    
    os.chdir("backend")
    
    # Set required environment variable for protobuf compatibility
    env = os.environ.copy()
    env["PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION"] = "python"
    
    # Use explicitly the venv python if it exists
    python_exe = os.path.join("venv", "bin", "python3")
    if not os.path.exists(python_exe):
        python_exe = sys.executable

    # Using the unified main.py instead of multiple service scripts for simpler local run
    subprocess.run([python_exe, "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"], env=env)

def run_frontend():
    print("🎨 Starting MindfulAI Frontend...")
    os.chdir("frontend")
    # Check if npm is available
    try:
        subprocess.run(["npm", "run", "dev"])
    except FileNotFoundError:
        print("❌ Error: 'npm' not found in PATH. Please install Node.js and run 'npm install && npm run dev' in the frontend directory.")

if __name__ == "__main__":
    # Get current root path
    root_path = os.getcwd()

    backend_thread = Thread(target=run_backend)
    backend_thread.daemon = True
    backend_thread.start()

    # Wait a bit for backend to initialize
    time.sleep(3)

    # Return to root and then go to frontend
    os.chdir(root_path)
    run_frontend()
