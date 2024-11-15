from pydantic import BaseModel


class ProgressBase(BaseModel):
    status: int


class ProgressCreate(ProgressBase):
    pass


class Progress(ProgressBase):
    id: int

    class Config:
        orm_mode = True
