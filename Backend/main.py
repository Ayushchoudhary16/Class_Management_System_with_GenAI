from fastapi import HTTPException,FastAPI,Depends,Request
from src.Utills.database import *
from fastapi.middleware.cors import CORSMiddleware  


from src.Admin.router import admin_router
from src.Faculty.router import router as faculty_router
from src.Student.router import router as student_router
from src.classes.router import classrouter 
from src.batch.router import batchrouter
from src.enroll.router import enrollrouter
from src.Attendence.router import router as attendence_router
from src.genAI.router import router as genAI_router
from src.Fees.router import router as fees_router


Base.metadata.create_all(db_init)

app=FastAPI()


origins = [
    "http://localhost:5173",  # React Vite frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # dev ke liye
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

app.include_router(admin_router,prefix="/admin",tags=["Admin"])
app.include_router(faculty_router,prefix="/faculty",tags=["Faculty"])
app.include_router(student_router,prefix="/student",tags=["Student"])
app.include_router(classrouter,prefix="/class",tags=["Class"])
app.include_router(batchrouter,prefix="/batch",tags=["Batch"])
app.include_router(enrollrouter,prefix="/enroll",tags=["Enrollment"])
app.include_router(attendence_router,prefix="/attendance",tags=["Attendance"])
app.include_router(genAI_router,prefix="/genai",tags=["GenAI"])
app.include_router(fees_router,prefix="/fees",tags=["Fees"])

@app.get("/")
def read_root():
    return {"message": "Class Management System API is running"}

