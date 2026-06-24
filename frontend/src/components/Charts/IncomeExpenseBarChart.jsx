import React from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer
} from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-surface-card border border-surface-border rounded-xl px-3 py-2 text-sm shadow-xl">
      <p className="text-slate-400 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.fill }} className="font-mono font-semibold">
          {p.name}: ₹{p.value?.toLocaleString('en-IN')}
        </p>
      ))}
    </div>
  )
}

export default function IncomeExpenseBarChart({ data }) {
  if (!data?.length) return (
    <div className="flex items-center justify-center h-64 text-slate-500 text-sm">
      No data available
    </div>
  )

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} barCategoryGap="30%" barGap={4}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1f2637" vertical={false} />
        <XAxis dataKey="label" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis
          tick={{ fill: '#64748b', fontSize: 11 }}
          axisLine={false} tickLine={false}
          tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#1f2637' }} />
        <Legend formatter={v => <span className="text-slate-400 text-xs">{v}</span>} />
        <Bar dataKey="income"   name="Income"   fill="#25a26e" radius={[6, 6, 0, 0]} animationDuration={800} />
        <Bar dataKey="expenses" name="Expenses" fill="#ef4444" radius={[6, 6, 0, 0]} animationDuration={800} />
      </BarChart>
    </ResponsiveContainer>
  )
}
