import uuid
from typing import Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Cookie, Response, BackgroundTasks
from sqlalchemy.orm import Session

from db.database import get_db, SessionLocal
from models.story import Story, StoryNode
from models.job import StoryJob
from schemas.story import (
    CompleteStoryNodeResponse, CompleteStoryResponse, CreateStoryRequest
)
from core.story_generator import StoryGenerator
from schemas.job import StoryJobResponse
# from core.story_generator import StoryGenerator

router = APIRouter(
    prefix="/stories",
    tags=["stories"]
)

def get_session_id(session_id: Optional[str] = Cookie(None)):
    if not session_id:
        session_id = str(uuid.uuid4())
    return session_id

@router.post("/create", response_model=StoryJobResponse)
def create_story(
    request: CreateStoryRequest, # passed params
    background_tasks: BackgroundTasks, # Task to run independently
    response: Response,
    session_id: str = Depends(get_session_id),
    db: Session = Depends(get_db)
):
    response.set_cookie(key="session_id", value=session_id, httponly=True)

    job_id = str(uuid.uuid4())

    # Create new job
    job = StoryJob(
        job_id=job_id,
        session_id=session_id,
        theme=request.theme,
        status="pending"
    )
    db.add(job)
    db.commit()

    # TODO: add background task.
    # Background task will run asyncronously along with create_story
    background_tasks.add_task(
        generate_story_task,
        job_id=job_id,
        theme=job.theme,
        session_id=session_id
    )

    return job

def generate_story_task(job_id: str, theme: str, session_id: str):
    # Necessary for create_story and generate_story_task to run async
    db = SessionLocal()

    job = db.query(StoryJob).filter(StoryJob.job_id == job_id).first()

    if not job:
        return

    # Handle Job Status to monitor story generation completion
    try:
        job.status = "processing"
        db.commit()
        
        story = StoryGenerator.generate_story(db, session_id, theme)

        job.story_id = story.id
        print(job.story_id)
        job.status = "complete"
        job.completed_at = datetime.now()
        db.commit()

    # ERROR Handling towards DB
    except Exception as e:
        job.status = "failed"
        job.completed_at = datetime.now()
        job.error = str(e)
        db.commit()
    finally:
        db.close()

@router.get("/{story_id}/complete", response_model=CompleteStoryResponse)
def get_complete_story(story_id: int, db: Session = Depends(get_db)):
    story = db.query(Story).filter(Story.id == story_id).first()
    if not story:
        raise HTTPException(status_code=404, detail="Story not found")
    
    complete_story = build_complete_story_tree(db, story)
    return complete_story


def build_complete_story_tree(db: Session, story: Story):
    nodes = db.query(StoryNode).filter(StoryNode.story_id == story.id)

    node_dict = {}
    for node in nodes:
        node_response = CompleteStoryNodeResponse(
            id=node.id,
            content=node.content,
            is_ending=node.is_ending,
            is_winning_ending=node.is_winning_ending,
            options=node.options
        )
        node_dict[node.id] = node_response
        
    root_node = next((node for node in nodes if node.is_root), None)

    if not root_node:
        raise HTTPException(status_code=500, detail="Story root node not found")

    return CompleteStoryResponse(
        id=story.id,
        title=story.title,
        session_id=story.session_id,
        created_at=story.created_at,
        root_node=node_dict[root_node.id],
        all_nodes=node_dict
    )