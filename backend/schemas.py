from pydantic import BaseModel


class FinancialData(BaseModel):
    income: float
    expenses: float
    debt: float
    savings: float



class UserCreate(BaseModel):
    username: str
    email: str
    password: str


class UserLogin(BaseModel):
    email: str
    password: str