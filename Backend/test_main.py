import os
from types import SimpleNamespace
from unittest.mock import MagicMock

os.environ.setdefault("SUPABASE_URL", "https://example.supabase.co")
os.environ.setdefault("SUPABASE_KEY", "test-key")

from fastapi.testclient import TestClient
import main


def test_checkusergroup_rejects_missing_token():
    response = TestClient(main.app).get("/checkusergroup")
    assert response.status_code == 200
    assert response.json() is False


def test_checkusergroup_accepts_authenticated_user_with_group(monkeypatch):
    supabase = MagicMock()
    supabase.auth.get_user.return_value = SimpleNamespace(user=SimpleNamespace(id="user-1"))
    query = MagicMock()
    query.execute.return_value = SimpleNamespace(data={"group_id": 7})
    supabase.table.return_value.select.return_value.eq.return_value.maybe_single.return_value = query
    monkeypatch.setattr(main, "supabase", supabase)

    response = TestClient(main.app).get(
        "/checkusergroup", headers={"Authorization": "Bearer valid-token"}
    )

    assert response.status_code == 200
    assert response.json() is True
    supabase.auth.get_user.assert_called_once_with("valid-token")
