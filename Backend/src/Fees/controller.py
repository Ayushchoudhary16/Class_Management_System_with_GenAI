from sqlalchemy.orm import Session
from fastapi import HTTPException
from .model import Fees
from .schemas import FeesCreate, FeesUpdate


# def create_fees(body, db: Session):
#     student_id = body.student_id
#     if not student_id:
#         raise HTTPException(400, "Student ID is required")
#     existing_fee = db.query(Fees).filter(Fees.student_id == student_id).first()
#     if existing_fee:
#         raise HTTPException(400, "Fee already exists for this student")
    
#     fee = Fees(
#         student_id=body.student_id,
#         amount=body.amount,
#         status="pending"
#     )
#     db.add(fee)
#     db.commit()
#     db.refresh(fee)

#     return {
#         "message": "Fee created successfully",
#         "fee": fee
#     }

def create_fees(body: FeesCreate, db: Session):
    student_id = int(body.student_id)
    amount = float(body.amount)

    if student_id is None:
        raise HTTPException(400, "Student ID is required")

    existing_fee = db.query(Fees).filter(Fees.student_id == student_id).first()
    if existing_fee:
        raise HTTPException(400, "Fee already exists for this student")

    fee = Fees(
        student_id=student_id,
        amount=amount,
        status="pending"
    )
    db.add(fee)
    db.commit()
    db.refresh(fee)

    return {
        "message": "Fee created successfully",
        "fee": fee
    }


def get_all_fees(db: Session):
    all_fees = db.query(Fees).all()
    return {
        "total_fees": len(all_fees),
        "fees": all_fees
    }


def get_student_fees(student_id: int, db: Session):
    if not student_id:
        raise HTTPException(400, "Student ID is required")
    fees = db.query(Fees).filter(Fees.student_id == student_id).all()
    if not fees:
        raise HTTPException(404, "No fees found for this student")
    return {
        "total_fees": len(fees),
        "fees": fees
    }


def update_fees(fee_id: int, body: FeesUpdate, db: Session):
    fee = db.query(Fees).filter(Fees.id == fee_id).first()

    if not fee:
        raise HTTPException(404, "Fee not found")

    fee.amount = body.amount
    fee.status = body.status

    db.commit()
    db.refresh(fee)

    return {
        "message": "Fee updated successfully",
        "fee": fee
    }
