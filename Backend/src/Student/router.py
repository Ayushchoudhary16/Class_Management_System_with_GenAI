from fastapi import APIRouter, Depends, Request, HTTPException
from sqlalchemy.orm import Session

from src.Utills.database import get_db
from src.Student.controller import *
from src.Student.schemas import *
from src.Utills.authentication import admin_required, is_authenticated

router = APIRouter()


@router.post("/signup")
def signup(body: StudentCreate, db: Session = Depends(get_db)):
    return create_student(body, db)


@router.post("/login")
def login(body: loginSchema, db: Session = Depends(get_db)):
    return login_student(body, db)


@router.get("/get")
def get_student(
    request: Request,
    db: Session = Depends(get_db),
    data = Depends(is_authenticated)
):
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


@router.get("/all")
def get_all(
    db: Session = Depends(get_db),
    admin = Depends(admin_required)
):
    return get_all_students(db)


@router.put("/update")
def update(
    body: updateSchema,
    request: Request,
    db: Session = Depends(get_db),
    data = Depends(is_authenticated)
):
    if data["role"] != "student":
        raise HTTPException(403, "Only student can update")

    # request._query_params = request.query_params.mutablecopy()
    request._query_params["student_id"] = str(data["user"].id)

    return update_student(body, request, db)


@router.delete("/delete")
def delete(
    request: Request,
    db: Session = Depends(get_db),
    admin = Depends(admin_required)
):
    return delete_student(request, db)