from fastapi import Request,HTTPException,Depends,status
# import jwt
from sqlalchemy.orm import Session
from jose import JWTError,jwt


from src.Utills.database import get_db
from src.Utills.helper import *
from src.Admin.model import Admin
from src.Student.model import Student
from src.Faculty.model import Faculty

def is_authenticated(req: Request, db: Session = Depends(get_db)):
    try:
        auth_header = req.headers.get("Authorization")

        if not auth_header:
            raise HTTPException(401, "Token missing")

        parts = auth_header.split(" ")

        if len(parts) != 2 or parts[0] != "Bearer":
            raise HTTPException(401, "Invalid token format")

        token = parts[1]

        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        user_id = payload.get("user_id")
        role = payload.get("role")

        if not user_id or not role:
            raise HTTPException(401, "Invalid token payload")

        if role == "admin":
            user = db.query(Admin).filter(Admin.id == user_id).first()
        elif role == "student":
            user = db.query(Student).filter(Student.id == user_id).first()
        elif role == "faculty":
            user = db.query(Faculty).filter(Faculty.id == user_id).first()
        else:
            raise HTTPException(401, "Invalid role")

        if not user:
            raise HTTPException(401, "User not found")

        return {"user": user, "role": role}

    except JWTError:
        raise HTTPException(401, "Invalid token")
    




def admin_required(data = Depends(is_authenticated)):
    if data["role"] != "admin":
        raise HTTPException(403, "Admin access only")
    return data["user"]

def faculty_required(data = Depends(is_authenticated)):
    if data["role"] != "faculty":
        raise HTTPException(403, "Faculty access required")
    return data["user"]

def student_required(data = Depends(is_authenticated)):
    if data["role"] != "student":
        raise HTTPException(403, "Student access required")
    return data["user"]

def require_role(*roles):
    def checker(data = Depends(is_authenticated)):
        if data["role"] not in roles:
            raise HTTPException(403, "Access denied")
        return data
    return checker
# def require_role(role: str):
#     def role_checker(data=Depends(is_authenticated)):
#         if not data or "user" not in data:
#             raise HTTPException(status_code=401, detail="Unauthorized")

#         if data["user"].role != role:
#             raise HTTPException(status_code=403, detail="Access denied")

#         return data
#     return role_checker