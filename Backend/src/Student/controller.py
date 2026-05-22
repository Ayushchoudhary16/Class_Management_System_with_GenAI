from fastapi import HTTPException, status, Request
from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone
import jwt

from src.Student.model import Student
from src.Student.schemas import *
from src.Utills.helper import *


def create_student(body: StudentCreate, db: Session):
    existing = db.query(Student).filter(Student.email == body.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    hashed_password = hash_password(body.password)

    new_student = Student(
        name=body.name,
        dob=body.dob,
        email=body.email,
        address=body.address,
        mobile_no=body.mobile_no,
        parent_mobile_no=body.parent_mobile_no,
        password=hashed_password
    )

    db.add(new_student)
    db.commit()
    db.refresh(new_student)

    return {
        "status": "ok",
        "student": new_student
    }


def login_student(body: loginSchema, db: Session):
    student = db.query(Student).filter(Student.email == body.email).first()

    if not student:
        raise HTTPException(404, "Student not found")

    if not verify_password(body.password, student.password):
        raise HTTPException(400, "Incorrect password")

    expire = datetime.now(timezone.utc) + timedelta(minutes=200)

    token = jwt.encode(
        {
            "user_id": student.id,   
            "email": student.email,
            "role": "student",
            "exp": expire
        },
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return {"status": "ok", "token": token, "user": student}



def get_student_by_id(request: Request, db: Session):
    student_id = request.query_params.get("student_id")

    if not student_id:
        raise HTTPException(400, "student_id is required")

    student = db.query(Student).filter(Student.id == int(student_id)).first()

    if not student:
        raise HTTPException(404, "Student not found")

    return {
        "status": "ok",
        "student": student
    }


def delete_student(request: Request, db: Session):
    student_id = request.query_params.get("student_id")

    if not student_id:
        raise HTTPException(400, "student_id is required")

    student = db.query(Student).filter(Student.id == int(student_id)).first()

    if not student:
        raise HTTPException(404, "Student not found")

    db.delete(student)
    db.commit()

    return {
        "status": "ok",
        "message": "Student deleted successfully"
    }


# def update_student(body: updateSchema, request: Request, db: Session):
#     student_id = request.query_params.get("student_id")

#     if not student_id:
#         raise HTTPException(400, "student_id is required")

#     student = db.query(Student).filter(Student.id == int(student_id)).first()

#     if not student:
#         raise HTTPException(404, "Student not found")

#     hashed_password = hash_password(body.password)

#     student.name = body.name
#     student.address = body.address
#     student.mobile_no = body.mobile_no
#     student.parent_mobile_no = body.parent_mobile_no
#     student.password = hashed_password

#     db.commit()
#     db.refresh(student)

#     return {
#         "status": "ok",
#         "student": student
#     }
def update_student(student_id: int, body: updateSchema, db: Session):

    student = db.query(Student).filter(Student.id == student_id).first()

    if not student:
        raise HTTPException(404, "Student not found")

    hashed_password = hash_password(body.password)

    student.name = body.name
    student.address = body.address
    student.mobile_no = body.mobile_no
    student.parent_mobile_no = body.parent_mobile_no
    student.password = hashed_password

    db.commit()
    db.refresh(student)

    return {
        "status": "ok",
        "student": student
    }


def get_all_students(db: Session):
    students = db.query(Student).all()

    return {
        "status": "ok",
        "count": len(students),
        "students": students
    }

def get_student(request: Request, db: Session, data):
    student_id = request.query_params.get("student_id")

    if not student_id:
        raise HTTPException(400, "student_id required")

    student_id = int(student_id)

    if data["role"] == "admin":
        return get_student_by_id(request, db)

    if data["role"] == "student":
        if data["user"].id != student_id:
            raise HTTPException(403, "You can only access your own data")
        return get_student_by_id(request, db)

    raise HTTPException(403, "Access denied")