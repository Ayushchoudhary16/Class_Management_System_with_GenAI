from fastapi import HTTPException, Request
from sqlalchemy.orm import Session

from src.Faculty.model import *
from src.classes.model import *
from src.Student.model import *
from src.enroll.model import Enrollment
from src.batch.model import Batch
from src.enroll.schemas import *
from src.Utills.send_email_students import send_email
from src.Utills.authentication import is_authenticated


async def enroll_student(db: Session, body: EnrollmentCreateSchema):
    student = db.query(Student).filter(Student.id == body.student_id).first()
    if not student:
        raise HTTPException(404, "Student not found")

    batch = db.query(Batch).filter(Batch.id == body.batch_id).first()
    if not batch:
        raise HTTPException(404, "Batch not found")

    already_enrolled = db.query(Enrollment).filter(
        Enrollment.student_id == body.student_id,
        Enrollment.batch_id == body.batch_id
    ).first()

    if already_enrolled:
        raise HTTPException(400, "Student already enrolled in this batch")

    enrollment = Enrollment(
        student_id=body.student_id,
        batch_id=body.batch_id
    )

    db.add(enrollment)
    db.commit()
    db.refresh(enrollment)

    

    class_data = db.query(Class).filter(Class.id == batch.class_id).first()

    faculty = db.query(Faculty).filter(Faculty.id == class_data.faculty_id).first()

    try:
        await send_email(
            emails=[student.email],
            student_name=student.name,
            batch_name=batch.name,
            class_name=class_data.title,
            faculty_name=faculty.name,
            faculty_department=faculty.department,
            faculty_designation=faculty.designation,
            start_date=batch.start_date,
            end_date=batch.end_date
        )
        print("✅ Email sent successfully")

    except Exception as e:
        print("⚠️ Email failed:", str(e))

    return {
        "status": "ok",
        "message": "Student enrolled successfully",
        "enrollment": enrollment
    }

def get_all_enrollments(db: Session):
    enrollments = db.query(Enrollment).all()
    return {
        "status": "ok",
        "enrollments": enrollments,
        "count": len(enrollments)
    }


def get_enrollments_by_student(request: Request, db: Session):
    student_id = int(request.query_params.get("student_id"))

    return db.query(Enrollment).filter(
        Enrollment.student_id == student_id
    ).all()

def get_enrollments_by_batch(request: Request, db: Session):
    batch_id = int(request.query_params.get("batch_id"))
    return db.query(Enrollment).filter(
        Enrollment.batch_id == batch_id
    ).all()

def delete_enrollment(request: Request, db: Session):
    enroll_id = int(request.query_params.get("enroll_id"))
    enrollment = db.query(Enrollment).filter(
        Enrollment.id == enroll_id
    ).first()
    if not enrollment:
        raise HTTPException(404, "Enrollment not found")
    db.delete(enrollment)
    db.commit()

    return {"message": "Enrollment removed successfully"}




# ayuyadav0307