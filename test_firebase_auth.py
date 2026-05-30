import requests
import json
import sys

# Define base URL and mock token configuration
BASE_URL = "http://127.0.0.1:8000/api/v1"
MOCK_TOKEN = "mock-firebase-jwt"

def test_backend_login():
    print(f"Testing login endpoint at {BASE_URL}/auth/login...")
    headers = {
        "Authorization": f"Bearer {MOCK_TOKEN}",
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/login", headers=headers)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            print("SUCCESS: Authenticated successfully with backend mock!")
            return True
        else:
            print("FAILED: Backend returned non-200 status code.")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"ERROR: Could not connect to backend server: {e}")
        print("Make sure the backend server is running (e.g. uvicorn backend.main:app --port 8000)")
        return False

if __name__ == "__main__":
    success = test_backend_login()
    sys.exit(0 if success else 1)
