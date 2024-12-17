import random

from fastapi import APIRouter, Depends

import backend.crud.answer as answer_crud
import backend.crud.progress as progress_crud
import backend.crud.user as user_crud
from backend.db.session import SessionLocal
from backend.schemas.answer import AnswerCreate
from backend.schemas.progress import ProgressCreate
from backend.schemas.user import UserCreate

departments = ["D2", "INTL", "APD", "SD", "stmn", "joker"]
AnswerList = [
    [
        "北海道",
        "青森県",
        "岩手県",
        "宮城県",
        "秋田県",
        "山形県",
        "福島県",
        "茨城県",
        "栃木県",
        "群馬県",
        "埼玉県",
        "千葉県",
        "東京都",
        "神奈川県",
        "新潟県",
        "富山県",
        "石川県",
        "福井県",
        "山梨県",
        "長野県",
        "岐阜県",
        "静岡県",
        "愛知県",
        "三重県",
        "滋賀県",
        "京都府",
        "大阪府",
        "兵庫県",
        "奈良県",
        "和歌山県",
        "鳥取県",
        "島根県",
        "岡山県",
        "広島県",
        "山口県",
        "徳島県",
        "香川県",
        "愛媛県",
        "高知県",
        "福岡県",
        "佐賀県",
        "長崎県",
        "熊本県",
        "大分県",
        "宮崎県",
        "鹿児島県",
        "沖縄県",
    ],
    [
        "陸上",
        "水泳",
        "サッカー",
        "テニス",
        "ローイング",
        "ホッケー",
        "ボクシング",
        "バレーボール",
        "体操",
        "バスケットボール",
        "レスリング",
        "セーリング",
        "ウェイトリフティング",
        "ハンドボール",
        "自転車",
        "卓球",
        "馬術",
        "フェンシング",
        "柔道",
        "バドミントン",
        "射撃",
        "近代五種",
        "ラグビー",
        "カヌー",
        "アーチェリー",
        "トライアスロン",
        "ゴルフ",
        "テコンドー",
        "スポーツクライミング",
        "サーフィン",
        "スケートボード",
        "ブレイキン",
        "車いすテニス",
        "車いすバスケットボール",
        "車いすフェンシング",
        "車いすラグビー",
        "ゴールボール",
        "シッティングバレーボール",
        "ブラインドサッカー",
        "ボッチャ",
    ],
    [
        "Python",
        "JavaScript",
        "Java",
        "C#",
        "C++",
        "Ruby",
        "Swift",
        "Kotlin",
        "TypeScript",
        "PHP",
        "Go",
        "Rust",
        "Dart",
        "Scala",
        "Perl",
        "R",
        "MATLAB",
        "Julia",
        "Haskell",
        "Lua",
        "Objective-C",
        "Groovy",
        "Elixir",
        "Erlang",
        "F#",
        "Clojure",
        "Shell Script",
        "SQL",
        "PL/SQL",
        "Apex",
        "Visual Basic .NET",
        "Assembly Language",
        "COBOL",
        "Fortran",
        "Ada",
        "VHDL",
        "Verilog",
        "Prolog",
        "Scheme",
        "OCaml",
    ],
    [
        "イヌ",
        "ネコ",
        "ウサギ",
        "ハムスター",
        "モルモット",
        "フェレット",
        "インコ",
        "カナリア",
        "オウム",
        "チンチラ",
        "デグー",
        "リス",
        "モモンガ",
        "カメ",
        "トカゲ",
        "ヘビ",
        "カエル",
        "イグアナ",
        "ヤモリ",
        "フクロウ",
        "ハヤブサ",
        "ハト",
        "メダカ",
        "グッピー",
        "ベタ",
        "キンギョ",
        "コイ",
        "フラミンゴ",
        "エビ",
        "カニ",
        "ヤドカリ",
        "ウーパールーパー",
        "カワウソ",
        "ミーアキャット",
        "アルパカ",
        "ヤギ",
        "ヒツジ",
        "ポニー",
        "ミニブタ",
        "スナネズミ",
        "シマリス",
        "フェネック",
        "コアラ",
        "カンガルー",
        "パンダ",
        "レッサーパンダ",
        "キツネ",
        "ハリネズミ",
        "カメレオン",
        "ヤドカリ",
    ],
    [
        "あ",
        "い",
        "う",
        "え",
        "お",
        "か",
        "き",
        "く",
        "け",
        "こ",
        "さ",
        "し",
        "す",
        "せ",
        "そ",
        "た",
        "ち",
        "つ",
        "て",
        "と",
        "な",
        "に",
        "ぬ",
        "ね",
        "の",
        "は",
        "ひ",
        "ふ",
        "へ",
        "ほ",
        "ま",
        "み",
        "む",
        "め",
        "も",
        "や",
        "ゆ",
        "よ",
        "ら",
        "り",
        "る",
        "れ",
        "ろ",
        "わ",
        "を",
        "ん",
    ],
    [
        "北海道",
        "青森県",
        "岩手県",
        "宮城県",
        "秋田県",
        "山形県",
        "福島県",
        "茨城県",
        "栃木県",
        "群馬県",
        "埼玉県",
        "千葉県",
        "東京都",
        "神奈川県",
        "新潟県",
        "富山県",
        "石川県",
        "福井県",
        "山梨県",
        "長野県",
        "岐阜県",
        "静岡県",
        "愛知県",
        "三重県",
        "滋賀県",
        "京都府",
        "大阪府",
        "兵庫県",
        "奈良県",
        "和歌山県",
        "鳥取県",
        "島根県",
        "岡山県",
        "広島県",
        "山口県",
        "徳島県",
        "香川県",
        "愛媛県",
        "高知県",
        "福岡県",
        "佐賀県",
        "長崎県",
        "熊本県",
        "大分県",
        "宮崎県",
        "鹿児島県",
        "沖縄県",
    ],
]


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
            last_name="真司2",
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
            last_name="綾音2",
            department="SD",
            ans_arr=["香川県", "カヌー", "Ruby", "カナリア", "あ", "徳島県"],
        ),
        AdminData(
            first_name="小池",
            last_name="由能2",
            department="INTL",
            ans_arr=["神奈川県", "ホッケー", "Julia", "インコ", "よ", "和歌山県"],
        ),
        AdminData(
            first_name="田中",
            last_name="貴大2",
            department="APD",
            ans_arr=["東京都", "テコンドー", "Julia", "コイ", "て", "岩手県"],
        ),
        AdminData(
            first_name="藤原",
            last_name="円央2",
            department="APD",
            ans_arr=["大分県", "セーリング", "Verilog", "キツネ", "て", "長崎県"],
        ),
        AdminData(
            first_name="米川",
            last_name="峻矢2",
            department="D2",
            ans_arr=["千葉県", "陸上", "Python", "ウーパールーパー", "よ", "千葉県"],
        ),
        AdminData(
            first_name="内野",
            last_name="富2",
            department="INTL",
            ans_arr=["山形県", "ハンドボール", "Prolog", "ハリネズミ", "と", "福岡県"],
        ),
        AdminData(
            first_name="兼子",
            last_name="孟2",
            department="APD",
            ans_arr=["東京都", "体操", "F#", "カメ", "さ", "山口県"],
        ),
        AdminData(
            first_name="溝畑",
            last_name="毅2",
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


def prepare_mob() -> None:
    db = SessionLocal()
    n = 180
    for i in range(n):
        user = UserCreate(
            first_name=f"{i}",
            last_name="test",
            department=random.choice(departments),
        )
        user_crud.create_user(db, user=user)

    # 回答の作成
    for q in range(6):
        for i in range(n):
            answer = AnswerCreate(
                user_id=i + 11, question_id=q, content=random.choice(AnswerList[q])
            )
            answer_crud.create_answer(db, answer=answer)


def prepare() -> None:
    db = SessionLocal()

    # 進捗管理の作成
    progress = ProgressCreate(status=0)
    progress_crud.create_progress(db, progress=progress)

    # 管理者データの作成
    prepare_admin()

    # モブデータの作成
    prepare_mob()


if __name__ == "__main__":
    prepare()
