import subprocess
import os
import sys
import time
from threading import Thread

def run_backend():
    print("🚀 Starting MindfulAI Backend...")
    os.chdir("backend")
    # Using the unified main.py instead of multiple service scripts for simpler local run
    subprocess.run([sys.executable, "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001", "--reload"])

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
