from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from src.Utills.database import get_db
from src.Attendence.controller import *
from src.Attendence.schemas import *

router = APIRouter()


@router.post("/mark")
def mark(body: AttendanceCreate, db: Session = Depends(get_db)):
    return mark_attendance(db, body)


@router.get("/student")
def get_student(request: Request, db: Session = Depends(get_db)):
    return get_attendance_by_student(request, db)


@router.get("/batch")
def get_batch(request: Request, db: Session = Depends(get_db)):
    return get_attendance_by_batch(request, db)


@router.put("/update")
def update(body: updateSchema, request: Request, db: Session = Depends(get_db)):
    return update_attendance(body, request, db)

@router.get("/percentage")
def percentage(request: Request, db: Session = Depends(get_db)):
    return get_attendance_percentage(request, db)

@router.get("/monthly")
def monthly(request: Request, db: Session = Depends(get_db)):
    return get_monthly_report(request, db)