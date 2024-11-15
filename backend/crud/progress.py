from sqlalchemy.orm import Session

import backend.models as models
import backend.schemas.progress as schemas

# DBにアクセスするためのCRUD関数(CRUD = Create, Read, Update, Delete)を定義

# create


def create_progress(db: Session, progress: schemas.ProgressCreate):
    # ProgressCreateの情報をもとにProgressを作成
    db_progress = models.Progress(status=progress.status)
    db.add(db_progress)
    db.commit()
    db.refresh(db_progress)
    return db_progress


# read


def read_by_id(db: Session, progress_id: int):
    # progress_idが一致する進捗を取得
    return db.query(models.Progress).filter(models.Progress.id == progress_id).first()


# update


def update_progress(db: Session, progress_id: int, status: int):
    # progress_idが一致する進捗のis_startedを更新
    progress = (
        db.query(models.Progress).filter(models.Progress.id == progress_id).first()
    )
    progress.status = status
    db.commit()
    return progress


# delete


def delete_progress(db: Session, progress_id: int):
    # progress_idが一致する進捗を削除
    progress = (
        db.query(models.Progress).filter(models.Progress.id == progress_id).first()
    )
    db.delete(progress)
    db.commit()
    return progress
