from pydantic import BaseModel,EmailStr

class AdminCreate(BaseModel):
    email: str
    password: str
    name: str
    secret_key: str

class loginSchema(BaseModel):
    email: EmailStr
    password: str

class updateSchema(BaseModel):
    password: str
    name: str