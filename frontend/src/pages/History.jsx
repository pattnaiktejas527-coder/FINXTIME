import React, { useEffect, useState, useMemo } from 'react'
import {
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  History as HistoryIcon,
  AlertCircle,
  FileText
} from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import { getHistory } from '../services/api'

const fmtCurrency = (v) =>
  v != null ? `₹${Number(v).toLocaleString('en-IN')}` : '—'

const fmtDate = (v) => {
  if (!v) return '—'
  try { return new Date(v).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) }
  catch { return v }
}

function ScorePill({ score }) {
  const s = Number(score)
  if (isNaN(s)) return <span className="text-slate-500">—</span>
  const cls = s >= 70 ? 'badge-green' : s >= 40 ? 'badge-yellow' : 'badge-red'
  return <span className={cls}>{s}</span>
}

const COLS = [
  { key: 'created_at', label: 'Date',    sortable: true  },
  { key: 'income',    label: 'Income',  sortable: false },
  { key: 'expenses',  label: 'Expenses',sortable: false },
  { key: 'savings',   label: 'Savings', sortable: false },
  { key: 'debt',      label: 'Debt',    sortable: false },
  { key: 'financial_score', label: 'Score', sortable: true },
  { key: 'status',    label: 'Status',  sortable: false },
]

export default function History() {
  const [data, setData]       = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')
  const [search, setSearch]   = useState('')
  const [sort, setSort] = useState({ key: 'financial_score', dir: 'desc' })
  const [page, setPage]       = useState(1)
  const PER_PAGE = 10

  useEffect(() => {
    getHistory()
      .then(res => {
        const items = Array.isArray(res.data) ? res.data : (res.data?.history ?? [])
        setData(items)
      })
      .catch(err => setError(err.message || 'Failed to load history.'))
      .finally(() => setLoading(false))
  }, [])

  const toggleSort = (key) => {
    setSort(prev => ({
      key,
      dir: prev.key === key && prev.dir === 'asc' ? 'desc' : 'asc'
    }))
    setPage(1)
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return data.filter(row =>
      !q ||
      String(row.status ?? '').toLowerCase().includes(q) ||
      String(row.financial_score ?? '').includes(q) ||
      fmtDate(row.created_at).toLowerCase().includes(q)
    )
  }, [data, search])

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let av = a[sort.key], bv = b[sort.key]
      if (sort.key === 'timestamp') { av = new Date(av); bv = new Date(bv) }
      else { av = Number(av); bv = Number(bv) }
      return sort.dir === 'asc' ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1)
    })
  }, [filtered, sort])

  const totalPages = Math.ceil(sorted.length / PER_PAGE)
  const paginated  = sorted.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const SortIcon = ({ col }) => {
    if (!col.sortable) return null
    if (sort.key !== col.key) return <ArrowUpDown size={13} className="text-slate-600" />
    return sort.dir === 'asc'
      ? <ArrowUp size={13} className="text-brand-400" />
      : <ArrowDown size={13} className="text-brand-400" />
  }

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header + search */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <HistoryIcon size={18} className="text-brand-400" />
          <span className="text-sm font-semibold text-slate-300">
            {data.length} {data.length === 1 ? 'record' : 'records'}
          </span>
        </div>
        <div className="relative w-full sm:w-64">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by status or score…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            className="input pl-9 py-2 text-sm"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><LoadingSpinner size="lg" text="Loading history…" /></div>
      ) : error ? (
        <div className="card p-6 flex items-center gap-3 border-red-500/20">
          <AlertCircle size={18} className="text-red-400" />
          <p className="text-sm text-red-400">{error}</p>
        </div>
      ) : sorted.length === 0 ? (
        <div className="card p-16 text-center">
          <FileText size={36} className="text-slate-700 mx-auto mb-4" />
          <h3 className="text-base font-semibold text-slate-400 mb-1">
            {search ? 'No results found' : 'No history yet'}
          </h3>
          <p className="text-sm text-slate-600">
            {search ? 'Try a different search term.' : 'Run your first analysis on the AI Coach page.'}
          </p>
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-surface-border">
                    {COLS.map(col => (
                      <th
                        key={col.key}
                        onClick={() => col.sortable && toggleSort(col.key)}
                        className={`px-4 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider
                          ${col.sortable ? 'cursor-pointer hover:text-slate-300 select-none' : ''}`}
                      >
                        <div className="flex items-center gap-1.5">
                          {col.label}
                          <SortIcon col={col} />
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  {paginated.map((row, i) => (
                    <tr key={i} className="hover:bg-surface-muted/40 transition-colors duration-150">
                      <td className="px-4 py-3.5 text-slate-400 font-mono text-xs whitespace-nowrap">
                        {fmtDate(row.created_at || row.timestamp || row.date)}
                      </td>
                      <td className="px-4 py-3.5 font-mono text-slate-300">{fmtCurrency(row.income)}</td>
                      <td className="px-4 py-3.5 font-mono text-red-400">{fmtCurrency(row.expenses)}</td>
                      <td className="px-4 py-3.5 font-mono text-blue-400">{fmtCurrency(row.savings)}</td>
                      <td className="px-4 py-3.5 font-mono text-yellow-400">{fmtCurrency(row.debt)}</td>
                      <td className="px-4 py-3.5"><ScorePill score={row.financial_score} /></td>
                      <td className="px-4 py-3.5 text-slate-400">{row.status ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between text-sm">
              <p className="text-slate-500">
                Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, sorted.length)} of {sorted.length}
              </p>
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded-lg text-xs font-medium transition-all
                      ${p === page ? 'bg-brand-500 text-white' : 'btn-ghost'}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
