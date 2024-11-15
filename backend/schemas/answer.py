from pydantic import BaseModel


class AnswerBase(BaseModel):
    user_id: int
    question_id: int
    content: str


class AnswerCreate(AnswerBase):
    pass


class Answer(AnswerBase):
    answer_id: int
    score: int
    rank: int

    class Config:
        orm_mode = True


class AnswerDetail(Answer):
    last_name: str
    first_name: str
    department: str

    class Config:
        orm_mode = True
