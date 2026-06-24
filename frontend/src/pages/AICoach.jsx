import React, { useState } from 'react'
import { BrainCircuit, AlertCircle } from 'lucide-react'
import FinanceForm from '../components/FinanceForm'
import AIResponse from '../components/AIResponse'
import { getAIAdvice } from '../services/api'

export default function AICoach() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (data) => {
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await getAIAdvice(data)
      setResult(res.data)
    } catch (err) {
      setError(err.message || 'Analysis failed. Check that your backend is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="p-2.5 rounded-xl bg-brand-500/10 border border-brand-500/20">
          <BrainCircuit size={22} className="text-brand-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-100">AI Finance Coach</h2>
          <p className="text-sm text-slate-500">
            Get a personalized financial health report powered by AI.
          </p>
        </div>
      </div>

      {/* Form */}
      <FinanceForm onSubmit={handleSubmit} loading={loading} />

      {/* Error */}
      {error && (
        <div className="card p-4 border-red-500/30 flex items-start gap-3">
          <AlertCircle size={18} className="text-red-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* AI Result */}
      {result && <AIResponse data={result} />}
    </div>
  )
}
