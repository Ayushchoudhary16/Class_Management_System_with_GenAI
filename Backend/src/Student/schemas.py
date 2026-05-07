from pydantic import BaseModel, EmailStr
from datetime import date

class StudentCreate(BaseModel):
    name: str
    dob: date
    email: EmailStr
    address: str
    mobile_no: str
    parent_mobile_no: str
    password: str

class loginSchema(BaseModel):
    email: EmailStr
    password: str

class updateSchema(BaseModel):
    name: str
    address: str
    mobile_no: str
    parent_mobile_no: str
    password: str