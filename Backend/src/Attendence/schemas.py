from pydantic import BaseModel
from datetime import date

class AttendanceCreate(BaseModel):
    student_id: int
    batch_id: int
    date: date
    status: str

class updateSchema(BaseModel):
    status: str