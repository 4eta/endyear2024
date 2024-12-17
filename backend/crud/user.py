from sqlalchemy.orm import Session

import backend.models as models
import backend.schemas.user as schemas

# DBにアクセスするためのCRUD関数(CRUD = Create, Read, Update, Delete)を定義


# create
def create_user(db: Session, user: schemas.UserCreate):
    # UserCreateの情報をもとにUserを作成
    db_user = models.User(
        first_name=user.first_name, last_name=user.last_name, department=user.department
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


# read
def read_by_id(db: Session, user_id: int):
    # user_idが一致するユーザーを取得
    return db.query(models.User).filter(models.User.user_id == user_id).first()


def read_by_field(db: Session, first_name: str, last_name: str, department: str):
    # 3つの条件が一致するユーザーを取得
    return (
        db.query(models.User)
        .filter(models.User.first_name == first_name)
        .filter(models.User.last_name == last_name)
        .filter(models.User.department == department)
        .first()
    )


def read_all(db: Session):
    # 全てのユーザーを取得
    return db.query(models.User).all()


def read_worst_user(db: Session):
    # 全ユーザーのなかで、全ての問題に回答済み、かつis_adminがFalseのユーザーの中で、最もスコアが低いユーザーを取得
    users = db.query(models.User).order_by(models.User.total_score.asc()).all()
    for user in users:
        if user.is_admin:
            continue
        # 回答済みの問題数を取得
        answered_questions = (
            db.query(models.Answer).filter(models.Answer.user_id == user.user_id).all()
        )
        if len(answered_questions) == 6:
            return user
    return None


# update
def update_admin(db: Session, user_id: int, is_admin: bool):
    # user_idが一致するユーザーのis_adminを更新
    user = db.query(models.User).filter(models.User.user_id == user_id).first()
    user.is_admin = is_admin
    db.commit()
    db.refresh(user)
    return user


def update_scores(db: Session, question_id: int):
    # question_idが一致するanswerをもとに回答した全userのtotal_scoreを更新
    # question_idが一致するanswerを取得
    answers = (
        db.query(models.Answer).filter(models.Answer.question_id == question_id).all()
    )
    # 各answerについて、answer.scoreを該当するuserのtotal_scoreに加算
    for answer in answers:
        user = (
            db.query(models.User).filter(models.User.user_id == answer.user_id).first()
        )
        if user.is_admin:
            continue
        user.total_score += answer.score
    db.commit()
    # 更新されたuserを返す
    users = db.query(models.User).order_by(models.User.total_score.desc()).all()
    return users


def update_ranks(db: Session):
    # 全userのtotal_scoreをもとにrankを更新
    users = db.query(models.User).order_by(models.User.total_score.desc()).all()
    # スコアが同じ場合は同じ順位にする
    if len(users) == 0:
        return users

    cnt = 1
    users[0].rank = 1
    for i in range(1, len(users)):
        if users[i].total_score == users[i - 1].total_score:
            users[i].rank = users[i - 1].rank
            cnt += 1
        else:
            users[i].rank = users[i - 1].rank + cnt
            cnt = 1
    db.commit()
    return users


# delete
def delete_by_id(db: Session, user_id: int):
    # user_idが一致するユーザーを削除
    db.query(models.User).filter(models.User.user_id == user_id).delete()
    db.commit()
    return user_id


def delete_all(db: Session):
    # 全てのユーザーを削除
    db.query(models.User).delete()
    db.commit()
    return {"message": "All users deleted successfully."}
