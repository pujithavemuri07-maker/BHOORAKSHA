try:
    from celery import Celery
    HAS_CELERY = True
except ImportError:
    HAS_CELERY = False
    class Celery:
        def __init__(self, name, broker=None, backend=None):
            self.main = name
            self.conf = type("Conf", (), {"timezone": "Asia/Kolkata", "update": lambda *a, **kw: None})()
        def task(self, *args, **kwargs):
            def decorator(func):
                return func
            return decorator

from src.config import settings

celery_app = Celery(
    "bhooraksha_tasks",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND,
)

if HAS_CELERY:
    celery_app.conf.update(
        task_serializer="json",
        accept_content=["json"],
        result_serializer="json",
        timezone="Asia/Kolkata",
        enable_utc=True,
        task_track_started=True,
        task_time_limit=300,
    )
