"""
Quiz Answer Management API Router

Provides REST API endpoints for managing quiz answers, scores, and rankings.

Operations:
* Submit new answers
* Retrieve answers (by answer ID, user ID, or question ID)
* Update scores and rankings
* Delete answers

Features:
* Automatic score calculation
* Ranking system
* Detailed answer statistics
* Multiple retrieval methods
"""

from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import backend.crud.answer as crud
import backend.crud.user as user_crud
from backend.api.deps import get_db
from backend.schemas.answer import Answer, AnswerCreate, AnswerDetail

router = APIRouter()


@router.post("/answer/", response_model=Answer)
def create_answer(answer: AnswerCreate, db: Session = Depends(get_db)):
    """
    Submit a new answer for a quiz question.

    Args:
    - **answer**: Answer creation model with required fields
        - user_id: ID of the user submitting the answer
        - question_id: ID of the question being answered
        - content: Answer text

    Returns:
    - **Answer**: Created answer record

    Notes:
    - Duplicate submissions for the same question by the same user are not allowed
    """
    return crud.create_answer(db=db, answer=answer)


@router.get("/answer/best_pair/all")
def get_best_pairs(db: Session = Depends(get_db)):
    """
    Get the best answer pairs.

    Returns:
    - **List[AnswerDetail]**: List of best answer pairs for each question
    """
    best_pairs = crud.get_best_pairs(db)
    max_score = 0
    max_pairs = (None, None)
    for pair in best_pairs:
        user1 = user_crud.read_by_id(db, pair[0].user_id)
        user2 = user_crud.read_by_id(db, pair[1].user_id)
        if user1.total_score + user2.total_score > max_score:
            max_score = user1.total_score + user2.total_score
            max_pairs = (user1, user2)
    ans_log1 = crud.read_by_user_id(db, max_pairs[0].user_id)
    ans_log2 = crud.read_by_user_id(db, max_pairs[1].user_id)
    ans_content1 = [ans.content for ans in ans_log1]
    ans_content2 = [ans.content for ans in ans_log2]
    return [max_pairs, ans_content1, ans_content2]


@router.get("/answer/best_newbie/all")
def get_best_newbie(db: Session = Depends(get_db)):
    """
    Get the best newbie answer pairs.

    Returns:
    - **User**: Best newbie user
    """
    best_trainees = crud.get_best_newbiew_trainee(db)
    max_score = 0
    max_user = None
    for idx in best_trainees:
        user = user_crud.read_by_id(db, idx)
        if user.total_score > max_score:
            max_score = user.total_score
            max_user = user
    return max_user


@router.get("/answer/{answer_id}", response_model=Answer)
def read_answer_by_answer_id(answer_id: int, db: Session = Depends(get_db)):
    """
    Get specific answer by its ID.

    Args:
    - **answer_id**: Unique identifier of the answer

    Returns:
    - **Answer**: Retrieved answer record

    Raises:
    - **404**: Answer not found
    """
    answer = crud.read_by_answer_id(db, answer_id)
    if answer is None:
        raise HTTPException(status_code=404, detail="Answer not found")
    return answer


@router.get("/answer/user/{user_id}", response_model=List[Answer])
def read_answer_by_user_id(user_id: int, db: Session = Depends(get_db)):
    """
    Get all answers submitted by a specific user.

    Args:
    - **user_id**: ID of the user whose answers to retrieve

    Returns:
    - **List[Answer]**: List of user's answer records

    Notes:
    - Returns empty list if user has no answers
    - Answers are ordered by submission time (oldest first)
    """
    return crud.read_by_user_id(db, user_id)


@router.get("/answer/question/{question_id}", response_model=List[AnswerDetail])
def read_answer_by_question_id(question_id: int, db: Session = Depends(get_db)):
    """
    Get all answers for a specific question with detailed information.

    Args:
    - **question_id**: ID of the question to get answers for

    Returns:
    - **List[AnswerDetail]**: List of detailed answer records including:
        - User's id
        - Question id
        - content
        - Answer id
        - score
        - rank
        - User's last name
        - User's first name
        - User's department
        - User's is_admin

    Notes:
    - Returns empty list if no answers found
    - Answers are ordered by rank (highest first), then content
    """
    return crud.read_by_question_id(db, question_id)


@router.get("/answer/", response_model=List[Answer])
def read_all_answers(db: Session = Depends(get_db)):
    """
    Get all answers in the system.

    Returns:
    - **List[Answer]**: List of all answer records

    """
    return crud.read_all(db)


@router.put("/answer/score/{question_id}")
def update_scores(question_id: int, db: Session = Depends(get_db)):
    """
    Update scores for all answers to a specific question.

    Args:
    - **question_id**: ID of the question to update scores for

    Returns:
    - Dictionary containing updated score information

    Notes:
    - Recalculates scores based on current scoring criteria
    - Does not affect rankings (use update_all for both)
    """
    return crud.update_scores(db, question_id)


@router.put("/answer/rank/{question_id}")
def update_ranks(question_id: int, db: Session = Depends(get_db)):
    """
    Update rankings for all answers to a specific question.

    Args:
    - **question_id**: ID of the question to update rankings for

    Returns:
    - Dictionary containing updated ranking information

    Notes:
    - Recalculates rankings based on current scores
    - Does not update scores (use update_all for both)
    """
    return crud.update_ranks(db, question_id)


@router.put("/answer/all/{question_id}")
def update_all(question_id: int, db: Session = Depends(get_db)):
    """
    Update both scores and rankings for a question.

    Args:
    - **question_id**: ID of the question to update

    Returns:
    - **dict**: Success confirmation message

    Process:
    1. Updates all answer scores
    2. Recalculates rankings based on new scores
    """
    crud.update_scores(db, question_id)
    crud.update_ranks(db, question_id)
    return {
        "message": "Scores and ranks updated",
        "status": "success",
        "question_id": question_id,
    }


@router.delete("/answer/answer_id/{answer_id}", response_model=Answer)
def delete_answer_by_answer_id(answer_id: int, db: Session = Depends(get_db)):
    """
    Delete a specific answer.

    Args:
    - **answer_id**: ID of the answer to delete

    Returns:
    - **Answer**: Deleted answer record

    Raises:
    - **404**: Answer not found
    """
    answer = crud.delete_by_answer_id(db, answer_id)
    if answer is None:
        raise HTTPException(status_code=404, detail="Answer not found")
    return answer


@router.delete("/answer/user_id/{user_id}", tags=["deletion"])
def delete_answer_by_user_id(user_id: int, db: Session = Depends(get_db)):
    """
    Delete all answers by a specific user.

    Args:
    - **user_id**: ID of the user whose answers to delete

    Returns:
    - **dict**: Deletion summary

    Notes:
    - This is a permanent operation
    - Triggers recalculation of rankings if necessary
    """
    return crud.delete_by_user_id(db, user_id)


@router.delete("/answer/question_id/{question_id}")
def delete_answer_by_question_id(question_id: int, db: Session = Depends(get_db)):
    """
    Delete all answers for a specific question.

    Args:
    - **question_id**: ID of the question whose answers to delete

    Returns:
    - **dict**: Deletion summary

    Notes:
    - This is a permanent operation
    - Typically used when a question is invalidated
    """
    return crud.delete_by_question_id(db, question_id)
