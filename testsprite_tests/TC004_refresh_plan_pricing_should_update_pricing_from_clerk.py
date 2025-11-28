import requests

BASE_URL = "http://localhost:3000"
REFRESH_PRICING_ENDPOINT = "/api/admin/plans/refresh-pricing"
TIMEOUT = 30

# This token should be an authenticated admin user's Clerk token
# Replace the value below with a valid token for actual testing
ADMIN_AUTH_TOKEN = "Bearer YOUR_ADMIN_AUTH_TOKEN"

def test_refresh_plan_pricing_should_update_pricing_from_clerk():
    url = BASE_URL + REFRESH_PRICING_ENDPOINT
    headers = {
        "Authorization": ADMIN_AUTH_TOKEN,
        "Content-Type": "application/json",
        "Accept": "application/json"
    }

    try:
        response = requests.post(url, headers=headers, timeout=TIMEOUT)
    except requests.RequestException as e:
        assert False, f"Request to refresh plan pricing failed with exception: {e}"

    # The API should return success status for authenticated admin users
    assert response.status_code == 200, (
        f"Expected status code 200, got {response.status_code}. Response text: {response.text}"
    )

    # Optional: Further validate response content if known, e.g. JSON success flag
    try:
        json_data = response.json()
    except ValueError:
        assert False, "Response is not valid JSON"

    # Assuming the response includes success indication (e.g., a 'success' boolean or similar)
    assert "success" in json_data, "Response JSON does not contain 'success' field"
    assert json_data["success"] is True, f"Expected 'success' to be True, got {json_data['success']}"

test_refresh_plan_pricing_should_update_pricing_from_clerk()
