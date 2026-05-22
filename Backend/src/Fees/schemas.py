from pydantic import BaseModel
from datetime import date

class FeesCreate(BaseModel):
    student_id: int
    batch_id: int
    total_amount: int
    due_date: date

class FeesUpdate(BaseModel):
    amount_paid: int
    status: str