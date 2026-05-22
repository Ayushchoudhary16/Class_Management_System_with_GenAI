from fastapi import HTTPException, status, Request
from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone
import jwt

from src.Faculty.model import Faculty
from src.Faculty.schemas import *
from src.Utills.helper import *


def create_faculty(body: FacultyCreate, db: Session):
    existing = db.query(Faculty).filter(Faculty.email == body.email).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    hashed_password = hash_password(body.password)

    new_faculty = Faculty(
        email=body.email,
        password=hashed_password,
        name=body.name,
        department=body.department,
        designation=body.designation,
        is_approved=False
    )

    db.add(new_faculty)
    db.commit()
    db.refresh(new_faculty)

    return new_faculty


def login_faculty(body: loginSchema, db: Session):
    faculty = db.query(Faculty).filter(Faculty.email == body.email).first()

    if not faculty:
        raise HTTPException(404, "Faculty not found")
    
    if not faculty.is_approved:
        raise HTTPException(403, "Wait for admin approval")

    if not verify_password(body.password, faculty.password):
        raise HTTPException(400, "Incorrect password")

    expire = datetime.now(timezone.utc) + timedelta(minutes=200)

    token = jwt.encode(
        {
            "user_id": faculty.id,    
            "email": faculty.email,
            "role": "faculty",
            "exp": expire
        },
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return {"status": "ok", "token": token, "user": faculty}


def get_faculty_by_id(request: Request, db: Session):
    faculty_id = int(request.query_params.get("faculty_id"))

    faculty = db.query(Faculty).filter(Faculty.id == faculty_id).first()
    if not faculty:
        raise HTTPException(404, "Faculty not found")
    return faculty

def get_all_faculties(db: Session):
    faculties= db.query(Faculty).all()
    return {
        "status": "ok",
        "faculties": faculties,
        "count": len(faculties),
    }


def delete_faculty(request: Request, db: Session):
    faculty_id = int(request.query_params.get("faculty_id"))
    faculty = db.query(Faculty).filter(Faculty.id == faculty_id).first()
    if not faculty:
        raise HTTPException(404, "Faculty not found")
    
    db.delete(faculty)
    db.commit()

    return {"status": "ok", "faculty": faculty}


def update_faculty(body: updateSchema, request: Request, db: Session):
    faculty_id = int(request.query_params.get("faculty_id"))

    faculty = db.query(Faculty).filter(Faculty.id == faculty_id).first()
    if not faculty:
        raise HTTPException(404, "Faculty not found")
    
    hassed_password = hash_password(body.password)

    faculty.name = body.name
    faculty.password = hassed_password
    faculty.department = body.department
    faculty.designation = body.designation

    db.commit()
    db.refresh(faculty)

    return {"status": "ok", "faculty": faculty}