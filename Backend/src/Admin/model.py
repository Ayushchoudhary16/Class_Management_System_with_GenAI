from sqlalchemy import Column, Integer, String
from src.Utills.database import Base

class Admin(Base):
    __tablename__ = "admin"
    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True)
    password = Column(String)
    name = Column(String, nullable=False)
