from pydantic import BaseModel

class FeesCreate(BaseModel):
    student_id: int
    amount: int

class FeesUpdate(BaseModel):
    amount: int
    status: str