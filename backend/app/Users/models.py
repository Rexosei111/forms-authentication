from pydantic import BaseModel, Field

class User(BaseModel):
    Email: str = Field(...)
    Password: str = Field(...)

def User_Schema(user):
    return {
        "Email": user["Email"],
        "Password": user["Password"]
    }