import React from 'react'
import {
  CheckCircle2, AlertTriangle, XCircle, TrendingUp,
  Target, ShieldAlert, Lightbulb, Bot
} from 'lucide-react'

function ScoreGauge({ score }) {
  const pct = Math.min(Math.max(score, 0), 100)
  const circumference = 2 * Math.PI * 52
  const dash = (pct / 100) * circumference
  const color = score >= 70 ? '#25a26e' : score >= 40 ? '#eab308' : '#ef4444'

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="130" height="130" viewBox="0 0 130 130">
        <circle cx="65" cy="65" r="52" fill="none" stroke="#1f2637" strokeWidth="10" />
        <circle
          cx="65" cy="65" r="52" fill="none"
          stroke={color} strokeWidth="10"
          strokeDasharray={`${dash} ${circumference}`}
          strokeDashoffset={circumference / 4}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 1s ease' }}
        />
        <text x="65" y="60" textAnchor="middle" fill="#f1f5f9" fontSize="26" fontWeight="700" fontFamily="JetBrains Mono">
          {pct}
        </text>
        <text x="65" y="78" textAnchor="middle" fill="#64748b" fontSize="11" fontFamily="Inter">
          SCORE
        </text>
      </svg>
    </div>
  )
}

function StatusBadge({ status }) {
  if (!status) return null
  const s = status.toLowerCase()
  if (s.includes('excel') || s.includes('great') || s.includes('good'))
    return <span className="badge-green"><CheckCircle2 size={12} /> {status}</span>
  if (s.includes('average') || s.includes('moderate') || s.includes('fair'))
    return <span className="badge-yellow"><AlertTriangle size={12} /> {status}</span>
  return <span className="badge-red"><XCircle size={12} /> {status}</span>
}

function MetricBar({ label, value, max = 100, color = 'green' }) {
  const pct = Math.min((value / max) * 100, 100)
  const barColor = {
    green:  'bg-brand-500',
    red:    'bg-red-500',
    yellow: 'bg-yellow-500',
    blue:   'bg-blue-500',
  }[color]

  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm text-slate-400">{label}</span>
        <span className="text-sm font-mono font-medium text-slate-200">{value?.toFixed(1)}%</span>
      </div>
      <div className="h-2 bg-surface-muted rounded-full overflow-hidden">
        <div
          className={`h-full ${barColor} rounded-full transition-all duration-1000`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

export default function AIResponse({ data }) {
  if (!data) return null

  const { financial_score, status, savings_rate, debt_ratio, expense_ratio, recommendations, ai_advice } = data

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Score + Status */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <ScoreGauge score={financial_score ?? 0} />
          <div className="flex-1 space-y-3 text-center sm:text-left">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Financial Status</p>
              <StatusBadge status={status} />
            </div>
            <div className="space-y-2.5">
              <MetricBar label="Savings Rate"  value={savings_rate}  color="green" />
              <MetricBar label="Debt Ratio"    value={debt_ratio}    color="red"   />
              <MetricBar label="Expense Ratio" value={expense_ratio} color="yellow"/>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {recommendations?.length > 0 && (
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target size={18} className="text-brand-400" />
            <h3 className="text-sm font-semibold text-slate-200">Recommendations</h3>
          </div>
          <ul className="space-y-2.5">
            {recommendations.map((rec, i) => (
              <li key={i} className="flex gap-3 text-sm text-slate-300">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {i + 1}
                </span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* AI Advice */}
{ai_advice && (
  <div className="card p-6 border-brand-500/20">
    <div className="flex items-center gap-2 mb-4">
      <div className="p-1.5 rounded-lg bg-brand-500/10">
        <Bot size={16} className="text-brand-400" />
      </div>

      <h3 className="text-sm font-semibold text-slate-200">
        AI Advice
      </h3>

      <span className="badge-green text-xs ml-auto">
        AI Generated
      </span>
    </div>

    <div className="text-sm text-slate-300 leading-relaxed space-y-2">
      {(
        typeof ai_advice === "string"
          ? ai_advice
          : ai_advice?.advice || "No advice available"
      )
        .split("\n")
        .filter(Boolean)
        .map((para, i) => (
          <p key={i}>{para}</p>
        ))}
    </div>
  </div>
)}
    </div>
  )
}
