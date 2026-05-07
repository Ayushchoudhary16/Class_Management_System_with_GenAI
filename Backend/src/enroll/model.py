from sqlalchemy import Column, Integer, ForeignKey, UniqueConstraint
from src.Utills.database import Base
class Enrollment(Base):
    __tablename__ = "enrollmente"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    batch_id = Column(Integer, ForeignKey("batch.id"), nullable=False)
