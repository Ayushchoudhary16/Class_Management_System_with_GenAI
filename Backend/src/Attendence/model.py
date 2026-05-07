
from sqlalchemy import Column, Integer, Date, String, ForeignKey, Enum
from src.Utills.database import Base

class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    batch_id = Column(Integer, ForeignKey("batch.id"))
    date = Column(Date)
    status = Column(Enum("present", "absent", name="attendance_status"))