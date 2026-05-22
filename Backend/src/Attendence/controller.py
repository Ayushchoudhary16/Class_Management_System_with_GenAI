# from fastapi import HTTPException, Request
# from sqlalchemy.orm import Session

# from src.Attendence.model import Attendance
# from src.Attendence.schemas import *
# from src.Student.model import Student
# from src.batch.model import Batch


# def mark_attendance(db: Session, body: AttendanceCreate):
#     student = db.query(Student).filter(Student.id == body.student_id).first()
#     if not student:
#         raise HTTPException(404, "Student not found")

#     batch = db.query(Batch).filter(Batch.id == body.batch_id).first()
#     if not batch:
#         raise HTTPException(404, "Batch not found")

#     existing = db.query(Attendance).filter(
#         Attendance.student_id == body.student_id,
#         Attendance.batch_id == body.batch_id,
#         Attendance.date == body.date
#     ).first()

#     if existing:
#         raise HTTPException(400, "Attendance already marked")

#     attendance = Attendance(**body.dict())

#     db.add(attendance)
#     db.commit()
#     db.refresh(attendance)

#     return {"status": "ok", "attendance": attendance}


# def get_attendance_by_student(request: Request, db: Session):
#     student_id = request.query_params.get("student_id")

#     data = db.query(Attendance).filter(
#         Attendance.student_id == int(student_id)
#     ).all()

#     return {"status": "ok", "attendance": data}


# def get_attendance_by_batch(request: Request, db: Session):
#     batch_id = request.query_params.get("batch_id")

#     data = db.query(Attendance).filter(
#         Attendance.batch_id == int(batch_id)
#     ).all()

#     return {"status": "ok", "attendance": data}


# def update_attendance(body: updateSchema, request: Request, db: Session):
#     att_id = request.query_params.get("attendance_id")

#     data = db.query(Attendance).filter(Attendance.id == int(att_id)).first()
#     if not data:
#         raise HTTPException(404, "Attendance not found")

#     data.status = body.status
#     db.commit()
#     db.refresh(data)

#     return {"status": "ok", "attendance": data}


# def get_attendance_percentage(request: Request, db: Session):
#     student_id = request.query_params.get("student_id")
#     batch_id = request.query_params.get("batch_id")

#     if not student_id or not batch_id:
#         raise HTTPException(400, "student_id and batch_id required")

#     records = db.query(Attendance).filter(
#         Attendance.student_id == int(student_id),
#         Attendance.batch_id == int(batch_id)
#     ).all()

#     if not records:
#         return {
#             "status": "ok",
#             "percentage": 0
#         }

#     total = len(records)
#     present = len([r for r in records if r.status == "present"])

#     percentage = (present / total) * 100

#     return {
#         "status": "ok",
#         "total_days": total,
#         "present_days": present,
#         "percentage": round(percentage, 2)
#     }


# def get_monthly_report(request: Request, db: Session):
#     student_id = request.query_params.get("student_id")
#     batch_id = request.query_params.get("batch_id")
#     month = request.query_params.get("month")  # format: YYYY-MM

#     if not student_id or not batch_id or not month:
#         raise HTTPException(400, "student_id, batch_id, month required")

#     year, month = map(int, month.split("-"))

#     records = db.query(Attendance).filter(
#         Attendance.student_id == int(student_id),
#         Attendance.batch_id == int(batch_id)
#     ).all()

#     monthly = [
#         r for r in records
#         if r.date.year == year and r.date.month == month
#     ]

from fastapi import HTTPException, Request
from sqlalchemy.orm import Session
from sqlalchemy import extract

from src.Attendence.model import Attendance
from src.Attendence.schemas import *
from src.Student.model import Student
from src.batch.model import Batch


# =========================================
# MARK ATTENDANCE
# =========================================
def mark_attendance(db: Session, body: AttendanceCreate):

    student = db.query(Student).filter(
        Student.id == body.student_id
    ).first()

    if not student:
        raise HTTPException(404, "Student not found")

    batch = db.query(Batch).filter(
        Batch.id == body.batch_id
    ).first()

    if not batch:
        raise HTTPException(404, "Batch not found")

    existing = db.query(Attendance).filter(
        Attendance.student_id == body.student_id,
        Attendance.batch_id == body.batch_id,
        Attendance.date == body.date
    ).first()

    if existing:
        raise HTTPException(400, "Attendance already marked")

    attendance = Attendance(
        student_id=body.student_id,
        batch_id=body.batch_id,
        date=body.date,
        status=body.status
    )

    db.add(attendance)
    db.commit()
    db.refresh(attendance)

    return {
        "status": "ok",
        "message": "Attendance marked successfully",
        "attendance": attendance
    }


