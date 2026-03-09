'use client'
import { useEffect, useState } from 'react'
import { budgetApi } from '../../../lib/api'
import BudgetBar from '../../../components/BudgetBar'
import toast from 'react-hot-toast'
import { FiPlus } from 'react-icons/fi'

const CATEGORIES = ['FOOD','TRANSPORT','BILLS','SHOPPING','RENT','ENTERTAINMENT','HEALTH','EDUCATION','OTHER']

export default function BudgetPage() {
  const now = new Date()
  const [budgets, setBudgets] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ category: 'FOOD', limitAmount: '', month: now.getMonth() + 1, year: now.getFullYear() })

  const load = () =>
    budgetApi.get(now.getMonth() + 1, now.getFullYear())
      .then(r => setBudgets(r.data))
      .catch(() => toast.error('Failed to load budgets'))
      .finally(() => setLoading(false))

  useEffect(() => { load() }, [])

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      await budgetApi.save({ ...form, limitAmount: parseFloat(form.limitAmount) })
      toast.success('Budget saved!')
      setShowForm(false)
      load()
    } catch { toast.error('Failed to save budget') }
  }

  const handleDelete = async (id) => {
    try {
      await budgetApi.remove(id)
      toast.success('Budget removed')
      setBudgets(prev => prev.filter(b => b.id !== id))
    } catch { toast.error('Failed to delete') }
  }

  const exceeded = budgets.filter(b => b.exceeded)
  const monthName = new Date(form.year, form.month - 1).toLocaleString('default', { month: 'long' })

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
    </div>
  )

  return (
    <div className="px-4 pt-6 pb-4 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Budget</h1>
          <p className="text-sm text-gray-500">{monthName} {now.getFullYear()}</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary py-2 px-3 text-xs">
          <FiPlus /> Set Budget
        </button>
      </div>

      {/* Alerts */}
      {exceeded.length > 0 && (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
          <p className="text-sm font-semibold text-red-700 mb-1">⚠️ Budget Exceeded</p>
          {exceeded.map(b => (
            <p key={b.id} className="text-xs text-red-600">
              {b.category.charAt(0) + b.category.slice(1).toLowerCase()} — over by ₹{Math.abs(parseFloat(b.remaining)).toLocaleString('en-IN')}
            </p>
          ))}
        </div>
      )}

      {/* Add Budget Form */}
      {showForm && (
        <div className="card">
          <h3 className="text-sm font-semibold mb-4">Set Monthly Budget</h3>
          <form onSubmit={handleSave} className="space-y-3">
            <div>
              <label className="label">Category</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="input">
                {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0) + c.slice(1).toLowerCase()}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Monthly Limit (₹)</label>
              <input type="number" min="1" value={form.limitAmount}
                onChange={e => setForm(f => ({ ...f, limitAmount: e.target.value }))}
                className="input" placeholder="e.g. 5000" required />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="btn-primary flex-1">Save</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-ghost flex-1">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Budget List */}
      {budgets.length === 0
        ? (
          <div className="card text-center py-12">
            <p className="text-4xl mb-3">🎯</p>
            <p className="text-gray-600 font-medium mb-1">No budgets set yet</p>
            <p className="text-sm text-gray-400">Set limits to track your spending</p>
          </div>
        )
        : (
          <div className="card">
            <h2 className="text-sm font-semibold text-gray-700 mb-2">{budgets.length} budget{budgets.length > 1 ? 's' : ''} this month</h2>
            {budgets.map(b => (
              <BudgetBar key={b.id} budget={b} onDelete={handleDelete} />
            ))}
          </div>
        )}
    </div>
  )
}
