def analyze_finance(income, expenses, debt, savings):

    # Prevent division by zero
    if income <= 0:
        return {
            "error": "Income must be greater than 0"
        }

    # Ratios
    savings_rate = (savings / income) * 100
    debt_ratio = (debt / income) * 100
    expense_ratio = (expenses / income) * 100

    # Financial Health Score
    score = 100

    score -= expense_ratio * 0.3
    score -= debt_ratio * 0.4
    score += savings_rate * 0.5

    # Keep score between 0 and 100
    score = max(0, min(100, score))

    # Financial Status
    if score >= 80:
        status = "Excellent"
    elif score >= 60:
        status = "Good"
    elif score >= 40:
        status = "Average"
    else:
        status = "Poor"

    # Recommendations
    recommendations = []

    if savings_rate < 20:
        recommendations.append(
            "Increase your monthly savings to at least 20% of your income."
        )

    if debt_ratio > 30:
        recommendations.append(
            "Reduce outstanding debt to improve financial stability."
        )

    if expense_ratio > 70:
        recommendations.append(
            "Your expenses are high. Review discretionary spending."
        )

    if savings_rate >= 20:
        recommendations.append(
            "You have a healthy savings habit. Maintain consistency."
        )

    if debt_ratio < 20:
        recommendations.append(
            "Your debt level is manageable."
        )

    if score >= 80:
        recommendations.append(
            "You are in a strong financial position."
        )

    return {
        "financial_score": round(score, 2),
        "status": status,
        "income": income,
        "expenses": expenses,
        "debt": debt,
        "savings": savings,
        "savings_rate": round(savings_rate, 2),
        "debt_ratio": round(debt_ratio, 2),
        "expense_ratio": round(expense_ratio, 2),
        "recommendations": recommendations
    }