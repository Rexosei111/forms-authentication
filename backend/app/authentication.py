from .database import db
from fastapi import HTTPException
from .Users.models import User, User_Schema
from datetime import datetime, timedelta
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


oauth_scheme = OAuth2PasswordBearer(tokenUrl="/users/login")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(hashed_password, plain_password):
    return pwd_context.verify(plain_password, hashed_password)

def retrieve_user(email):
    user = db.Users.find_one({"Email": email})
    if not user:
        raise HTTPException(status_code = 404, detail="User Does Not Exist")
    
    return User_Schema(user)

def Authenticate_User(email: str, password: str):
    user: User = retrieve_user(email)
    verified = verify_password(user["Password"], password)
    if not verified:
        raise HTTPException(401, detail="Password is Incorrect")

    return user

def create_access_token(data, expires):
    data_to_encode = data.copy()
    if expires:
        expire = datetime.utcnow() + expires
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    data_to_encode.update({"exp": expire})
    encode_token = jwt.encode(data_to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encode_token