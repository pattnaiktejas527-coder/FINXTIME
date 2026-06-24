import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Menu, Bell, Wifi, WifiOff } from 'lucide-react'
import { checkHealth } from '../services/api'

const titles = {
  '/':          'Dashboard',
  '/ai-coach':  'AI Finance Coach',
  '/history':   'Analysis History',
  '/analytics': 'Analytics',
}

export default function Navbar({ onMenuClick }) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [online, setOnline] = useState(null)

  useEffect(() => {
    let cancelled = false
    const ping = async () => {
      try {
        await checkHealth()
        if (!cancelled) setOnline(true)
      } catch {
        if (!cancelled) setOnline(false)
      }
    }
    ping()
    const id = setInterval(ping, 30000)
    return () => { cancelled = true; clearInterval(id) }
  }, [])

  const handleLogout = () => {
  localStorage.removeItem("token")
  navigate("/login")
}

  const title = titles[pathname] || 'FINXTIME'

  return (
    <header className="sticky top-0 z-20 bg-surface/80 backdrop-blur-md border-b border-surface-border px-4 lg:px-6 h-16 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden btn-ghost p-2 rounded-lg"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-lg font-semibold text-slate-100">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        {/* Backend status */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-muted text-xs font-medium">
          {online === null ? (
            <span className="w-2 h-2 rounded-full bg-slate-500 animate-pulse" />
          ) : online ? (
            <>
              <Wifi size={12} className="text-brand-400" />
              <span className="text-brand-400">API Online</span>
            </>
          ) : (
            <>
              <WifiOff size={12} className="text-red-400" />
              <span className="text-red-400">API Offline</span>
            </>
          )}
        </div>

        
        <button
  onClick={handleLogout}
  className="px-3 py-2 text-sm rounded-lg bg-red-500/20 text-red-400"
>
  Logout
</button>

      
      </div>
    </header>
  )
}
