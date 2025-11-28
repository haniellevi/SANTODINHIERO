import requests

BASE_URL = "http://localhost:3000"
ADMIN_DASHBOARD_ENDPOINT = "/api/admin/dashboard"
TIMEOUT = 30

# Placeholder token for an authenticated user with ADMIN role
# Replace with a valid token for actual tests
ADMIN_AUTH_TOKEN = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ADMIN_ROLE_VALID_TOKEN"

def test_get_admin_dashboard_should_return_statistics_for_authorized_users():
    headers_auth = {
        "Authorization": ADMIN_AUTH_TOKEN,
        "Accept": "application/json"
    }

    headers_no_auth = {
        "Accept": "application/json"
    }
    # Test unauthorized access returns 401
    response_unauth = requests.get(
        f"{BASE_URL}{ADMIN_DASHBOARD_ENDPOINT}",
        headers=headers_no_auth,
        timeout=TIMEOUT
    )
    assert response_unauth.status_code == 401, (
        f"Expected status code 401 for unauthorized access, got {response_unauth.status_code}"
    )

    # Test authorized access returns 200 and dashboard stats
    response_auth = requests.get(
        f"{BASE_URL}{ADMIN_DASHBOARD_ENDPOINT}",
        headers=headers_auth,
        timeout=TIMEOUT
    )
    assert response_auth.status_code == 200, (
        f"Expected status code 200 for authorized access, got {response_auth.status_code}"
    )

    json_data = response_auth.json()
    # Validate presence of expected keys in the dashboard statistics
    expected_keys = [
        "userCounts",
        "financialMetrics",
        "recentFeedbacks"
    ]
    for key in expected_keys:
        assert key in json_data, f"Missing expected key '{key}' in dashboard response"

    # Further validation of userCounts
    user_counts = json_data.get("userCounts")
    assert isinstance(user_counts, dict), "userCounts should be a dictionary"
    assert "totalUsers" in user_counts and isinstance(user_counts["totalUsers"], int), "userCounts.totalUsers should be an integer"
    assert "activeUsers" in user_counts and isinstance(user_counts["activeUsers"], int), "userCounts.activeUsers should be an integer"

    # Further validation of financialMetrics
    financial_metrics = json_data.get("financialMetrics")
    assert isinstance(financial_metrics, dict), "financialMetrics should be a dictionary"
    financial_fields = ["totalIncome", "totalExpenses", "totalInvestments", "totalTithes"]
    for field in financial_fields:
        assert field in financial_metrics and isinstance(financial_metrics[field], (int, float)), f"financialMetrics.{field} should be a number"

    # Further validation of recentFeedbacks
    recent_feedbacks = json_data.get("recentFeedbacks")
    assert isinstance(recent_feedbacks, list), "recentFeedbacks should be a list"
    for feedback in recent_feedbacks:
        assert isinstance(feedback, dict), "Each feedback item should be a dictionary"
        assert "id" in feedback, "Each feedback should have an 'id'"
        assert "message" in feedback, "Each feedback should have a 'message'"
        assert "createdAt" in feedback, "Each feedback should have 'createdAt' timestamp"

test_get_admin_dashboard_should_return_statistics_for_authorized_users()