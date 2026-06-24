import React, { useState } from 'react'
import { DollarSign, CreditCard, PiggyBank, TrendingDown, Sparkles } from 'lucide-react'
import LoadingSpinner from './LoadingSpinner'

const fields = [
  { key: 'income',   label: 'Monthly Income',   icon: DollarSign,   placeholder: '75000',  color: 'brand' },
  { key: 'expenses', label: 'Monthly Expenses',  icon: CreditCard,   placeholder: '45000',  color: 'red'   },
  { key: 'savings',  label: 'Current Savings',   icon: PiggyBank,    placeholder: '120000', color: 'blue'  },
  { key: 'debt',     label: 'Outstanding Debt',  icon: TrendingDown, placeholder: '30000',  color: 'yellow'},
]

const iconColors = {
  brand:  'text-brand-400 bg-brand-500/10',
  red:    'text-red-400 bg-red-500/10',
  blue:   'text-blue-400 bg-blue-500/10',
  yellow: 'text-yellow-400 bg-yellow-500/10',
}

export default function FinanceForm({ onSubmit, loading }) {
  const [values, setValues] = useState({ income: '', expenses: '', savings: '', debt: '' })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    fields.forEach(({ key, label }) => {
      const v = parseFloat(values[key])
      if (!values[key]) e[key] = `${label} is required`
      else if (isNaN(v) || v < 0) e[key] = 'Enter a valid positive number'
    })
    return e
  }

  const handleChange = (key, val) => {
    setValues(prev => ({ ...prev, [key]: val }))
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: '' }))
  }

  const handleSubmit = () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    onSubmit({
      income:   parseFloat(values.income),
      expenses: parseFloat(values.expenses),
      savings:  parseFloat(values.savings),
      debt:     parseFloat(values.debt),
    })
  }

  return (
    <div className="card p-6 space-y-5">
      <div>
        <h2 className="text-base font-semibold text-slate-100">Your Financial Snapshot</h2>
        <p className="text-sm text-slate-500 mt-0.5">Enter your current numbers to get personalized AI advice.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map(({ key, label, icon: Icon, placeholder, color }) => (
          <div key={key}>
            <label className="label">{label} <span className="text-slate-600">(₹)</span></label>
            <div className="relative">
              <div className={`absolute left-3 top-1/2 -translate-y-1/2 p-1 rounded-md ${iconColors[color]}`}>
                <Icon size={14} />
              </div>
              <input
                type="number"
                min="0"
                value={values[key]}
                onChange={e => handleChange(key, e.target.value)}
                placeholder={placeholder}
                className={`input pl-11 ${errors[key] ? 'border-red-500 focus:ring-red-500' : ''}`}
              />
            </div>
            {errors[key] && <p className="text-xs text-red-400 mt-1">{errors[key]}</p>}
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="btn-primary w-full flex items-center justify-center gap-2 text-base"
      >
        {loading ? (
          <LoadingSpinner size="sm" />
        ) : (
          <>
            <Sparkles size={18} />
            Analyze with AI
          </>
        )}
      </button>
    </div>
  )
}
