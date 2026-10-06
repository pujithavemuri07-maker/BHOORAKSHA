import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import declarative_base, sessionmaker
from src.config import settings

Base = declarative_base()

def _create_resilient_engine():
    # 1. Try configured DATABASE_URL (e.g. PostgreSQL)
    try:
        eng = create_engine(
            settings.DATABASE_URL,
            pool_pre_ping=True,
            pool_size=10,
            max_overflow=20,
            connect_args={"connect_timeout": 3} if "postgres" in settings.DATABASE_URL else {}
        )
        with eng.connect() as conn:
            conn.execute(text("SELECT 1"))
        return eng
    except Exception as e:
        # 2. Fallback to SQLite database file for 100% reliable persistence
        root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
        sqlite_path = os.path.join(root_dir, "bhooraksha.db")
        eng = create_engine(
            f"sqlite:///{sqlite_path}",
            connect_args={"check_same_thread": False}
        )
        return eng

engine = _create_resilient_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    try:
        from src.models import user, session, otp, oauth, audit  # noqa: F401
        Base.metadata.create_all(bind=engine)
    except Exception as e:
        print(f"[WARN] Auth DB initialization notice: {e}", flush=True)

init_db()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

