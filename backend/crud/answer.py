from collections import Counter

from sqlalchemy.orm import Session

import backend.models as models
import backend.schemas.answer as schemas

# DBにアクセスするためのCRUD関数(CRUD = Create, Read, Update, Delete)を定義


# create
def create_answer(db: Session, answer: schemas.AnswerCreate):
    # AnswerCreateの情報をもとにAnswerを作成
    db_answer = models.Answer(
        user_id=answer.user_id, question_id=answer.question_id, content=answer.content
    )
    db.add(db_answer)
    db.commit()
    db.refresh(db_answer)
    return db_answer


# read
def read_by_answer_id(db: Session, answer_id: int):
    # answer_idが一致するAnswerを取得
    return db.query(models.Answer).filter(models.Answer.answer_id == answer_id).first()


def read_by_user_id(db: Session, user_id: int):
    # user_idが一致するAnswerをすべて取得
    return db.query(models.Answer).filter(models.Answer.user_id == user_id).all()


def read_by_question_id(db: Session, question_id: int):
    # question_idが一致するAnswerをすべて取得
    # スコアの高い順に並べた後、answer.contentの順番で並べる
    # answerのuser_idとuserのuser_idが一致するuserの情報もinner joinして取得

    # inner joinして取得
    return (
        db.query(
            models.Answer,
            models.Answer.user_id,
            models.User.last_name,
            models.User.first_name,
            models.User.department,
            models.Answer.answer_id,
            models.Answer.question_id,
            models.Answer.content,
            models.Answer.score,
            models.Answer.rank,
        )
        .join(models.User, models.Answer.user_id == models.User.user_id)
        .filter(models.Answer.question_id == question_id)
        .order_by(models.Answer.score.desc(), models.Answer.content)
        .all()
    )


def read_all(db: Session):
    # 全てのAnswerを取得
    return db.query(models.Answer).all()


# update
def update_scores(db: Session, question_id: int):
    # question_idが一致するanswerをもとに、そのanswerのscoreを更新
    # question_idが一致するanswerを取得
    answers = (
        db.query(models.Answer).filter(models.Answer.question_id == question_id).all()
    )
    # 各answerについて、スコアを計算
    # scoreは100//(回答の重複数)で設定
    d = Counter([answer.content for answer in answers])
    for answer in answers:
        score = 100 // d[answer.content]
        answer.score = score
    db.commit()
    return answers


def update_ranks(db: Session, question_id: int):
    # question_idが一致するanswerをもとに、そのanswerのrankを更新
    answers = (
        db.query(models.Answer)
        .filter(models.Answer.question_id == question_id)
        .order_by(models.Answer.score.desc())
        .all()
    )
    # スコアが同じ場合は同じ順位にする
    if len(answers) == 0:
        return answers
    cnt = 1
    answers[0].rank = 1
    for i in range(1, len(answers)):
        if answers[i].score == answers[i - 1].score:
            answers[i].rank = answers[i - 1].rank
            cnt += 1
        else:
            answers[i].rank = answers[i - 1].rank + cnt
            cnt = 1
    db.commit()
    return answers


# delete
def delete_by_answer_id(db: Session, answer_id: int):
    # answer_idが一致するAnswerを削除
    db.query(models.Answer).filter(models.Answer.answer_id == answer_id).delete()
    db.commit()
    return


def delete_by_user_id(db: Session, user_id: int):
    # user_idが一致するAnswerを削除
    db.query(models.Answer).filter(models.Answer.user_id == user_id).delete()
    db.commit()
    return


def delete_by_question_id(db: Session, question_id: int):
    # question_idが一致するAnswerを削除
    db.query(models.Answer).filter(models.Answer.question_id == question_id).delete()
    db.commit()
