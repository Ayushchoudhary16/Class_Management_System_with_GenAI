# from sqlalchemy import Column, Integer, String, ForeignKey, Date
# from src.Utills.database import Base
# from datetime import date, timedelta

# class Fees(Base):
#     __tablename__ = "fees"

#     id = Column(Integer, primary_key=True)
#     student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
#     batch_id = Column(Integer, ForeignKey("batch.id"), nullable=False)
#     total_amount = Column(Integer, nullable=False)
#     amount_paid = Column(Integer, default=0)
#     due_date = Column(Date, nullable=False)
#     status = Column(String, default="pending")   # paid / pending / partial

from sqlalchemy import Column, Integer, String, ForeignKey, Date
from src.Utills.database import Base

class Fees(Base):
    __tablename__ = "fees"

    id = Column(Integer, primary_key=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    batch_id = Column(Integer, ForeignKey("batch.id"), nullable=False)

    total_amount = Column(Integer, nullable=False)
    amount_paid = Column(Integer, default=0)

    due_date = Column(Date, nullable=False)

    status = Column(String, default="pending")