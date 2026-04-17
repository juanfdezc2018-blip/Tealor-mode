from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
import uuid


class Download(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    resource_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


class ClickTrack(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    button_type: str  # 'social', 'download', 'cta'
    button_name: str  # 'youtube', 'tiktok', 'instagram', 'download-primary', etc
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


class DownloadResponse(BaseModel):
    success: bool
    message: str
    download_count: Optional[int] = None


class TrackResponse(BaseModel):
    success: bool
    message: str
