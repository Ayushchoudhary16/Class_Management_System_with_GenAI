from fastapi import HTTPException, status,Request
from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone
import jwt

from src.Admin.model import Admin
from src.Admin.schemas import *
from src.Utills.database import get_db
from src.Utills.helper import *
from src.Faculty.model import Faculty

def create_admin(body: AdminCreate, db: Session):
    if body.secret_key != "CMSAdmin2026":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid Admin Secret Key")
        
    existing_user = db.query(Admin).filter(Admin.email == body.email).first()
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    
    hashed_password = hash_password(body.password)
    new_user = Admin(
        email=body.email,
        password=hashed_password,
        name=body.name)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

# def create_admin(db: Session):
#     admin = Admin(
#         name="Ayush Choudhary",
#         email="choudharyayush@gmail.com",
#         password=hash_password("12345")
#     )
#     db.add(admin)
#     db.commit()


def login_admin(body: loginSchema, db: Session):
    admin = db.query(Admin).filter(Admin.email == body.email).first()

    if not admin:
        raise HTTPException(404, "Admin not found")

    if not verify_password(body.password, admin.password):
        raise HTTPException(400, "Incorrect password")

    expire = datetime.now(timezone.utc) + timedelta(minutes=2000)

    token = jwt.encode(
        {
            "user_id": admin.id,        
            "email": admin.email,
            "role": "admin",           
            "exp": expire
        },
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return {"status": "ok", "token": token, "user": admin}

def approve_faculty(id: int, db: Session):
    
    faculty = db.query(Faculty).filter(Faculty.id == id).first()

    if not faculty:
        raise HTTPException(404, "Faculty not found")

    faculty.is_approved = True
    db.commit()

    return {"msg": "Faculty approved"}


def get_pending_faculty(db: Session):
    return db.query(Faculty).filter(Faculty.is_approved == False).all()


def get_admin_by_id(admin_id:int,db:Session):
    admin=db.query(Admin).filter(Admin.id==admin_id).first()
    if not admin:
        raise HTTPException(404, "Admin not found")
    return admin

def delete_admin_by_id(request:Request,db:Session):
    admin_id = int(request.query_params.get("admin_id"))
    admin=db.query(Admin).filter(Admin.id==admin_id).first()
    if not admin:
        raise HTTPException(404, "Admin not found")
    
    db.delete(admin)
    db.commit()
    return {
        "status":"ok",
        "admin":admin
    }

def update_admin(body:updateSchema,admin_id:int,db:Session):
    admin=db.query(Admin).filter(Admin.id==admin_id).first()
    if not admin:
        raise HTTPException(404, "Admin not found")

    hashed_password =hash_password(body.password)
    
    admin.password=hashed_password
    admin.name=body.name

    db.commit()
    db.refresh(admin)

    return {
        "status": "ok",
        "admin": admin
    }
    