from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

from src.Utills.authentication import admin_required
from src.Utills.database import get_db
from src.enroll.controller import *
from src.enroll.schemas import EnrollmentCreateSchema

enrollrouter = APIRouter()

@enrollrouter.post("/enroll")
async def enroll_student_api(body: EnrollmentCreateSchema,db: Session = Depends(get_db)):
    return await enroll_student(db, body)


@enrollrouter.get("/all")
def get_all_enrollments_api(db: Session = Depends(get_db),admin = Depends(admin_required)):
    return get_all_enrollments(db)


@enrollrouter.get("/by-student")
def get_enrollments_by_student_api(request: Request,db: Session = Depends(get_db),admin = Depends(admin_required)):
    return get_enrollments_by_student(request, db)

@enrollrouter.get("/by-batch")
def get_enrollments_by_batch_api(request: Request,db: Session = Depends(get_db),admin = Depends(admin_required)):
    return get_enrollments_by_batch(request, db)

@enrollrouter.delete("/delete")
def delete_enrollment_api(request: Request,db: Session = Depends(get_db),admin = Depends(admin_required)):
    return delete_enrollment(request, db)