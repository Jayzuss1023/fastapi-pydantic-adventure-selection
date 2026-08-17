from typing import Any
from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from sqlalchemy.orm import Mapped, mapped_column
from models.job import StoryJob

from db.database import Base

class Story(Base):
    __tablename__ = "stories"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String, index=True)
    session_id: Mapped[str] = mapped_column(String, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    nodes: Mapped["StoryNode"] = relationship(back_populates="story")

class StoryNode(Base):
    __tablename__ = "story_nodes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    story_id: Mapped[int] = mapped_column(Integer, ForeignKey("stories.id"))
    content: Mapped[str] = mapped_column(String)
    is_root: Mapped[bool] = mapped_column(Boolean, default=False)
    is_ending: Mapped[bool] = mapped_column(Boolean, default=False)
    is_winning_ending:Mapped[bool] = mapped_column(Boolean, default=False)
    options: Mapped[list[Any]] = mapped_column(JSON, default=list)

    story: Mapped["Story"] = relationship(back_populates="nodes")