import requests

print("Testing Frontend-Backend Connectivity...")
print("=" * 50)

# Test Auth Service  
try:
    response = requests.get("http://localhost:8001/")
    print("Auth Service (8001):", response.json())
except Exception as e:
    print("Auth Service (8001): FAILED -", str(e))

# Test Doctor Service
try:
    response = requests.get("http://localhost:8006/")
    print("Doctor Service (8006):", response.json())
except Exception as e:
    print("Doctor Service (8006): FAILED -", str(e))

# Test Fusion Service
try:
    response = requests.get("http://localhost:8005/")
    print("Fusion Service (8005):", response.json())
except Exception as e:
    print("Fusion Service (8005): FAILED", str(e))

# Test Frontend
try:
    response = requests.get("http://localhost:3000/")
    print("Frontend (3000): CONNECTED - Status", response.status_code)
except Exception as e:
    print("Frontend (3000): FAILED -", str(e))

print("=" * 50)
print("Frontend-Backend Connectivity Test Complete!")
