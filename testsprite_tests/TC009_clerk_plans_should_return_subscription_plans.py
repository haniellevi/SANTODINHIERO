import requests

BASE_URL = "http://localhost:3000"
API_PATH = "/api/admin/clerk/plans"
TIMEOUT = 30

# NOTE: Replace 'YOUR_AUTH_TOKEN' below with a valid Clerk admin user token for authentication.
AUTH_TOKEN = "YOUR_AUTH_TOKEN"


def test_clerk_plans_should_return_subscription_plans():
    headers = {
        "Authorization": f"Bearer {AUTH_TOKEN}",
        "Accept": "application/json",
    }

    url = f"{BASE_URL}{API_PATH}"

    try:
        response = requests.get(url, headers=headers, timeout=TIMEOUT)
    except requests.RequestException as e:
        assert False, f"Request failed: {e}"

    assert response.status_code == 200, f"Expected 200 OK but got {response.status_code}"

    try:
        plans = response.json()
    except ValueError:
        assert False, "Response is not valid JSON"

    assert isinstance(plans, (list, dict)), "Response JSON should be a list or dict of subscription plans"

    # Basic check: response must not be empty
    assert plans, "Subscription plans response is empty"

    # Additional checks can be added depending on the expected structure, e.g.:
    if isinstance(plans, list):
        for plan in plans:
            assert isinstance(plan, dict), "Each plan should be a dictionary"
            assert "id" in plan, "Plan should have an 'id' key"
            assert "name" in plan, "Plan should have a 'name' key"

    # No cleanup needed as this is a GET read operation


test_clerk_plans_should_return_subscription_plans()
