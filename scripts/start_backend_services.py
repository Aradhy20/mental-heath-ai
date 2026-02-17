#!/usr/bin/env python3
"""
Script to start all backend services for the Mental Health App
"""
import os
import subprocess
import sys
import time
from threading import Thread

# Define the services and their ports
SERVICES = [
    {"name": "Auth Service", "port": 8001, "path": "backend/auth_service/main.py"},
    {"name": "Text Analysis", "port": 8002, "path": "backend/text_service/main.py"},
    {"name": "Voice Analysis", "port": 8003, "path": "backend/voice_service/main.py"},
    {"name": "Face Analysis", "port": 8004, "path": "backend/face_service/main.py"},
    {"name": "Fusion Service", "port": 8005, "path": "backend/fusion_service/main.py"},
    {"name": "Doctor Service", "port": 8006, "path": "backend/doctor_service/main.py"},
    {"name": "Notification Service", "port": 8007, "path": "backend/notification_service/main.py"},
    {"name": "Report Service", "port": 8009, "path": "backend/report_service/main.py"},
    {"name": "Mood/Journal Service", "port": 8008, "path": "backend/mood_journal_service/main.py"},
]

def start_service(service):
    """Start a single service"""
    try:
        # Set the PYTHONPATH to include the backend directory
        env = os.environ.copy()
        env['PYTHONPATH'] = os.path.join(os.getcwd(), 'backend')
        
        # Start the service
        process = subprocess.Popen([
            sys.executable, service['path']
        ], env=env, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        
        print(f"Started {service['name']} on port {service['port']} (PID: {process.pid})")
        return process
    except Exception as e:
        print(f"Failed to start {service['name']}: {e}")
        return None

def main():
    """Main function to start all services"""
    print("Starting Mental Health App Backend Services...")
    print("=" * 50)
    
    # Change to the project directory
    project_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(project_dir)
    
    # Start all services
    processes = []
    for service in SERVICES:
        process = start_service(service)
        if process:
            processes.append(process)
        time.sleep(1)  # Small delay between starting services
    
    print("\nAll services started!")
    print("Services are running in the background.")
    print("Press Ctrl+C to stop all services.")
    
    try:
        # Wait for all processes
        for process in processes:
            process.wait()
    except KeyboardInterrupt:
        print("\nStopping all services...")
        for process in processes:
            process.terminate()
        print("All services stopped.")

if __name__ == "__main__":
    main()