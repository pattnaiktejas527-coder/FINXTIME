import React, { useEffect, useState } from 'react'
import {
  Wallet, CreditCard, PiggyBank, TrendingDown,
  Star, Activity, ArrowRight, Sparkles
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import SummaryCard from '../components/SummaryCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { getHistory } from '../services/api'

const greet = () => {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [latest, setLatest] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getHistory()
      .then(res => {
        const items = Array.isArray(res.data) ? res.data : (res.data?.history ?? [])
        if (items.length) setLatest(items[items.length - 1])
      })
      .catch(() => setError('Could not load financial data.'))
      .finally(() => setLoading(false))
  }, [])

  const scoreColor = (s) => {
    if (s >= 70) return 'green'
    if (s >= 40) return 'yellow'
    return 'red'
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero welcome */}
      <div className="card p-6 bg-gradient-to-r from-brand-900/60 to-surface-card border-brand-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm text-brand-400 font-medium mb-1">{greet()}, Investor 👋</p>
            <h2 className="text-2xl font-bold text-slate-100">Your Financial Overview</h2>
            <p className="text-sm text-slate-500 mt-1">
              {latest
                ? `Last analyzed: ${new Date(latest.timestamp || latest.date || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`
                : 'No analysis yet — run your first AI check-up!'}
            </p>
          </div>
          <button
            onClick={() => navigate('/ai-coach')}
            className="btn-primary flex items-center gap-2 self-start sm:self-auto"
          >
            <Sparkles size={16} />
            AI Analysis
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Summary cards */}
      {loading ? (
        <div className="flex justify-center py-16"><LoadingSpinner size="lg" text="Loading your data…" /></div>
      ) : error ? (
        <div className="card p-8 text-center">
          <p className="text-red-400 text-sm mb-3">{error}</p>
          <button onClick={() => navigate('/ai-coach')} className="btn-primary">Run First Analysis</button>
        </div>
      ) : latest ? (
        <>
          <div>
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-3">Financial Snapshot</p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <SummaryCard title="Income"   value={latest.income}   icon={Wallet}      color="green"  />
              <SummaryCard title="Expenses" value={latest.expenses} icon={CreditCard}   color="red"    />
              <SummaryCard title="Savings"  value={latest.savings}  icon={PiggyBank}    color="blue"   />
              <SummaryCard title="Debt"     value={latest.debt}     icon={TrendingDown} color="yellow" />
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-3">Performance</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SummaryCard
                title="Financial Score"
                value={latest.financial_score}
                icon={Star}
                color={scoreColor(latest.financial_score)}
                prefix=""
              />
              <SummaryCard
                title="Status"
                value={latest.status}
                icon={Activity}
                color={scoreColor(latest.financial_score)}
                prefix=""
              />
            </div>
          </div>

          {/* Quick stats row */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Savings Rate',  val: `${latest.savings_rate?.toFixed(1) ?? '—'}%`,  color: 'text-brand-400' },
              { label: 'Debt Ratio',    val: `${latest.debt_ratio?.toFixed(1) ?? '—'}%`,    color: 'text-red-400'   },
              { label: 'Expense Ratio', val: `${latest.expense_ratio?.toFixed(1) ?? '—'}%`, color: 'text-yellow-400'},
            ].map(({ label, val, color }) => (
              <div key={label} className="card p-4 text-center">
                <p className={`text-xl font-bold font-mono ${color}`}>{val}</p>
                <p className="text-xs text-slate-500 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* Empty state */
        <div className="card p-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-brand-500/10 flex items-center justify-center mx-auto mb-4">
            <Sparkles size={28} className="text-brand-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-200 mb-2">No data yet</h3>
          <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto">
            Run your first AI financial analysis to populate your dashboard with insights.
          </p>
          <button onClick={() => navigate('/ai-coach')} className="btn-primary inline-flex items-center gap-2">
            <Sparkles size={16} /> Start Analysis
          </button>
        </div>
      )}
    </div>
  )
}
