from typing import Generic, TypeVar, Optional, Any, Dict
from pydantic import BaseModel
import uuid

T = TypeVar("T")

class ErrorDetail(BaseModel):
    code: str
    message: str
    details: Optional[Dict[str, Any]] = None

class ApiResponse(BaseModel, Generic[T]):
    success: bool = True
    data: Optional[T] = None
    message: Optional[str] = None
    request_id: str

    @classmethod
    def ok(cls, data: T, message: str = "Operation completed successfully", request_id: Optional[str] = None) -> "ApiResponse[T]":
        return cls(
            success=True,
            data=data,
            message=message,
            request_id=request_id or f"req-{uuid.uuid4().hex[:12]}"
        )

    @classmethod
    def fail(cls, code: str, message: str, details: Optional[Dict[str, Any]] = None, request_id: Optional[str] = None) -> Dict[str, Any]:
        return {
            "success": False,
            "error": {
                "code": code,
                "message": message,
                "details": details or {}
            },
            "request_id": request_id or f"req-{uuid.uuid4().hex[:12]}"
        }
