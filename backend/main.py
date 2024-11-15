from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum

from backend.api.api import api_router
from backend.db.session import engine

from . import models

models.Base.metadata.create_all(bind=engine)

app = FastAPI()
handler = Mangum(app)

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    # allow_origins=origins,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)
