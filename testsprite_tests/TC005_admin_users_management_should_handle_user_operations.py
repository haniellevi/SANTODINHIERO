import requests
import uuid

BASE_URL = "http://localhost:3000"
TIMEOUT = 30

# Replace with valid admin Bearer token from Clerk authentication
AUTH_TOKEN = "Bearer YOUR_ADMIN_AUTH_TOKEN"

HEADERS = {
    "Authorization": AUTH_TOKEN,
    "Content-Type": "application/json",
    "Accept": "application/json",
}

def admin_users_management_should_handle_user_operations():
    created_user_id = None
    invited_user_email = f"testuser_{uuid.uuid4().hex[:8]}@example.com"
    invited_user_id = None

    try:
        # 1. List users GET /api/admin/users
        resp = requests.get(f"{BASE_URL}/api/admin/users", headers=HEADERS, timeout=TIMEOUT)
        assert resp.status_code == 200, f"List users failed: {resp.text}"
        users_list = resp.json()
        assert isinstance(users_list, list), "Users list should be an array"

        # 2. Invite new user POST /api/admin/users/invite
        invite_payload = {
            "email": invited_user_email,
            "permissionLevel": "USER"
        }
        resp = requests.post(f"{BASE_URL}/api/admin/users/invite", headers=HEADERS, json=invite_payload, timeout=TIMEOUT)
        assert resp.status_code == 200 or resp.status_code == 201, f"Invite user failed: {resp.text}"
        invited_response = resp.json()
        invited_user_id = invited_response.get("id")
        assert invited_user_id, "Invited user id should be present"

        # 3. Sync users with Clerk POST /api/admin/users/sync
        resp = requests.post(f"{BASE_URL}/api/admin/users/sync", headers=HEADERS, timeout=TIMEOUT)
        assert resp.status_code == 200, f"Sync users failed: {resp.text}"
        sync_resp = resp.json()
        assert isinstance(sync_resp, dict), "Sync response should be a dict"

        # 4. Get user details GET /api/admin/users/{id}
        # Use an existing user id from users list or fallback to invited user id
        target_user_id = users_list[0].get("id") if users_list else invited_user_id
        assert target_user_id, "No user available for detail fetch"
        resp = requests.get(f"{BASE_URL}/api/admin/users/{target_user_id}", headers=HEADERS, timeout=TIMEOUT)
        assert resp.status_code == 200, f"Get user details failed: {resp.text}"
        user_details = resp.json()

        # 5. Update user PATCH /api/admin/users/{id}
        update_payload = {}
        # Attempt to toggle 'isActive' or update 'name' if present in user_details
        if "name" in user_details:
            new_name = user_details["name"] + " Updated"
            update_payload = {"name": new_name}
        else:
            # If no 'name', add a dummy field for patch test (assuming email can't be changed)
            update_payload = {}

        if update_payload:
            resp = requests.patch(f"{BASE_URL}/api/admin/users/{target_user_id}", headers=HEADERS, json=update_payload, timeout=TIMEOUT)
            assert resp.status_code == 200, f"Update user failed: {resp.text}"
            updated_user = resp.json()
            for k, v in update_payload.items():
                assert updated_user.get(k) == v, f"User {k} not updated"

        # 6. Activate user POST /api/admin/users/{id}/activate
        resp = requests.post(f"{BASE_URL}/api/admin/users/{target_user_id}/activate", headers=HEADERS, timeout=TIMEOUT)
        # Activation may succeed (200) or be idempotent; accept 200 or 204
        assert resp.status_code in (200, 204), f"Activate user failed: {resp.text}"

    finally:
        # Clean up: delete invited user if created
        if invited_user_id:
            requests.delete(f"{BASE_URL}/api/admin/users/{invited_user_id}", headers=HEADERS, timeout=TIMEOUT)

admin_users_management_should_handle_user_operations()