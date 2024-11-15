"""
User Management API Router

Provides REST API endpoints for user management operations.

Operations:
* Create new users
* Retrieve users (by ID, attributes, or all)
* Update user admin status
* Process quiz results
* Delete users
"""

from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

import backend.crud.user as crud
from backend.api.deps import get_db
from backend.schemas.user import User, UserCreate

router = APIRouter()


@router.post("/user/", response_model=User)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    """
    Create a new user.

    Args:
    - **user**: User creation model with required fields
        - first_name: User's first name
        - last_name: User's last name
        - department: User's department

    Returns:
    - **User**: Created user object
    """
    return crud.create_user(db=db, user=user)


@router.get("/user/", response_model=User)
def read_user(
    first_name: str, last_name: str, department: str, db: Session = Depends(get_db)
):
    """
    Get user by attributes or create if not exists.

    Args:
    - **first_name**: User's first name
    - **last_name**: User's last name
    - **department**: User's department

    Returns:
    - **User**: Existing or newly created user

    Note:
    - Creates new user if no match is found
    - This is the preferred method for user creation
    """
    db_user = crud.read_by_field(
        db, first_name=first_name, last_name=last_name, department=department
    )
    if db_user is None:
        db_user = crud.create_user(
            db=db,
            user=UserCreate(
                first_name=first_name, last_name=last_name, department=department
            ),
        )
    return db_user


@router.get("/user/{user_id}", response_model=User)
def read_user_by_id(user_id: int, db: Session = Depends(get_db)):
    """
    Get user by ID.

    Args:
    - **user_id**: Unique identifier of the user

    Returns:
    - **User**: Retrieved user object
    """
    return crud.read_by_id(db, user_id=user_id)


@router.get("/user/list/all", response_model=List[User])
def read_users(db: Session = Depends(get_db)):
    """
    Get all users.

    Returns:
    - **List[User]**: Array of all user objects
    """
    return crud.read_all(db)


@router.put("/user/admin/{user_id}", response_model=User)
def update_user_admin(user_id: int, is_admin: bool, db: Session = Depends(get_db)):
    """
    Update user's admin status.

    Args:
    - **user_id**: ID of user to update
    - **is_admin**: New admin status (true/false)

    Returns:
    - **User**: Updated user object

    Requires:
    - Admin privileges
    """
    return crud.update_admin(db, user_id, is_admin)


@router.put("/user/{question_id}")
def update_users_info(question_id: int, db: Session = Depends(get_db)):
    """
    Update user data after quiz completion.

    Args:
    - **question_id**: ID of completed quiz question

    Actions:
    1. Updates scores based on quiz results
    2. Recalculates user rankings

    Returns:
    - **dict**: Success confirmation message
    """
    crud.update_scores(db, question_id)
    crud.update_ranks(db)
    return {"message": "Users updated successfully.", "status": "success"}


@router.delete("/user/{user_id}", response_model=User)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    """
    Delete a user.

    Args:
    - **user_id**: ID of user to delete

    Returns:
    - **User**: Deleted user object

    Requires:
    - Admin privileges
    """
    return crud.delete_by_id(db, user_id)
