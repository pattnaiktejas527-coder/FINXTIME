import React from 'react'
import { NavLink } from 'react-router-dom'

import {
  LayoutDashboard,
  BrainCircuit,
  History as HistoryIcon,
  BarChart3,
  Zap,
  X
} from 'lucide-react'

const nav = [
  {
    to: '/',
    label: 'Dashboard',
    icon: LayoutDashboard
  },
  {
    to: '/ai-coach',
    label: 'AI Coach',
    icon: BrainCircuit
  },
  {
    to: '/history',
    label: 'History',
    icon: HistoryIcon
  },
  {
    to: '/analytics',
    label: 'Analytics',
    icon: BarChart3
  }
]

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-surface-card border-r border-surface-border
          z-40 flex flex-col transition-transform duration-300
          ${open ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-surface-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
              <Zap size={16} className="text-white" fill="white" />
            </div>
            <div>
              <span className="text-base font-bold text-slate-100 tracking-wide">FINX</span>
              <span className="text-base font-bold text-brand-400 tracking-wide">TIME</span>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden btn-ghost p-1.5 rounded-lg">
            <X size={18} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider px-3 mb-3">
            Menu
          </p>
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                ${isActive
                  ? 'bg-brand-500/15 text-brand-400 border border-brand-500/25'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-surface-muted'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={18} className={isActive ? 'text-brand-400' : ''} />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-surface-border">
          <p className="text-xs text-slate-600">AI-powered financial insights</p>
          <p className="text-xs text-slate-700 mt-0.5">v1.0.0</p>
        </div>
      </aside>
    </>
  )
}
