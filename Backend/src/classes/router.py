from fastapi import APIRouter, Depends,Request
from sqlalchemy.orm import Session

from src.classes.controller import create_class, delete_class, delete_class, get_all_classes, get_all_classes, update_class
from src.classes.schemas import ClassCreate
from src.Utills.database import get_db
from src.classes.schemas import *
from src.classes.controller import *
from src.Utills.authentication import is_authenticated


classrouter = APIRouter()


@classrouter.post("/create_class",)
def create_class_api(body: ClassCreate,db:Session=Depends(get_db)):
    return create_class(db, body)


@classrouter.get("/get_all_classes")
def get_classes(db: Session = Depends(get_db)):
    return get_all_classes(db)


@classrouter.get("/get_class_by_id")
def get_class(request:Request, db: Session = Depends(get_db)):
    return get_class_by_id(request,db)

@classrouter.get("/get_class_by_id_p_batch")
def get_class_P_batch(request:Request, db: Session = Depends(get_db)):
    return get_class_with_batches(request,db)

@classrouter.put("/update_class")
def update_class_api(request:Request,body:ClassCreate,db: Session=Depends(get_db)):
    return update_class(request,db, body)


@classrouter.delete("/delete_class")
def delete_class_api(request:Request,db: Session = Depends(get_db)):
    return delete_class(request,db)
