from pydantic import BaseModel, EmailStr

class FacultyCreate(BaseModel):
    email: EmailStr
    password: str
    name: str
    department: str
    designation: str

class loginSchema(BaseModel):
    email: EmailStr
    password: str

class updateSchema(BaseModel):
    name: str
    password: str
    department: str
    designation: str