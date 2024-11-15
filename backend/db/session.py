from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from backend.core.config import settings


# エンジンを作成する関数を定義
def get_engine(db_url):
    if "sqlite" in db_url:
        return create_engine(db_url, connect_args={"check_same_thread": False})
    return create_engine(db_url)


# エンジンとセッションの作成
engine = get_engine(settings.SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
