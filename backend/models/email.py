from pydantic import BaseModel, Field, EmailStr
from datetime import datetime
from typing import Optional
import uuid


class EmailCapture(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    source: str = "landing_page"  # landing_page, footer_cta, hero_cta
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    downloaded_pdf: bool = False

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


class EmailCaptureRequest(BaseModel):
    email: EmailStr
    source: str = "landing_page"


class EmailCaptureResponse(BaseModel):
    success: bool
    message: str
    email: str


class EmailListResponse(BaseModel):
    success: bool
    total_emails: int
    emails: list
