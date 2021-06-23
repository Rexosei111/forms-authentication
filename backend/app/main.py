from fastapi import Depends, HTTPException, status, FastAPI
from fastapi.responses import ORJSONResponse
from fastapi.middleware.cors import CORSMiddleware
from .Users import users


app = FastAPI(default_reponse_class=ORJSONResponse)

app.include_router(users.user)

origin= [
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origin,
    allow_headers=["*"],
    allow_credentials=True,
    allow_methods = ["*"]
)

