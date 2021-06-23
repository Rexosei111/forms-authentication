from fastapi import Depends, HTTPException, status, APIRouter
from fastapi.responses import ORJSONResponse
from fastapi.security import OAuth2PasswordRequestForm
from ..authentication import Authenticate_User, create_access_token
from jose import JWTError, jwt
from datetime import datetime, timedelta



user = APIRouter(default_response_class=ORJSONResponse, prefix="/users")

@user.post("/login")
async def Login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = Authenticate_User(form_data.username, form_data.password)
    if not user:
        raise HTTPException(401, detail="Could Not Validate Credentials")
    expires_delta = timedelta(minutes=30)
    data = {"sub": user["Email"]}
    access_token = create_access_token(data, expires=expires_delta)
    return {"access-token": access_token, "token-type": "Bearer"}