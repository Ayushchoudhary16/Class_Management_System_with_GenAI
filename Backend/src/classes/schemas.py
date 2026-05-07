from pydantic import BaseModel

class ClassCreate(BaseModel):
    title: str
    description: str
    faculty_id: int