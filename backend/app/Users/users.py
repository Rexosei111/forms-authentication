from fastapi import Depends, HTTPException, status, APIRouter, Request, Query
from fastapi.responses import ORJSONResponse
from fastapi.security import OAuth2PasswordRequestForm
from ..authentication import Authenticate_User, create_access_token
from jose import JWTError, jwt
from datetime import datetime, timedelta
import google_auth_oauthlib.flow
from ..database import db
import os
import httpx
from starlette.responses import RedirectResponse

scopes = ["https://www.googleapis.com/auth/userinfo.profile",
          "openid", "https://www.googleapis.com/auth/userinfo.email"]

flow = google_auth_oauthlib.flow.Flow.from_client_secrets_file(
    os.path.join(os.getcwd(), "app", "Users", "client_secret.json"), scopes=scopes)

flow.redirect_uri = 'https://7b06b7ec5ff2.ngrok.io/users/login/google/auth'

user = APIRouter(prefix="/users", default_response_class=ORJSONResponse)

authorization_url, state = flow.authorization_url(
    # Enable offline access so that you can refresh an access token without
    # re-prompting the user for permission. Recommended for web server apps.
    access_type='offline',
    prompt="select_account",
    # Enable incremental authorization. Recommended as a best practice.
    include_granted_scopes='true')

url = "https://www.googleapis.com/oauth2/v2/userinfo"

def Add_to_db(details):
    data = db.Users.insert_one(details)
    return True

async def get_userinfo(token):
    async with httpx.AsyncClient() as client:
        response = await client.get(url, headers={"Content-type": "Application/json", "Authorization": f"Bearer {token}"})
        return response

def credentials_to_dict(credentials):
  return {'token': credentials.token,
          'refresh_token': credentials.refresh_token,
          'token_uri': credentials.token_uri,
          'client_id': credentials.client_id,
          'client_secret': credentials.client_secret,
          'scopes': credentials.scopes}

@user.get("/login/google")
async def Google_Login(request: Request):
    return RedirectResponse(authorization_url)


@user.route('/users/login/google/auth')
async def auth(request: Request, code: str = Query(...)):
    flow = google_auth_oauthlib.flow.Flow.from_client_secrets_file(
        os.path.join(os.getcwd(),
        "app", "Users", "client_secret.json"),
        scopes=scopes)

    flow.redirect_uri = request.url_for("auth")
    authorization_response = str(request.url)
    # request.url returns a URL object which has not .lower method. In that case the '.fetch token' method returns an error because it can't convert the url in the authorization_response variable to lowercase case to check if it is starts with 'https://'. Therefore the 'request.url can be converted to string and It worked for me
    flow.fetch_token(authorization_response=authorization_response)

    credentials = flow.credentials
    user_credentials = credentials_to_dict(credentials)
    token = user_credentials["token"]
    info = await get_userinfo(token)
    info = dict(info.json())
    detail = {"Email": info['email'], 'picture': info['picture'], "Name": info['name']}
    if Add_to_db(details=detail):
        return RedirectResponse(url="http://localhost:3000")
    else:
        return RedirectResponse(url=authorization_url)

@user.post("/login")
async def Login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = Authenticate_User(form_data.username, form_data.password)
    if not user:
        raise HTTPException(401, detail="Could Not Validate Credentials")
    expires_delta = timedelta(minutes=30)
    data = {"sub": user["Email"]}
    access_token = create_access_token(data, expires=expires_delta)
    return {"access-token": access_token, "token-type": "Bearer"}
