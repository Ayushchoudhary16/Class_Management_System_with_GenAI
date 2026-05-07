from sqlalchemy.orm import Session
from fastapi import HTTPException, Request
from src.batch.model import Batch
from src.batch.schemas import *
from src.classes.model import Class
from src.classes.schemas import *
from src.Utills.authentication import is_authenticated


def create_batch(db: Session, body: BatchCreate):
    classes = db.query(Class).filter(Class.id == body.class_id).first()
    if not classes:
        raise HTTPException(400,"Invalid class")
    
    existing_batch=db.query(Batch).filter(Batch.name == body.name).first()
    if existing_batch:
        raise HTTPException(400,"Batch with name already exists")

    new_batch = Batch(
        name=body.name,
        class_id=body.class_id,
        batch_fee=body.batch_fee,
        start_date=body.start_date,
        end_date=body.end_date
    )

    db.add(new_batch)
    db.commit()
    db.refresh(new_batch)

    return {
        "status": "ok",
        "batch": new_batch
    }

def get_all_batches(db: Session):
    batches= db.query(Batch).all()
    return {
        "status": "ok",
        "batches": batches,
        "count": len(batches),
    }


def get_batch_by_id(request: Request, db: Session):
    batch_id = int(request.query_params.get("batch_id"))

    batch = db.query(Batch).filter(Batch.id == batch_id).first()
    if not batch:
        raise HTTPException(404, "Batch not found")

    return {
        "status": "ok",
        "batch": batch
    }

def update_batch(request: Request, db: Session, body: BatchCreate):
    batch_id = int(request.query_params.get("batch_id"))

    batch = db.query(Batch).filter(Batch.id == batch_id).first()
    if not batch:
        raise HTTPException(404, "Batch not found")

    classes = db.query(Class).filter(Class.id == body.class_id).first()
    if not classes:
        raise HTTPException(400, "Invalid class")

    batch.name = body.name
    batch.class_id = body.class_id
    batch.batch_fee=body.batch_fee
    batch.start_date = body.start_date
    batch.end_date = body.end_date

    db.commit()
    db.refresh(batch)

    return {
        "status": "ok",
        "batch": batch
    }

def delete_batch(request: Request, db: Session):
    batch_id = int(request.query_params.get("batch_id"))

    batch = db.query(Batch).filter(Batch.id == batch_id).first()
    if not batch:
        raise HTTPException(404, "Batch not found")

    db.delete(batch)
    db.commit()

    return {
        "message": "Batch deleted successfully",
        "batch": batch
    }
