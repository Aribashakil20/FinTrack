import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { transactionApi } from '../services/api'
import toast from 'react-hot-toast'
import { FiPlus, FiEdit2, FiTrash2, FiArrowUpRight, FiArrowDownRight, FiSearch } from 'react-icons/fi'

const CATEGORY_COLORS = {
  FOOD: 'bg-orange-100 text-orange-700',
  TRANSPORT: 'bg-blue-100 text-blue-700',
  SHOPPING: 'bg-purple-100 text-purple-700',
  BILLS: 'bg-red-100 text-red-700',
  SALARY: 'bg-green-100 text-green-700',
  FREELANCE: 'bg-cyan-100 text-cyan-700',
  INVESTMENT: 'bg-yellow-100 text-yellow-700',
  OTHER: 'bg-gray-100 text-gray-700',
}

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('ALL')
  const [deleteId, setDeleteId] = useState(null)

  const fetchTransactions = async () => {
    try {
      const { data } = await transactionApi.getAll()
      setTransactions(data)
      setFiltered(data)
    } catch {
      toast.error('Failed to load transactions')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchTransactions() }, [])

  useEffect(() => {
    let result = transactions
    if (typeFilter !== 'ALL') result = result.filter((t) => t.type === typeFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (t) =>
          t.category.toLowerCase().includes(q) ||
          (t.description || '').toLowerCase().includes(q)
      )
    }
    setFiltered(result)
  }, [search, typeFilter, transactions])

  const handleDelete = async (id) => {
    try {
      await transactionApi.delete(id)
      toast.success('Transaction deleted')
      setTransactions((prev) => prev.filter((t) => t.id !== id))
    } catch {
      toast.error('Failed to delete transaction')
    } finally {
      setDeleteId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="text-sm text-gray-500 mt-1">{filtered.length} records</p>
        </div>
        <Link to="/transactions/add" className="btn-primary flex items-center gap-2">
          <FiPlus />
          Add
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by category or description..."
            className="input-field pl-9"
          />
        </div>
        <div className="flex rounded-lg overflow-hidden border border-gray-200 bg-white">
          {['ALL', 'INCOME', 'EXPENSE'].map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                typeFilter === t
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {t.charAt(0) + t.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="card text-center py-16 text-gray-400">
          <p className="text-lg mb-2">No transactions found</p>
          <Link to="/transactions/add" className="text-blue-600 hover:underline text-sm">
            Add your first transaction
          </Link>
        </div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Type</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Category</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Description</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Date</th>
                  <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Amount</th>
                  <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        {tx.type === 'INCOME'
                          ? <FiArrowUpRight className="text-green-500" />
                          : <FiArrowDownRight className="text-red-500" />}
                        <span className={`text-xs font-medium ${tx.type === 'INCOME' ? 'text-green-600' : 'text-red-500'}`}>
                          {tx.type.charAt(0) + tx.type.slice(1).toLowerCase()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 rounded-md text-xs font-medium ${CATEGORY_COLORS[tx.category] || 'bg-gray-100 text-gray-700'}`}>
                        {tx.category.charAt(0) + tx.category.slice(1).toLowerCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-[200px] truncate">
                      {tx.description || <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{tx.date}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`text-sm font-semibold ${tx.type === 'INCOME' ? 'text-green-600' : 'text-red-500'}`}>
                        {tx.type === 'INCOME' ? '+' : '-'}${parseFloat(tx.amount).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          to={`/transactions/edit/${tx.id}`}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <FiEdit2 size={14} />
                        </Link>
                        {deleteId === tx.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDelete(tx.id)}
                              className="text-xs text-red-600 font-medium hover:underline"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setDeleteId(null)}
                              className="text-xs text-gray-500 font-medium hover:underline"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteId(tx.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <FiTrash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
