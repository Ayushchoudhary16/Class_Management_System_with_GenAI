from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.genAI.controller import *
from src.genAI.schemas import *
from src.Utills.database import get_db
from src.Utills.authentication import admin_required

router = APIRouter()


#  STUDENT AI ROUTE
@router.post("/student")
def student_ai(body: GenAISchema):
    return generate_student_ai_chat(body)


#  ADMIN AI ROUTE
@router.post("/admin")
def admin_ai(body: GenAISchema,admin=Depends(admin_required)):
    return generate_admin_ai_chat(body)
