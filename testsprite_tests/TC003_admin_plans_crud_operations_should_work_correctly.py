import requests
import uuid

BASE_URL = "http://localhost:3000"
TIMEOUT = 30

# Authentication token: replace with valid token for the admin user with proper permissions
ADMIN_AUTH_TOKEN = "your_admin_auth_token_here"

HEADERS = {
    "Authorization": f"Bearer {ADMIN_AUTH_TOKEN}",
    "Content-Type": "application/json",
    "Accept": "application/json"
}

def admin_plans_crud_operations_should_work_correctly():
    plan_id = None
    created_plan_id = None
    url_plans = f"{BASE_URL}/api/admin/plans"

    # Sample new plan data for creation
    new_plan_data = {
        "name": f"Test Plan {uuid.uuid4()}",
        "description": "Plan created during automated test",
        "price": 1999,  # price in cents or integer value as expected
        "currency": "USD",
        "interval": "month",
        "trial_period_days": 14,
        "features": ["feature1", "feature2"],
        "active": True
    }

    # Updated plan data for update
    updated_plan_data = {
        "name": "Updated " + new_plan_data["name"],
        "description": "Updated plan description",
        "price": 2999,
        "currency": "USD",
        "interval": "month",
        "trial_period_days": 7,
        "features": ["feature1", "feature2", "feature3"],
        "active": False
    }

    try:
        # 1. Create a new plan via POST
        resp_create = requests.post(url_plans, json=new_plan_data, headers=HEADERS, timeout=TIMEOUT)
        assert resp_create.status_code == 201 or resp_create.status_code == 200, f"Create plan failed with status {resp_create.status_code}"
        create_json = resp_create.json()
        assert "id" in create_json, "Response missing 'id' in create plan"
        created_plan_id = create_json["id"]

        # 2. Retrieve the list of all plans via GET, confirm created plan exists
        resp_list = requests.get(url_plans, headers=HEADERS, timeout=TIMEOUT)
        assert resp_list.status_code == 200, f"List plans failed with status {resp_list.status_code}"
        plans_list = resp_list.json()
        assert any(p.get("id") == created_plan_id for p in plans_list), "Created plan not found in plans list"

        # 3. Update the created plan via PUT
        url_plan_id = f"{url_plans}/{created_plan_id}"
        resp_update = requests.put(url_plan_id, json=updated_plan_data, headers=HEADERS, timeout=TIMEOUT)
        assert resp_update.status_code == 200, f"Update plan failed with status {resp_update.status_code}"
        updated_json = resp_update.json()
        # Check updated values
        assert updated_json.get("name") == updated_plan_data["name"], "Plan name not updated correctly"
        assert updated_json.get("description") == updated_plan_data["description"], "Plan description not updated correctly"
        assert updated_json.get("price") == updated_plan_data["price"], "Plan price not updated correctly"
        assert updated_json.get("trial_period_days") == updated_plan_data["trial_period_days"], "Plan trial_period_days not updated correctly"
        assert updated_json.get("active") == updated_plan_data["active"], "Plan active flag not updated correctly"

        # 4. Delete the created plan via DELETE
        resp_delete = requests.delete(url_plan_id, headers=HEADERS, timeout=TIMEOUT)
        assert resp_delete.status_code == 204 or resp_delete.status_code == 200, f"Delete plan failed with status {resp_delete.status_code}"

        # 5. Verify the plan was deleted: GET the list and confirm absence
        resp_list_after_delete = requests.get(url_plans, headers=HEADERS, timeout=TIMEOUT)
        assert resp_list_after_delete.status_code == 200, f"List plans after delete failed with status {resp_list_after_delete.status_code}"
        plans_list_after_delete = resp_list_after_delete.json()
        assert all(p.get("id") != created_plan_id for p in plans_list_after_delete), "Deleted plan still present in plans list"

    except requests.RequestException as e:
        assert False, f"HTTP request failed: {e}"

    except AssertionError:
        # If the created plan still exists during a failure, attempt to delete to clean up
        if created_plan_id:
            try:
                requests.delete(f"{url_plans}/{created_plan_id}", headers=HEADERS, timeout=TIMEOUT)
            except Exception:
                pass
        raise

# call the test function
admin_plans_crud_operations_should_work_correctly()
