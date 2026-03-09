'use client'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { transactionApi } from '../../../../lib/api'
import toast from 'react-hot-toast'
import { FiArrowLeft } from 'react-icons/fi'

const DEFAULT_CATEGORIES = [
  'FOOD','TRANSPORT','BILLS','SHOPPING','RENT',
  'ENTERTAINMENT','HEALTH','EDUCATION','SALARY','FREELANCE','INVESTMENT','OTHER'
]

const CAT_EMOJI = {
  FOOD:'🍔', TRANSPORT:'🚌', BILLS:'💡', SHOPPING:'🛍️', RENT:'🏠',
  ENTERTAINMENT:'🎬', HEALTH:'❤️', EDUCATION:'📚', SALARY:'💰',
  FREELANCE:'💻', INVESTMENT:'📈', OTHER:'📌',
}

const empty = {
  type: 'EXPENSE', category: 'FOOD', amount: '', note: '',
  date: new Date().toISOString().split('T')[0],
}

export default function AddTransactionPage() {
  const router = useRouter()
  const params = useSearchParams()
  const editId = params.get('edit')
  const [form, setForm] = useState(empty)
  const [loading, setLoading] = useState(false)
  const [customCat, setCustomCat] = useState('')
  const [showCustom, setShowCustom] = useState(false)

  useEffect(() => {
    if (editId) {
      transactionApi.getAll().then(({ data }) => {
        const tx = data.find(t => String(t.id) === editId)
        if (tx) setForm({ type: tx.type, category: tx.category, amount: String(tx.amount), note: tx.note || '', date: tx.date })
      })
    }
  }, [editId])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const cat = showCustom && customCat.trim() ? customCat.trim().toUpperCase() : form.category
    setLoading(true)
    try {
      const payload = { ...form, category: cat, amount: parseFloat(form.amount) }
      if (editId) { await transactionApi.update(editId, payload); toast.success('Updated!') }
      else        { await transactionApi.create(payload);          toast.success('Added!') }
      router.push('/transactions')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save')
    } finally { setLoading(false) }
  }

  return (
    <div className="px-4 pt-6 pb-4">
      <button onClick={() => router.back()} className="flex items-center gap-1 text-sm text-gray-500 mb-5">
        <FiArrowLeft /> Back
      </button>

      <h1 className="text-xl font-bold mb-5">{editId ? 'Edit' : 'Add'} Transaction</h1>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Type Toggle */}
        <div className="flex rounded-2xl overflow-hidden border border-gray-200 bg-white">
          {['EXPENSE', 'INCOME'].map(t => (
            <button type="button" key={t} onClick={() => set('type', t)}
              className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                form.type === t
                  ? t === 'INCOME' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                  : 'text-gray-500'
              }`}>
              {t === 'INCOME' ? '💰 Income' : '💸 Expense'}
            </button>
          ))}
        </div>

        {/* Amount */}
        <div>
          <label className="label">Amount (₹)</label>
          <input type="number" min="0.01" step="0.01" value={form.amount}
            onChange={e => set('amount', e.target.value)}
            className="input text-xl font-semibold" placeholder="0.00" required />
        </div>

        {/* Category Grid */}
        <div>
          <label className="label">Category</label>
          <div className="grid grid-cols-4 gap-2">
            {DEFAULT_CATEGORIES.map(cat => (
              <button type="button" key={cat} onClick={() => { set('category', cat); setShowCustom(false) }}
                className={`flex flex-col items-center p-2 rounded-xl border text-xs font-medium transition-all ${
                  form.category === cat && !showCustom
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-100 bg-white text-gray-600 hover:border-gray-300'
                }`}>
                <span className="text-xl">{CAT_EMOJI[cat]}</span>
                <span className="mt-0.5 text-center leading-tight">
                  {cat.charAt(0) + cat.slice(1).toLowerCase()}
                </span>
              </button>
            ))}
            <button type="button" onClick={() => setShowCustom(true)}
              className={`flex flex-col items-center p-2 rounded-xl border text-xs font-medium transition-all ${
                showCustom ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-dashed border-gray-300 text-gray-400'
              }`}>
              <span className="text-xl">✏️</span>
              <span className="mt-0.5">Custom</span>
            </button>
          </div>
          {showCustom && (
            <input type="text" value={customCat} onChange={e => setCustomCat(e.target.value)}
              className="input mt-2" placeholder="Enter custom category..." />
          )}
        </div>

        {/* Date */}
        <div>
          <label className="label">Date</label>
          <input type="date" value={form.date} onChange={e => set('date', e.target.value)}
            className="input" required />
        </div>

        {/* Note */}
        <div>
          <label className="label">Note <span className="text-gray-400 font-normal">(optional)</span></label>
          <textarea value={form.note} onChange={e => set('note', e.target.value)}
            className="input resize-none" rows={2} placeholder="What was this for?" />
        </div>

        <button type="submit" disabled={loading}
          className={`w-full py-4 rounded-2xl text-white text-base font-bold transition-all active:scale-95 ${
            form.type === 'INCOME' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-red-500 hover:bg-red-600'
          } disabled:opacity-50`}>
          {loading ? 'Saving...' : editId ? 'Update Transaction' : `Add ${form.type === 'INCOME' ? 'Income' : 'Expense'}`}
        </button>
      </form>
    </div>
  )
}
