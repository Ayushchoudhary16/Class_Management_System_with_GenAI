from fastapi import HTTPException, Request
from sqlalchemy.orm import Session

from src.Attendence.model import Attendance
from src.Attendence.schemas import *
from src.Student.model import Student
from src.batch.model import Batch


def mark_attendance(db: Session, body: AttendanceCreate):
    student = db.query(Student).filter(Student.id == body.student_id).first()
    if not student:
        raise HTTPException(404, "Student not found")

    batch = db.query(Batch).filter(Batch.id == body.batch_id).first()
    if not batch:
        raise HTTPException(404, "Batch not found")

    existing = db.query(Attendance).filter(
        Attendance.student_id == body.student_id,
        Attendance.batch_id == body.batch_id,
        Attendance.date == body.date
    ).first()

    if existing:
        raise HTTPException(400, "Attendance already marked")

    attendance = Attendance(**body.dict())

    db.add(attendance)
    db.commit()
    db.refresh(attendance)

    return {"status": "ok", "attendance": attendance}


def get_attendance_by_student(request: Request, db: Session):
    student_id = request.query_params.get("student_id")

    data = db.query(Attendance).filter(
        Attendance.student_id == int(student_id)
    ).all()

    return {"status": "ok", "attendance": data}


def get_attendance_by_batch(request: Request, db: Session):
    batch_id = request.query_params.get("batch_id")

    data = db.query(Attendance).filter(
        Attendance.batch_id == int(batch_id)
    ).all()

    return {"status": "ok", "attendance": data}


def update_attendance(body: updateSchema, request: Request, db: Session):
    att_id = request.query_params.get("attendance_id")

    data = db.query(Attendance).filter(Attendance.id == int(att_id)).first()
    if not data:
        raise HTTPException(404, "Attendance not found")

    data.status = body.status
    db.commit()
    db.refresh(data)

    return {"status": "ok", "attendance": data}


def get_attendance_percentage(request: Request, db: Session):
    student_id = request.query_params.get("student_id")
    batch_id = request.query_params.get("batch_id")

    if not student_id or not batch_id:
        raise HTTPException(400, "student_id and batch_id required")

    records = db.query(Attendance).filter(
        Attendance.student_id == int(student_id),
        Attendance.batch_id == int(batch_id)
    ).all()

    if not records:
        return {
            "status": "ok",
            "percentage": 0
        }

    total = len(records)
    present = len([r for r in records if r.status == "present"])

    percentage = (present / total) * 100

    return {
        "status": "ok",
        "total_days": total,
        "present_days": present,
        "percentage": round(percentage, 2)
    }


def get_monthly_report(request: Request, db: Session):
    student_id = request.query_params.get("student_id")
    batch_id = request.query_params.get("batch_id")
    month = request.query_params.get("month")  # format: YYYY-MM

    if not student_id or not batch_id or not month:
        raise HTTPException(400, "student_id, batch_id, month required")

    year, month = map(int, month.split("-"))

    records = db.query(Attendance).filter(
        Attendance.student_id == int(student_id),
        Attendance.batch_id == int(batch_id)
    ).all()

    monthly = [
        r for r in records
        if r.date.year == year and r.date.month == month
    ]