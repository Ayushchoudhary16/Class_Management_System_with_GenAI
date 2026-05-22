from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session


from src.Admin.controller import *
from src.Admin.schemas import *
from src.Admin.model import *
from src.Utills.database import get_db
from src.Utills.authentication import is_authenticated

admin_router=APIRouter()

@admin_router.post("/admin_register")
def register_admin(body:AdminCreate,db:Session=Depends(get_db)):
    return create_admin(body,db)

@admin_router.post("/admin_login")
def login_admins(body:loginSchema,db:Session=Depends(get_db)):
    return login_admin(body,db)

@admin_router.get("/get_admin_by_id")
def get_admin(db:Session=Depends(get_db),data=Depends(is_authenticated)):
    if data["role"] != "admin":
        raise HTTPException(403, "Admin access only")
    return get_admin_by_id(data["user"].id,db)

@admin_router.delete("/delete_admin")
def delete_admin(request:Request,db:Session=Depends(get_db),data=Depends(is_authenticated)):
    return delete_admin_by_id(request,db)

@admin_router.put("/update_admin")
def update_admins(body:updateSchema,db:Session=Depends(get_db), data=Depends(is_authenticated)):
    if data["role"] != "admin":
        raise HTTPException(403, "Admin access only")
    return update_admin(body, data["user"].id, db)


@admin_router.put("/approve/{id}")
def approve(id: int, db: Session = Depends(get_db), data=Depends(is_authenticated)):
    return approve_faculty(id, db)

@admin_router.get("/requests")
def requests(db: Session = Depends(get_db), data=Depends(is_authenticated)):
    return get_pending_faculty(db)