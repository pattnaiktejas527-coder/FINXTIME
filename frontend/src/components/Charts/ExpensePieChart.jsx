import React from 'react'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const COLORS = ['#25a26e', '#ef4444', '#3b82f6', '#eab308', '#a855f7', '#f97316']

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-surface-card border border-surface-border rounded-xl px-3 py-2 text-sm shadow-xl">
      <p className="text-slate-300">{payload[0].name}</p>
      <p className="font-mono font-semibold text-slate-100">
        ₹{payload[0].value?.toLocaleString('en-IN')}
      </p>
      <p className="text-slate-500">{payload[0].payload.percent?.toFixed(1)}%</p>
    </div>
  )
}

export default function ExpensePieChart({ data }) {
  if (!data?.length) return (
    <div className="flex items-center justify-center h-64 text-slate-500 text-sm">
      No expense data available
    </div>
  )

  const total = data.reduce((s, d) => s + d.value, 0)
  const enriched = data.map(d => ({ ...d, percent: (d.value / total) * 100 }))

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={enriched}
          cx="50%" cy="50%"
          innerRadius={65} outerRadius={100}
          paddingAngle={3}
          dataKey="value"
          animationBegin={0}
          animationDuration={800}
        >
          {enriched.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="transparent" />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          formatter={(value) => <span className="text-slate-400 text-xs">{value}</span>}
          iconSize={10}
          iconType="circle"
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