# =========================================
# GET STUDENT ATTENDANCE
# =========================================
def get_attendance_by_student(request: Request, db: Session):

    student_id = request.query_params.get("student_id")

    if not student_id:
        raise HTTPException(400, "student_id required")

    records = db.query(Attendance).filter(
        Attendance.student_id == int(student_id)
    ).all()

    return {
        "status": "ok",
        "total_records": len(records),
        "attendance": records
    }


# =========================================
# GET BATCH ATTENDANCE
# =========================================
def get_attendance_by_batch(request: Request, db: Session):

    batch_id = request.query_params.get("batch_id")

    if not batch_id:
        raise HTTPException(400, "batch_id required")

    records = db.query(Attendance).filter(
        Attendance.batch_id == int(batch_id)
    ).all()

    return {
        "status": "ok",
        "total_records": len(records),
        "attendance": records
    }


# =========================================
# UPDATE ATTENDANCE
# =========================================
def update_attendance(body: updateSchema, request: Request, db: Session):

    att_id = request.query_params.get("attendance_id")

    if not att_id:
        raise HTTPException(400, "attendance_id required")

    attendance = db.query(Attendance).filter(
        Attendance.id == int(att_id)
    ).first()

    if not attendance:
        raise HTTPException(404, "Attendance not found")

    attendance.status = body.status

    db.commit()
    db.refresh(attendance)

    return {
        "status": "ok",
        "message": "Attendance updated successfully",
        "attendance": attendance
    }


# =========================================
# ATTENDANCE PERCENTAGE
# =========================================
def get_attendance_percentage(request: Request, db: Session):

    student_id = request.query_params.get("student_id")
    batch_id = request.query_params.get("batch_id")

    if not student_id or not batch_id:
        raise HTTPException(
            400,
            "student_id and batch_id required"
        )

    records = db.query(Attendance).filter(
        Attendance.student_id == int(student_id),
        Attendance.batch_id == int(batch_id)
    ).all()

    if not records:
        return {
            "status": "ok",
            "percentage": 0,
            "total_days": 0,
            "present_days": 0
        }

    total_days = len(records)

    present_days = len([
        r for r in records
        if r.status.lower() == "present"
    ])

    absent_days = total_days - present_days

    percentage = (present_days / total_days) * 100

    return {
        "status": "ok",
        "student_id": int(student_id),
        "batch_id": int(batch_id),
        "total_days": total_days,
        "present_days": present_days,
        "absent_days": absent_days,
        "percentage": round(percentage, 2)
    }


# =========================================
# MONTHLY REPORT
# =========================================
def get_monthly_report(request: Request, db: Session):

    student_id = request.query_params.get("student_id")
    batch_id = request.query_params.get("batch_id")
    month = request.query_params.get("month")

    if not student_id or not batch_id or not month:
        raise HTTPException(
            400,
            "student_id, batch_id, month required"
        )

    try:
        year, month_num = map(int, month.split("-"))
    except:
        raise HTTPException(
            400,
            "Month format should be YYYY-MM"
        )

    records = db.query(Attendance).filter(
        Attendance.student_id == int(student_id),
        Attendance.batch_id == int(batch_id),
        extract("year", Attendance.date) == year,
        extract("month", Attendance.date) == month_num
    ).all()

    total_days = len(records)

    present_days = len([
        r for r in records
        if r.status.lower() == "present"
    ])

    absent_days = total_days - present_days

    percentage = (
        (present_days / total_days) * 100
        if total_days > 0 else 0
    )

    return {
        "status": "ok",
        "student_id": int(student_id),
        "batch_id": int(batch_id),
        "month": f"{year}-{month_num:02d}",
        "total_days": total_days,
        "present_days": present_days,
        "absent_days": absent_days,
        "percentage": round(percentage, 2),
        "attendance": records
    }

# =========================================
# GET MY ATTENDANCE (STUDENT SELF)
# =========================================
def get_my_attendance(request: Request, db: Session):

    # USER FROM TOKEN
    user = request.state.user

    if not user:
        raise HTTPException(401, "Unauthorized")

    student_id = user.id

    records = db.query(Attendance).filter(
        Attendance.student_id == student_id
    ).all()

    total_days = len(records)

    present_days = len([
        r for r in records
        if r.status.lower() == "present"
    ])

    absent_days = total_days - present_days

    percentage = (
        (present_days / total_days) * 100
        if total_days > 0 else 0
    )

    return {
        "status": "ok",
        "student": {
            "id": user.id,
            "name": user.name,
            "email": user.email
        },
        "summary": {
            "total_days": total_days,
            "present_days": present_days,
            "absent_days": absent_days,
            "percentage": round(percentage, 2)
        },
        "attendance": records
    }