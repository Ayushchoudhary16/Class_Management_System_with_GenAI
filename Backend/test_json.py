import asyncio
from fastapi.encoders import jsonable_encoder
from sqlalchemy import Column, Integer, String, Date
from sqlalchemy.orm import declarative_base
import datetime

Base = declarative_base()

class TestModel(Base):
    __tablename__ = "test"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    due_date = Column(Date)

async def test():
    item = TestModel(id=1, name="test", due_date=datetime.date.today())
    try:
        print(jsonable_encoder(item))
    except Exception as e:
        print(f"Error: {e}")

asyncio.run(test())
