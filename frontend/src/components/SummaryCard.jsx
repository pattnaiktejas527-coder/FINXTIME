import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

export default function SummaryCard({ title, value, icon: Icon, color, trend, trendLabel, prefix = '₹' }) {
  const colorMap = {
    green:  { bg: 'bg-brand-500/10',  icon: 'text-brand-400',  border: 'border-brand-500/20' },
    red:    { bg: 'bg-red-500/10',    icon: 'text-red-400',    border: 'border-red-500/20'   },
    blue:   { bg: 'bg-blue-500/10',   icon: 'text-blue-400',   border: 'border-blue-500/20'  },
    yellow: { bg: 'bg-yellow-500/10', icon: 'text-yellow-400', border: 'border-yellow-500/20'},
    purple: { bg: 'bg-purple-500/10', icon: 'text-purple-400', border: 'border-purple-500/20'},
  }
  const c = colorMap[color] || colorMap.green

  const formatValue = (v) => {
    if (v === undefined || v === null) return '—'
    if (typeof v === 'number') {
      if (prefix === '₹') return `₹${v.toLocaleString('en-IN')}`
      return `${v}${prefix}`
    }
    return v
  }

  return (
    <div className={`card border ${c.border} p-5 flex flex-col gap-4 animate-slide-up hover:border-opacity-60 transition-all duration-300`}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-400">{title}</p>
        <div className={`p-2 rounded-lg ${c.bg}`}>
          <Icon size={18} className={c.icon} />
        </div>
      </div>

      <div>
        <p className="text-2xl font-bold text-slate-100 font-mono tracking-tight">
          {formatValue(value)}
        </p>
        {trend !== undefined && (
          <div className="flex items-center gap-1 mt-1">
            {trend >= 0
              ? <TrendingUp size={13} className="text-brand-400" />
              : <TrendingDown size={13} className="text-red-400" />}
            <span className={`text-xs ${trend >= 0 ? 'text-brand-400' : 'text-red-400'}`}>
              {Math.abs(trend)}% {trendLabel || ''}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
