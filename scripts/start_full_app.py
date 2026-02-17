#!/usr/bin/env python3
"""
Modernized Startup Script for Mental Health App
Starts the MERN stack + Python AI Microservices (MongoDB Architecture)
"""
import os
import subprocess
import sys
import time
import signal
import platform

class CleanAppManager:
    def __init__(self):
        self.processes = []
        # Support both absolute and relative paths
        self.root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        
    def start_process(self, command, cwd, name):
        """Helper to start a process and track it"""
        print(f"🚀 [STARTING] {name}...")
        try:
            # Use shell=True for windows to handle npm correctly
            is_windows = platform.system() == "Windows"
            process = subprocess.Popen(
                command, 
                cwd=cwd, 
                shell=is_windows,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                bufsize=1,
                universal_newlines=True
            )
            self.processes.append({"process": process, "name": name})
            print(f"✅ [ONLINE] {name} (PID: {process.pid})")
            return True
        except Exception as e:
            print(f"❌ [FAILED] {name}: {e}")
            return False

    def monitor_output(self, proc_dict):
        """Optional: print first few lines of output to verify startup"""
        p = proc_dict["process"]
        name = proc_dict["name"]
        # Non-blocking check for first few lines
        # This is simplified; in a full app we'd use threads for each
        pass

    def run(self):
        print("\n" + "═"*60)
        print("   MENTAL HEALTH APP - NEURAL NEST (MONGODB EDITION)")
        print("═"*60 + "\n")

        # 1. Start Python AI Services
        ai_services = [
            {"cmd": [sys.executable, "text_service/main.py"], "cwd": "backend", "name": "AI Text Service (8002)"},
            {"cmd": [sys.executable, "voice_service/main.py"], "cwd": "backend", "name": "AI Voice Service (8003)"},
            {"cmd": [sys.executable, "face_service/main.py"], "cwd": "backend", "name": "AI Face Service (8004)"},
        ]

        for svc in ai_services:
            full_cwd = os.path.join(self.root_dir, svc["cwd"])
            self.start_process(svc["cmd"], full_cwd, svc["name"])
            time.sleep(1) # stagger

        # 2. Start Express Backend
        express_cwd = os.path.join(self.root_dir, "backend-express")
        self.start_process(["npm", "start"], express_cwd, "Express API Gateway (5000)")
        time.sleep(2)

        # 3. Start Next.js Frontend
        frontend_cwd = os.path.join(self.root_dir, "frontend")
        self.start_process(["npm", "run", "dev"], frontend_cwd, "Next.js Frontend (3000/3001)")

        print("\n" + "═"*60)
        print("✨ ALL SYSTEMS INITIALIZED")
        print("═"*60)
        print("🌍 URLs:")
        print("   - Frontend:  http://localhost:3000")
        print("   - Analytics: http://localhost:3000/analysis")
        print("   - API Health: http://localhost:5000/health")
        print("═"*60)
        print("Press Ctrl+C to safely terminate all services.\n")

        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            self.shutdown()

    def shutdown(self):
        print("\n🛑 [SHUTDOWN] Terminating all services...")
        for p in self.processes:
            print(f"   Stopping {p['name']}...")
            if platform.system() == "Windows":
                # Windows taskkill to ensure sub-processes like npm die
                subprocess.run(['taskkill', '/F', '/T', '/PID', str(p["process"].pid)], capture_output=True)
            else:
                p["process"].terminate()
        print("✅ [CLEAN] All processes stopped.")
        sys.exit(0)

if __name__ == "__main__":
    # Ensure dependencies are locally searchable
    os.environ['PYTHONPATH'] = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'backend')
    manager = CleanAppManager()
    manager.run()