from huggingface_hub import InferenceClient
import os
from dotenv import load_dotenv

load_dotenv()

client = InferenceClient(
    api_key=os.getenv("HF_TOKEN")
)

def get_ai_advice(financial_data):

    prompt = f"""
You are an expert Personal Finance Coach.

Financial Score: {financial_data['financial_score']}
Status: {financial_data['status']}

Income: ₹{financial_data['income']}
Expenses: ₹{financial_data['expenses']}
Debt: ₹{financial_data['debt']}
Savings: ₹{financial_data['savings']}

Savings Rate: {financial_data['savings_rate']}%
Debt Ratio: {financial_data['debt_ratio']}%
Expense Ratio: {financial_data['expense_ratio']}%

Recommendations:
{financial_data['recommendations']}

Provide:
1. Financial Analysis
2. Key Risks
3. Action Plan
4. Saving Goal
"""

    response = client.chat.completions.create(
        model="Qwen/Qwen2.5-7B-Instruct",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        max_tokens=400
    )

    return {
        "advice": response.choices[0].message.content
    }