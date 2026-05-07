from sqlalchemy.orm import Session
from fastapi import HTTPException, Request

from src.classes.model import Class
from src.Faculty.model import Faculty
from src.batch.model import Batch
from src.classes.schemas import *
from src.Utills.authentication import is_authenticated



# ✅ CREATE CLASS
def create_class(db: Session, body: ClassCreate):
    faculty = db.query(Faculty).filter(Faculty.id == body.faculty_id).first()
    if not faculty:
        raise HTTPException(400, "Invalid faculty")

    new_class = Class(
        title=body.title,
        description=body.description,
        faculty_id=body.faculty_id
    )

    db.add(new_class)
    db.commit()
    db.refresh(new_class)

    return {"status": "ok", "class": new_class}


# ✅ GET ALL CLASSES
def get_all_classes(db: Session):
    classes = db.query(Class).all()

    return {
        "status": "ok",
        "count": len(classes),
        "classes": classes
    }


# ✅ GET CLASS BY ID
def get_class_by_id(request: Request, db: Session):
    class_id = request.query_params.get("class_id")

    if not class_id:
        raise HTTPException(400, "class_id is required")

    data = db.query(Class).filter(Class.id == int(class_id)).first()

    if not data:
        raise HTTPException(404, "Class not found")

    return {"status": "ok", "class": data}


# ✅ GET CLASS WITH BATCHES
def get_class_with_batches(request: Request, db: Session):
    class_id = request.query_params.get("class_id")

    if not class_id:
        raise HTTPException(400, "class_id is required")

    data = db.query(Class).filter(Class.id == int(class_id)).first()
    if not data:
        raise HTTPException(404, "Class not found")

    batches = db.query(Batch).filter(Batch.class_id == int(class_id)).all()

    return {
        "status": "ok",
        "class": data,
        "batches": batches
    }


# ✅ UPDATE CLASS
def update_class(request: Request, db: Session, body: ClassCreate):
    class_id = request.query_params.get("class_id")

    if not class_id:
        raise HTTPException(400, "class_id is required")

    data = db.query(Class).filter(Class.id == int(class_id)).first()
    if not data:
        raise HTTPException(404, "Class not found")

    faculty = db.query(Faculty).filter(Faculty.id == body.faculty_id).first()
    if not faculty:
        raise HTTPException(400, "Invalid faculty")

    data.title = body.title
    data.description = body.description
    data.faculty_id = body.faculty_id

    db.commit()
    db.refresh(data)

    return {"status": "ok", "class": data}


# ✅ DELETE CLASS
def delete_class(request: Request, db: Session):
    class_id = request.query_params.get("class_id")

    if not class_id:
        raise HTTPException(400, "class_id is required")

    data = db.query(Class).filter(Class.id == int(class_id)).first()
    if not data:
        raise HTTPException(404, "Class not found")

    db.delete(data)
    db.commit()

    return {"status": "ok", "message": "Class deleted"}