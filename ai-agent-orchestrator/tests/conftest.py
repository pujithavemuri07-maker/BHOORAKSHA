import sys
from pathlib import Path
import pytest
import warnings

orchestrator_dir = str(Path(__file__).parent.parent.resolve())
if orchestrator_dir not in sys.path:
    sys.path.insert(0, orchestrator_dir)

try:
    from starlette.exceptions import StarletteDeprecationWarning
    warnings.filterwarnings("ignore", category=StarletteDeprecationWarning)
except ImportError:
    pass

from src.main import app
from src.database import get_db
from tests.test_doubles import TestDBSessionDouble

@pytest.fixture(autouse=True)
def override_db_dependency():
    """
    Unit Test Fixture: Overrides get_db with an isolated TestDBSessionDouble.
    Keeps production code strictly PostgreSQL-backed while allowing unit tests
    to execute fast and deterministically in environments without a live PostgreSQL daemon.
    """
    test_session = TestDBSessionDouble()
    app.dependency_overrides[get_db] = lambda: test_session
    yield test_session
    app.dependency_overrides.pop(get_db, None)
