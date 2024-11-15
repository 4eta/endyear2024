from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, UniqueConstraint

from .db.base_class import Base


class User(Base):
    """
    Useテーブル(user)の定義
    user_id: ユーザーID
    first_name: ユーザーの名
    last_name: ユーザーの姓
    department: 所属
    is_admin: 管理者かどうか
    """

    __tablename__ = "user"

    user_id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(255), nullable=False)
    last_name = Column(String(255), nullable=False)
    department = Column(String(255), nullable=False)
    is_admin = Column(Boolean, default=False)
    total_score = Column(Integer, default=0)
    rank = Column(Integer, default=0)


class Answer(Base):
    """
    Answerテーブル(answer)の定義
    answer_id: 回答ID
    user_id: ユーザーID
    question_id: 問題ID
    content: 回答内容
    score: この回答のスコア
    rank: この回答の順位
    """

    __tablename__ = "answer"

    # user_idとquestion_idが一致する回答が一つしか存在しないことを保証する
    answer_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.user_id"))
    question_id = Column(Integer, nullable=False)
    content = Column(String(255), nullable=False)
    score = Column(Integer, default=0)
    rank = Column(Integer, default=0)

    __table_args__ = (UniqueConstraint("user_id", "question_id"),)


class Progress(Base):
    """
    progressテーブル(progress)の定義
    progress_id: 進捗ID
    status: 進捗状況
    """

    __tablename__ = "progress"

    id = Column(Integer, primary_key=True, index=True)
    status = Column(Integer, nullable=False, default=0)
