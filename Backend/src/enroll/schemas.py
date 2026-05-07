from pydantic import BaseModel

class EnrollmentCreateSchema(BaseModel):
    student_id: int
    batch_id: int
    