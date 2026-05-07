from sqlalchemy import Column, Integer, String, ForeignKey
from src.Utills.database import Base

class Fees(Base):
    __tablename__ = "fees"

    id = Column(Integer, primary_key=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    amount = Column(Integer)
    status = Column(String, default="pending")   # paid / pending