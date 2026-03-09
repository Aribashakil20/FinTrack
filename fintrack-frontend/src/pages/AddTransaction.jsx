import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { transactionApi } from '../services/api'
import toast from 'react-hot-toast'
import { FiArrowLeft } from 'react-icons/fi'

const CATEGORIES = ['FOOD', 'TRANSPORT', 'SHOPPING', 'BILLS', 'SALARY', 'FREELANCE', 'INVESTMENT', 'OTHER']

const defaultForm = {
  type: 'EXPENSE',
  category: 'FOOD',
  amount: '',
  date: new Date().toISOString().split('T')[0],
  description: '',
}

export default function AddTransaction() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const [form, setForm] = useState(defaultForm)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isEdit) {
      transactionApi.getAll().then(({ data }) => {
        const tx = data.find((t) => String(t.id) === String(id))
        if (tx) {
          setForm({
            type: tx.type,
            category: tx.category,
            amount: String(tx.amount),
            date: tx.date,
            description: tx.description || '',
          })
        } else {
          toast.error('Transaction not found')
          navigate('/transactions')
        }
      })
    }
  }, [id, isEdit, navigate])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const payload = { ...form, amount: parseFloat(form.amount) }
    try {
      if (isEdit) {
        await transactionApi.update(id, payload)
        toast.success('Transaction updated!')
      } else {
        await transactionApi.create(payload)
        toast.success('Transaction added!')
      }
      navigate('/transactions')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      {/* Header */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <FiArrowLeft />
        Back
      </button>

      <div className="card shadow-md">
        <h1 className="text-xl font-bold text-gray-900 mb-6">
          {isEdit ? 'Edit Transaction' : 'Add Transaction'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Type Toggle */}
          <div>
            <label className="label">Type</label>
            <div className="flex rounded-lg overflow-hidden border border-gray-200">
              {['INCOME', 'EXPENSE'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm({ ...form, type: t })}
                  className={`flex-1 py-2 text-sm font-medium transition-colors ${
                    form.type === t
                      ? t === 'INCOME'
                        ? 'bg-green-500 text-white'
                        : 'bg-red-500 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {t.charAt(0) + t.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="label">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="input-field"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0) + cat.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>

          {/* Amount */}
          <div>
            <label className="label">Amount ($)</label>
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              min="0.01"
              step="0.01"
              className="input-field"
              placeholder="0.00"
              required
            />
          </div>

          {/* Date */}
          <div>
            <label className="label">Date</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="label">Description <span className="text-gray-400">(optional)</span></label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="input-field resize-none"
              placeholder="Add a note..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? 'Saving...' : isEdit ? 'Update Transaction' : 'Add Transaction'}
          </button>
        </form>
      </div>
    </div>
  )
}
