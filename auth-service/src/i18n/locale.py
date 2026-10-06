from fastapi import Request

def get_locale_from_request(request: Request) -> str:
    lang = request.headers.get("Accept-Language", "en")
    return lang.split(",")[0].split("-")[0]
