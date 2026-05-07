from sqlalchemy import Column, Integer, String,Boolean
from src.Utills.database import Base

class Faculty(Base):
    __tablename__ = "faculty"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    name = Column(String)
    department = Column(String, nullable=False)
    designation = Column(String, nullable=False)
    is_approved = Column(Boolean, default=False)