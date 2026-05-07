from sqlalchemy import Column, Integer, String ,ForeignKey
from src.Utills.database import Base

class Class(Base):
    __tablename__ = "class"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, unique=True, nullable=False)
    description = Column(String, nullable=True)
    faculty_id = Column(Integer,ForeignKey("faculty.id"),nullable=False)

