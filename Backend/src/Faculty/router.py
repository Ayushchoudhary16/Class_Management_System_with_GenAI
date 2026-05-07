from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

from src.Utills.database import get_db
from src.Utills.authentication import admin_required, is_authenticated
from .controller import *
from .schemas import *

router = APIRouter()


@router.post("/signup")
def signup(body: FacultyCreate, db: Session = Depends(get_db)):
    return create_faculty(body, db)


@router.post("/login")
def login(body: loginSchema, db: Session = Depends(get_db)):
    return login_faculty(body, db)


@router.get("/get")
def get_faculty(
    request: Request,
    db: Session = Depends(get_db),
    admin = Depends(admin_required)
):
    return get_faculty_by_id(request, db)


@router.get("/all")
def get_all(
    db: Session = Depends(get_db),
    admin = Depends(admin_required)
):
    return get_all_faculties(db)


@router.delete("/delete")
def delete(
    request: Request,
    db: Session = Depends(get_db),
    admin = Depends(admin_required)
):
    return delete_faculty(request, db)


@router.put("/update")
def update(
    body: updateSchema,
    request: Request,
    db: Session = Depends(get_db),
    data = Depends(is_authenticated)   
):
    if data["role"] != "faculty":
        raise HTTPException(403, "Only faculty can update")

    request._query_params = request.query_params.mutablecopy()
    request._query_params["faculty_id"] = str(data["user"].id)

    return update_faculty(body, request, db)