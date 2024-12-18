from fastapi import APIRouter, Depends

import backend.crud.answer as answer_crud
import backend.crud.progress as progress_crud
import backend.crud.user as user_crud
from backend.db.session import SessionLocal
from backend.schemas.answer import AnswerCreate
from backend.schemas.progress import ProgressCreate
from backend.schemas.user import UserCreate


class AdminData:
    first_name: str
    last_name: str
    department: str
    ans_arr: list[str]

    def __init__(
        self,
        first_name: str,
        last_name: str,
        department: str,
        ans_arr: list[str],
    ):
        self.first_name = first_name
        self.last_name = last_name
        self.department = department
        self.ans_arr = ans_arr


def prepare_admin() -> None:
    db = SessionLocal()

    # 管理者の作成
    admins: list[AdminData] = [
        AdminData(
            first_name="生澤",
            last_name="真司",
            department="D2",
            ans_arr=["大阪府", "サッカー", "Rust", "フクロウ", "た", "神奈川県"],
        ),
        AdminData(
            first_name="佐藤",
            last_name="嶺2",
            department="D2",
            ans_arr=["神奈川県", "バドミントン", "MATLAB", "ウサギ", "れ", "北海道"],
        ),
        AdminData(
            first_name="梅田",
            last_name="綾音",
            department="SD",
            ans_arr=["香川県", "カヌー", "Ruby", "カナリア", "あ", "徳島県"],
        ),
        AdminData(
            first_name="小池",
            last_name="由能",
            department="INTL",
            ans_arr=["神奈川県", "ホッケー", "Julia", "インコ", "よ", "和歌山県"],
        ),
        AdminData(
            first_name="田中",
            last_name="貴大",
            department="APD",
            ans_arr=["東京都", "テコンドー", "Julia", "コイ", "て", "岩手県"],
        ),
        AdminData(
            first_name="藤原",
            last_name="円央",
            department="APD",
            ans_arr=["大分県", "セーリング", "Verilog", "キツネ", "て", "長崎県"],
        ),
        AdminData(
            first_name="米川",
            last_name="峻矢",
            department="D2",
            ans_arr=["千葉県", "陸上", "Python", "ウーパールーパー", "よ", "千葉県"],
        ),
        AdminData(
            first_name="内野",
            last_name="富",
            department="INTL",
            ans_arr=["山形県", "ハンドボール", "Prolog", "ハリネズミ", "と", "福岡県"],
        ),
        AdminData(
            first_name="兼子",
            last_name="孟",
            department="APD",
            ans_arr=["東京都", "体操", "F#", "カメ", "さ", "山口県"],
        ),
        AdminData(
            first_name="溝畑",
            last_name="毅",
            department="INTL",
            ans_arr=[
                "東京都",
                "スポーツクライミング",
                "Lua",
                "ハリネズミ",
                "た",
                "京都府",
            ],
        ),
    ]

    # ユーザーの登録
    for admin in admins:
        user = UserCreate(
            first_name=admin.last_name,
            last_name=admin.first_name,
            department=admin.department,
        )
        user_crud.create_user(db, user=user)

    # adminであることの更新
    for i in range(len(admins)):
        user_crud.update_admin(db, user_id=i + 1, is_admin=True)

    # 回答の登録
    for i in range(len(admins)):
        for q in range(6):
            answer = AnswerCreate(
                user_id=i + 1, question_id=q, content=admins[i].ans_arr[q]
            )
            answer_crud.create_answer(db, answer=answer)


def prepare() -> None:
    db = SessionLocal()

    # 進捗管理の作成
    progress = ProgressCreate(status=0)
    progress_crud.create_progress(db, progress=progress)

    # 管理者データの作成
    prepare_admin()


if __name__ == "__main__":
    prepare()
