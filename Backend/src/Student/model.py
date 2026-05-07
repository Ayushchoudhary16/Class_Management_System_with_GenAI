from sqlalchemy import Column, Integer, String, Date
from src.Utills.database import Base

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    dob = Column(Date)
    email = Column(String, unique=True, index=True)
    address = Column(String)
    mobile_no = Column(String)
    parent_mobile_no = Column(String)
    password = Column(String)