from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.Utills.database import get_db
from src.Utills.authentication import admin_required, require_role,is_authenticated
from src.Fees.controller import *
from src.Fees.schemas import *



router = APIRouter()


@router.post("/create-fee")
def create_fee(
    body:FeesCreate,
    db: Session = Depends(get_db),
    admin = Depends(admin_required)
):
    return create_fees(body, db)


@router.get("/all-fees")
def all_fees(
    db: Session = Depends(get_db),
    admin = Depends(admin_required)
):
    return get_all_fees(db)


@router.get("/my-fees")
def my_fees(
    db: Session = Depends(get_db),
    data = Depends(require_role("student"))
):
    return get_student_fees(data["user"].id, db)


@router.put("/update-fee/{fee_id}")
def update_fee(
    fee_id: int,
    body:FeesUpdate,
    db: Session = Depends(get_db),
    admin = Depends(require_role("admin"))
):
    return update_fees(fee_id, body, db)