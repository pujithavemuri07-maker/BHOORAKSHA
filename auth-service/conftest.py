import sys
from pathlib import Path

# Ensure auth-service root is in sys.path so tests can import src.*
auth_dir = str(Path(__file__).parent.resolve())
if auth_dir not in sys.path:
    sys.path.insert(0, auth_dir)
