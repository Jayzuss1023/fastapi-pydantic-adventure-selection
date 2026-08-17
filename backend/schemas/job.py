from typing import Optional
from datetime import datetime
from pydantic import BaseModel

class StoryJobBase(BaseModel):
    theme: str

class StoryJobResponse(BaseModel):
    job_id: str
    status: str
    created_at: datetime
    story_id: Optional[int] = None # In case story hasn't been generated yet
    completed_at: Optional[datetime] = None # Story is still being played out. Not finished
    error: Optional[str] = None

    class Config:
        from_attributes = True

class StoryJobCreate(StoryJobBase):
    pass