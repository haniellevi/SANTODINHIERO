import requests

BASE_URL = "http://localhost:3000"
ADMIN_USAGE_ENDPOINT = "/api/admin/usage"
TIMEOUT = 30

# Replace this with a valid token for an authenticated admin user.
ADMIN_AUTH_TOKEN = "REPLACE_WITH_VALID_ADMIN_JWT_TOKEN_OR_BEARER_TOKEN"

def test_admin_usage_should_return_usage_statistics():
    headers = {
        "Authorization": f"Bearer {ADMIN_AUTH_TOKEN}",
        "Accept": "application/json"
    }
    url = BASE_URL + ADMIN_USAGE_ENDPOINT

    # Test successful access by authenticated admin user
    try:
        response = requests.get(url, headers=headers, timeout=TIMEOUT)
    except requests.RequestException as e:
        assert False, f"Request to {url} failed with exception: {e}"

    assert response.status_code == 200, f"Expected status code 200, got {response.status_code}"
    try:
        data = response.json()
    except ValueError as e:
        assert False, f"Response is not valid JSON: {e}"

    # Validate that usage statistics expected fields exist (generic check)
    assert isinstance(data, dict), "Response JSON is not an object/dictionary"
    expected_keys = ["usageStatistics", "analytics", "metrics"]
    assert any(key in data for key in expected_keys), f"Response JSON does not contain any expected keys: {expected_keys}"

    # Test access denied for unauthenticated user (no auth header)
    try:
        resp_no_auth = requests.get(url, timeout=TIMEOUT)
    except requests.RequestException as e:
        assert False, f"Request without auth to {url} failed with exception: {e}"

    assert resp_no_auth.status_code in (401, 403), f"Expected 401 or 403 without auth, got {resp_no_auth.status_code}"

    # Test access denied for authenticated non-admin user
    NON_ADMIN_AUTH_TOKEN = "REPLACE_WITH_VALID_NON_ADMIN_JWT_TOKEN_OR_BEARER_TOKEN"
    headers_non_admin = {
        "Authorization": f"Bearer {NON_ADMIN_AUTH_TOKEN}",
        "Accept": "application/json"
    }
    try:
        resp_non_admin = requests.get(url, headers=headers_non_admin, timeout=TIMEOUT)
    except requests.RequestException as e:
        assert False, f"Request with non-admin auth to {url} failed with exception: {e}"
    assert resp_non_admin.status_code in (401, 403), f"Expected 401 or 403 for non-admin user, got {resp_non_admin.status_code}"

test_admin_usage_should_return_usage_statistics()
