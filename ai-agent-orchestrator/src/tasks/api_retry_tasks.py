from src.tasks.celery_app import celery_app

@celery_app.task(bind=True, max_retries=3, default_retry_delay=5)
def retry_state_api_call(self, state: str, survey_number: str):
    """Retries state portal API query upon network timeout."""
    try:
        # State gateway query simulation
        return {"status": "SUCCESS", "survey": survey_number, "state": state}
    except Exception as exc:
        raise self.retry(exc=exc)
