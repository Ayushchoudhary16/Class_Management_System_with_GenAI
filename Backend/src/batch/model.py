from sqlalchemy import Column, Integer, String, Date, ForeignKey
from src.Utills.database import Base
class Batch(Base):
    __tablename__ = "batch"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    class_id = Column(Integer, ForeignKey("class.id"))
    batch_fee=Column(Integer, nullable=False)
    start_date = Column(Date)
    end_date = Column(Date)








# [
#     {
#         "course_id": 3,
#         "name": "Python placement batch",
#         "id": 1,
#         "end_date": "2026-01-03",
#         "start_date": "2025-01-07"
#     },
#     {
#         "course_id": 2,
#         "name": "Java placement batch",
#         "id": 2,
#         "end_date": "2026-01-06",
#         "start_date": "2025-01-09"
#     },
#     {
#         "course_id": 1,
#         "name": "DSA placement batch",
#         "id": 3,
#         "end_date": "2026-01-06",
#         "start_date": "2025-01-09"
#     }
# ]