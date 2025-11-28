import requests

BASE_URL = "http://localhost:3000"
WEBHOOK_ENDPOINT = f"{BASE_URL}/api/webhooks/clerk"
TIMEOUT = 30
HEADERS = {"Content-Type": "application/json"}

def test_clerk_webhook_should_handle_authentication_events():
    # Define valid payloads for user creation, update, and deletion events.
    events = [
        {
            "type": "user.created",
            "data": {
                "id": "user_123",
                "email_addresses": ["testuser_create@example.com"],
                "first_name": "Test",
                "last_name": "Create"
            }
        },
        {
            "type": "user.updated",
            "data": {
                "id": "user_123",
                "email_addresses": ["testuser_update@example.com"],
                "first_name": "TestUpdated",
                "last_name": "Update"
            }
        },
        {
            "type": "user.deleted",
            "data": {
                "id": "user_123"
            }
        }
    ]

    for event in events:
        try:
            response = requests.post(
                WEBHOOK_ENDPOINT,
                json=event,
                headers=HEADERS,
                timeout=TIMEOUT,
            )
        except requests.RequestException as e:
            assert False, f"Request failed: {e}"

        # The expected behavior is a 200 status for successful handling of the event
        assert response.status_code == 200, f"Unexpected status code: {response.status_code} for event type {event['type']}"

        # The response content may be empty or contain some acknowledgement; accept 2xx and JSON or empty response
        content_type = response.headers.get("Content-Type", "")
        if content_type.startswith("application/json"):
            try:
                json_resp = response.json()
                # Optionally check for presence of keys if known, else just confirm it's a dict
                assert isinstance(json_resp, dict), "Response JSON is not a dictionary"
            except ValueError:
                assert False, "Response indicated JSON but failed to parse"
        else:
            # Allow empty or no content
            assert response.text.strip() == "" or response.text, "Unexpected non-JSON non-empty response"

test_clerk_webhook_should_handle_authentication_events()
