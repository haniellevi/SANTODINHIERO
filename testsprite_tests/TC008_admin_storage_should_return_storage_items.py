import requests

BASE_URL = "http://localhost:3000"
ADMIN_STORAGE_ENDPOINT = "/api/admin/storage"
TIMEOUT = 30

# Provide a valid admin authentication token here
ADMIN_AUTH_TOKEN = "your_admin_auth_token_here"  

def admin_storage_should_return_storage_items():
    headers = {
        "Authorization": f"Bearer {ADMIN_AUTH_TOKEN}",
        "Accept": "application/json"
    }
    url = f"{BASE_URL}{ADMIN_STORAGE_ENDPOINT}"

    # Test authorized access (authenticated admin user)
    response = requests.get(url, headers=headers, timeout=TIMEOUT)
    assert response.status_code == 200, f"Expected status 200, got {response.status_code}"
    json_data = response.json()
    assert isinstance(json_data, (list, dict)), "Response JSON should be a list or dict representing storage items"
    # Optional: More specific assertions can be added here if schema is known

    # Test unauthorized access (no or invalid token)
    unauthorized_headers = {
        "Accept": "application/json"
    }
    response_unauth = requests.get(url, headers=unauthorized_headers, timeout=TIMEOUT)
    assert response_unauth.status_code in [401,403], f"Expected 401/403 for unauthorized access, got {response_unauth.status_code}"

admin_storage_should_return_storage_items()
