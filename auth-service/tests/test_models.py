from src.schemas.user import UserCreate, UserResponse
import uuid
from datetime import datetime, timezone

def test_user_schema_validation():
    payload = {
        "email": "user@bhooraksha.gov.in",
        "full_name": "Test Citizen",
        "role": "citizen",
        "password": "Password@123",
        "preferred_language": "hi",
    }
    user = UserCreate(**payload)
    assert user.email == "user@bhooraksha.gov.in"
    assert user.role == "citizen"
    assert user.preferred_language == "hi"
