import asyncio
from src.tasks.celery_app import celery_app
from src.crew import crew

@celery_app.task(name="process_document_pipeline")
def process_document_pipeline(context: dict):
    """
    Celery background worker task for full multi-agent verification pipeline.
    """
    loop = asyncio.get_event_loop()
    if loop.is_closed():
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
    return loop.run_until_complete(crew.run_pipeline(context))
