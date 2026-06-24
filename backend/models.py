from sqlalchemy import Column, Integer, Float, String
from database import Base
from sqlalchemy import ForeignKey

class FinanceRecord(Base):
    __tablename__ = "finance_records"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"))

    income = Column(Float)
    expenses = Column(Float)
    debt = Column(Float)
    savings = Column(Float)

    financial_score = Column(Float)
    status = Column(String)

    savings_rate = Column(Float)
    debt_ratio = Column(Float)
    expense_ratio = Column(Float)
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)