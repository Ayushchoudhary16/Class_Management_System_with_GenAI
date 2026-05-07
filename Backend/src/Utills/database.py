from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy import create_engine

db_URL="postgresql+psycopg2://postgres:Ayushsql@localhost:5433/ClassManagementSystem"

Base=declarative_base()

db_init=create_engine(db_URL)

local_session=sessionmaker(bind=db_init)

def get_db():
    db=local_session()
    try:
        yield db
    finally:
        db.close()