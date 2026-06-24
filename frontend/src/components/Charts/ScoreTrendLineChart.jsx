import React from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Area, AreaChart
} from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  const score = payload[0].value
  const color = score >= 70 ? '#25a26e' : score >= 40 ? '#eab308' : '#ef4444'
  return (
    <div className="bg-surface-card border border-surface-border rounded-xl px-3 py-2 text-sm shadow-xl">
      <p className="text-slate-400 mb-1">{label}</p>
      <p className="font-mono font-semibold" style={{ color }}>Score: {score}</p>
    </div>
  )
}

export default function ScoreTrendLineChart({ data }) {
  if (!data?.length) return (
    <div className="flex items-center justify-center h-64 text-slate-500 text-sm">
      No score history available
    </div>
  )

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#25a26e" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#25a26e" stopOpacity={0}    />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1f2637" vertical={false} />
        <XAxis dataKey="label" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine y={70} stroke="#25a26e" strokeDasharray="4 4" strokeOpacity={0.4} />
        <ReferenceLine y={40} stroke="#eab308" strokeDasharray="4 4" strokeOpacity={0.4} />
        <Area
          type="monotone" dataKey="score"
          stroke="#25a26e" strokeWidth={2.5}
          fill="url(#scoreGrad)"
          dot={{ fill: '#25a26e', r: 4, strokeWidth: 0 }}
          activeDot={{ r: 6, strokeWidth: 0 }}
          animationDuration={1000}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
