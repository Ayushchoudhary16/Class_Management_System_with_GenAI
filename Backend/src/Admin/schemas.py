from pydantic import BaseModel,EmailStr

class AdminCreate(BaseModel):
    email: str
    password: str
    name: str

class loginSchema(BaseModel):
    email: EmailStr
    password: str

class updateSchema(BaseModel):
    password: str
    name: str