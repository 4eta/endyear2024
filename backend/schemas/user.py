from pydantic import BaseModel


class UserBase(BaseModel):
    first_name: str
    last_name: str
    department: str


class UserCreate(UserBase):
    pass


class User(UserBase):
    user_id: int
    is_admin: bool
    total_score: int
    rank: int

    class Config:
        orm_mode = True
