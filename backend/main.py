from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware

from routes.auth import get_current_user
from models import User

from database import engine
from database import Base
from database import SessionLocal
from models import FinanceRecord

from schemas import FinancialData
from engines.finance_engine import  analyze_finance

from models import FinanceRecord
from dependencies import get_db

from services.hf_service import get_ai_advice
from database import engine, Base
import models
from routes.user import router as user_router




Base.metadata.create_all(bind=engine)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://finxtime.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "FINXTIME API Running"}


@app.post("/analyze")
def analyze(
    data: FinancialData,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
   

    result = analyze_finance(
        data.income,
        data.expenses,
        data.debt,
        data.savings
    )

    record = FinanceRecord(
        user_id=current_user.id,
        income=data.income,
        expenses=data.expenses,
        debt=data.debt,
        savings=data.savings,
        financial_score=result["financial_score"],
        status=result["status"],
        savings_rate=result["savings_rate"],
        debt_ratio=result["debt_ratio"],
        expense_ratio=result["expense_ratio"]
    )

    db.add(record)
    db.commit()
    db.refresh(record)

    

    return result

@app.get("/history")
def get_history(
    current_user: User = Depends(get_current_user)
):
    db = SessionLocal()
    try:
        records = db.query(FinanceRecord).filter(
    FinanceRecord.user_id == current_user.id
).all()

        return [
            {
                "id": r.id,
                "income": r.income,
                "expenses": r.expenses,
                "debt": r.debt,
                "savings": r.savings,
                "financial_score": r.financial_score,
                "status": r.status
            }
            for r in records
        ]
    finally:
        db.close()

@app.post("/ai-advice")
def ai_advice(
    data: FinancialData,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    result = analyze_finance(
        data.income,
        data.expenses,
        data.debt,
        data.savings
    )

    record = FinanceRecord(
        user_id=current_user.id,
        income=data.income,
        expenses=data.expenses,
        debt=data.debt,
        savings=data.savings,
        financial_score=result["financial_score"],
        status=result["status"],
        savings_rate=result["savings_rate"],
        debt_ratio=result["debt_ratio"],
        expense_ratio=result["expense_ratio"]
    )

    db.add(record)
    db.commit()
    db.refresh(record)

    ai_response = get_ai_advice(result)

    return {
        "result": result,
        "ai_advice": ai_response
    }
app.include_router(user_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)