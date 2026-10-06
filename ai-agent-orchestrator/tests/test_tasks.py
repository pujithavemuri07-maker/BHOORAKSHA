from src.tasks.celery_app import celery_app

def test_celery_app_configuration():
    assert celery_app.main == "bhooraksha_tasks"
    assert celery_app.conf.timezone == "Asia/Kolkata"
