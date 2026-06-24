import React, { useEffect, useState, useMemo } from 'react'
import { BarChart3, AlertCircle, RefreshCw } from 'lucide-react'
import ExpensePieChart from '../components/Charts/ExpensePieChart'
import IncomeExpenseBarChart from '../components/Charts/IncomeExpenseBarChart'
import ScoreTrendLineChart from '../components/Charts/ScoreTrendLineChart'
import LoadingSpinner from '../components/LoadingSpinner'
import { getHistory } from '../services/api'

function ChartCard({ title, subtitle, children }) {
  return (
    <div className="card p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-slate-200">{title}</h3>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}

export default function Analytics() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  const load = () => {
    setLoading(true)
    setError('')
    getHistory()
      .then(res => {
        const items = Array.isArray(res.data) ? res.data : (res.data?.history ?? [])
        setHistory(items)
      })
      .catch(err => setError(err.message || 'Failed to load data.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  // Derive chart data
  const barData = useMemo(() =>
    history.slice(-8).map((r, i) => ({
      label: r.timestamp
        ? new Date(r.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
        : `#${i + 1}`,
      income:   r.income   ?? 0,
      expenses: r.expenses ?? 0,
    })), [history])

  const scoreData = useMemo(() =>
    history.slice(-12).map((r, i) => ({
      label: r.timestamp
        ? new Date(r.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
        : `#${i + 1}`,
      score: r.financial_score ?? 0,
    })), [history])

  const pieData = useMemo(() => {
    if (!history.length) return []
    const last = history[history.length - 1]
    return [
      { name: 'Savings',  value: last.savings  ?? 0 },
      { name: 'Expenses', value: last.expenses  ?? 0 },
      { name: 'Debt',     value: last.debt      ?? 0 },
    ].filter(d => d.value > 0)
  }, [history])

  if (loading) return (
    <div className="flex justify-center py-24"><LoadingSpinner size="lg" text="Loading analytics…" /></div>
  )

  if (error) return (
    <div className="card p-8 flex flex-col items-center gap-4 border-red-500/20">
      <AlertCircle size={28} className="text-red-400" />
      <p className="text-sm text-red-400">{error}</p>
      <button onClick={load} className="btn-primary flex items-center gap-2">
        <RefreshCw size={15} /> Retry
      </button>
    </div>
  )

  if (!history.length) return (
    <div className="card p-16 text-center">
      <BarChart3 size={36} className="text-slate-700 mx-auto mb-4" />
      <h3 className="text-base font-semibold text-slate-400 mb-1">No data to visualize</h3>
      <p className="text-sm text-slate-600">Run at least one analysis on the AI Coach page.</p>
    </div>
  )

  // Aggregate stats
  const latest = history[history.length - 1]
  const avgScore = Math.round(history.reduce((s, r) => s + (r.financial_score ?? 0), 0) / history.length)
  const totalAnalyses = history.length

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Analyses Run',   val: totalAnalyses,                      color: 'text-slate-100' },
          { label: 'Avg Score',      val: avgScore,                            color: 'text-brand-400' },
          { label: 'Latest Score',   val: latest.financial_score ?? '—',       color: latest.financial_score >= 70 ? 'text-brand-400' : latest.financial_score >= 40 ? 'text-yellow-400' : 'text-red-400' },
        ].map(({ label, val, color }) => (
          <div key={label} className="card p-4 text-center">
            <p className={`text-2xl font-bold font-mono ${color}`}>{val}</p>
            <p className="text-xs text-slate-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Score Trend" subtitle="Financial health score over time">
          <ScoreTrendLineChart data={scoreData} />
        </ChartCard>

        <ChartCard title="Allocation Breakdown" subtitle="Latest snapshot distribution">
          <ExpensePieChart data={pieData} />
        </ChartCard>
      </div>

      <ChartCard title="Income vs Expenses" subtitle="Last 8 analyses compared">
        <IncomeExpenseBarChart data={barData} />
      </ChartCard>
    </div>
  )
}
