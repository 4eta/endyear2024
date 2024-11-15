"""
Progress Management API Router

Provides REST API endpoints for managing progress tracking operations.

Operations:
* Create new progress records
* Retrieve progress information
* Update progress status
* Delete progress records

Status Codes:
* 100n+m: n = question id, m = status code
* m = 0: Not Started
* m = 1: Quiz Started
* m = 2: Quiz Completed
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import backend.crud.progress as crud
from backend.api.deps import get_db
from backend.schemas.progress import Progress, ProgressCreate

router = APIRouter()


@router.post("/progress/", response_model=Progress)
def create_progress(progress: ProgressCreate, db: Session = Depends(get_db)):
    """
    Create a new progress record.

    Args:
    - **progress**: Progress creation model with required fields
        - status: Initial status code (default: 0)

    Returns:
    - **Progress**: Created progress record

    Notes:
    - Status defaults to 0 (Not Started) if not specified
    """
    return crud.create_progress(db=db, progress=progress)


@router.get("/progress/{progress_id}", response_model=Progress)
def read_progress(progress_id: int, db: Session = Depends(get_db)):
    """
    Get progress record by ID.

    Args:
    - **progress_id**: Unique identifier of the progress record

    Returns:
    - **Progress**: Retrieved progress record

    Raises:
    - **404**: Progress record not found
    """
    db_progress = crud.read_by_id(db, progress_id=progress_id)
    if db_progress is None:
        raise HTTPException(status_code=404, detail="Progress record not found")
    return db_progress


@router.put("/progress/{progress_id}", response_model=Progress)
def update_progress(progress_id: int, status: int, db: Session = Depends(get_db)):
    """
    Update progress status.

    Args:
    - **progress_id**: ID of the progress record to update
    - **status**: New status code
        - 100n+m: n = question id, m = status code
        - m = 0: Not Started
        - m = 1: Quiz Started
        - m = 2: Quiz Completed

    Returns:
    - **Progress**: Updated progress record

    Raises:
    - **404**: Progress record not found

    """
    progress = crud.update_progress(db, progress_id, status)
    if progress is None:
        raise HTTPException(status_code=404, detail="Progress record not found")
    return progress


@router.delete("/progress/{progress_id}", response_model=Progress)
def delete_progress(progress_id: int, db: Session = Depends(get_db)):
    """
    Delete a progress record.

    Args:
    - **progress_id**: ID of the progress record to delete

    Returns:
    - **Progress**: Deleted progress record

    Raises:
    - **404**: Progress record not found
    """
    progress = crud.delete_progress(db, progress_id)
    if progress is None:
        raise HTTPException(status_code=404, detail="Progress record not found")
    return progress
