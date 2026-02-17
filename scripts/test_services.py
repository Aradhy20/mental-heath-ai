import requests
import json

# Test the authentication service
print("Testing Authentication Service...")
try:
    # Test the root endpoint
    response = requests.get("http://localhost:8001/")
    print(f"Root endpoint: {response.status_code} - {response.json()}")
    
    # Test user registration
    register_data = {
        "username": "testuser",
        "email": "test@example.com",
        "password": "testpassword"
    }
    response = requests.post("http://localhost:8001/register", json=register_data)
    print(f"Registration: {response.status_code}")
    if response.status_code == 200:
        print(f"  User registered: {response.json()}")
    
    # Test user login
    login_data = {
        "username": "testuser",
        "password": "testpassword"
    }
    response = requests.post("http://localhost:8001/token", data=login_data)
    print(f"Login: {response.status_code}")
    if response.status_code == 200:
        token_data = response.json()
        print(f"  Token received: {token_data.get('token_type', 'bearer')}")
        token = token_data.get("access_token")
        
        # Test getting user info
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get("http://localhost:8001/users/me", headers=headers)
        print(f"User info: {response.status_code}")
        if response.status_code == 200:
            print(f"  User details: {response.json()}")
    
except Exception as e:
    print(f"Error testing authentication service: {e}")

print("\n" + "="*50 + "\n")

# Test the text analysis service (if running)
print("Testing Text Analysis Service...")
try:
    # Test the root endpoint
    response = requests.get("http://localhost:8002/")
    print(f"Root endpoint: {response.status_code} - {response.json()}")
    
    # Test text analysis (if we have a token)
    if 'token' in locals():
        text_data = {
            "text": "I'm feeling really happy and excited today!",
            "user_id": 1
        }
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.post("http://localhost:8002/analyze/text", json=text_data, headers=headers)
        print(f"Text analysis: {response.status_code}")
        if response.status_code == 200:
            print(f"  Analysis result: {response.json()}")
    
except Exception as e:
    print(f"Error testing text analysis service: {e}")
    print("The text service might not be running yet.")

print("\nServices test completed!")