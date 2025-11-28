import requests

BASE_URL = "http://localhost:3000"
API_PATH = "/api/admin/settings"
FULL_URL = BASE_URL + API_PATH
TIMEOUT = 30

# Replace this with a valid admin auth token for Clerk authentication
ADMIN_AUTH_TOKEN = "YOUR_ADMIN_AUTH_TOKEN"

headers = {
    "Authorization": f"Bearer {ADMIN_AUTH_TOKEN}",
    "Content-Type": "application/json",
    "Accept": "application/json"
}

def admin_settings_should_get_and_update_settings():
    # Step 1: GET current settings
    response_get = requests.get(FULL_URL, headers=headers, timeout=TIMEOUT)
    assert response_get.status_code == 200, f"GET /api/admin/settings failed with status {response_get.status_code}"
    try:
        settings = response_get.json()
    except Exception:
        assert False, "GET /api/admin/settings did not return valid JSON"

    # Validate key exists in settings object, could be empty or contain keys
    assert isinstance(settings, dict), "Settings response is not a JSON object"

    # Prepare update payload: Toggle or add a test property "testUpdateFlag"
    # If property exists and is a boolean, toggle it, else set to True
    test_flag = settings.get("testUpdateFlag", False)
    new_flag_value = not test_flag if isinstance(test_flag, bool) else True

    updated_settings = dict(settings)
    updated_settings["testUpdateFlag"] = new_flag_value

    # Step 2: PUT update settings
    response_put = requests.put(FULL_URL, headers=headers, json=updated_settings, timeout=TIMEOUT)
    assert response_put.status_code == 200, f"PUT /api/admin/settings failed with status {response_put.status_code}"
    try:
        updated_response = response_put.json()
    except Exception:
        assert False, "PUT /api/admin/settings did not return valid JSON"

    # Validate the updated value matches what was sent
    assert isinstance(updated_response, dict), "Updated settings response is not a JSON object"
    assert updated_response.get("testUpdateFlag") == new_flag_value, "Updated setting value does not match expected"

    # Step 3: GET settings again to verify update persisted
    response_get_after = requests.get(FULL_URL, headers=headers, timeout=TIMEOUT)
    assert response_get_after.status_code == 200, f"GET after update failed with status {response_get_after.status_code}"
    try:
        settings_after = response_get_after.json()
    except Exception:
        assert False, "GET after update did not return valid JSON"

    assert settings_after.get("testUpdateFlag") == new_flag_value, "Persisted setting value does not match updated value"


admin_settings_should_get_and_update_settings()
