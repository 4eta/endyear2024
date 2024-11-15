import random

from fastapi import APIRouter, Depends

import backend.crud.answer as answer_crud
import backend.crud.progress as progress_crud
import backend.crud.user as user_crud
from backend.db.session import SessionLocal
from backend.schemas.answer import AnswerCreate
from backend.schemas.progress import ProgressCreate
from backend.schemas.user import UserCreate

departments = ["HA", "IM", "AMB", "DSG1", "DSG2", "DLG", "CIG", "BXDC"]
answers = [f"answer{i}" for i in range(50)]


def prepare() -> None:
    db = SessionLocal()

    # ユーザーの作成
    n = 200
    for i in range(n):
        user = UserCreate(
            first_name=f"first{i}",
            last_name=f"last{i}",
            department=random.choice(departments),
        )
        user_crud.create_user(db, user=user)

    # 進捗管理の作成
    progress = ProgressCreate(status=0)
    progress_crud.create_progress(db, progress=progress)

    # 回答の作成
    for q in range(6):
        for i in range(n):
            answer = AnswerCreate(
                user_id=i + 1, question_id=q, content=random.choice(answers)
            )
            answer_crud.create_answer(db, answer=answer)


prepare()
