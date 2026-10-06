import re

def validate_password_strength(password: str) -> bool:
    if len(password) < 8:
        return False
    return True
