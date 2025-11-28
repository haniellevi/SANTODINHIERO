import requests

def test_get_public_plans_should_return_list_of_public_plans():
    base_url = "http://localhost:3000"
    url = f"{base_url}/api/public/plans"
    headers = {
        "Accept": "application/json"
    }
    try:
        response = requests.get(url, headers=headers, timeout=30)
        response.raise_for_status()
    except requests.RequestException as e:
        assert False, f"Request to GET /api/public/plans failed: {e}"

    assert response.status_code == 200, f"Expected status code 200 but got {response.status_code}"

    try:
        response_json = response.json()
    except ValueError:
        assert False, "Response is not valid JSON"

    # If response is a dict, try to get the list from 'plans' key or verify the dict contains a list value
    if isinstance(response_json, list):
        plans_list = response_json
    elif isinstance(response_json, dict) and "plans" in response_json and isinstance(response_json["plans"], list):
        plans_list = response_json["plans"]
    else:
        assert False, "Response JSON does not contain list of plans"

    assert isinstance(plans_list, list), "Plans is not a list"


test_get_public_plans_should_return_list_of_public_plans()