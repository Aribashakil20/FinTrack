'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { transactionApi } from '../../../lib/api'
import TransactionItem from '../../../components/TransactionItem'
import toast from 'react-hot-toast'
import { FiPlus, FiSearch } from 'react-icons/fi'

const TYPES = ['ALL', 'INCOME', 'EXPENSE']

export default function TransactionsPage() {
  const [all, setAll]         = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch]   = useState('')
  const [type, setType]       = useState('ALL')
  const [loading, setLoading] = useState(true)
  const [confirmId, setConfirmId] = useState(null)

  const load = () =>
    transactionApi.getAll()
      .then(r => { setAll(r.data); setFiltered(r.data) })
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false))

  useEffect(() => { load() }, [])

  useEffect(() => {
    let r = all
    if (type !== 'ALL') r = r.filter(t => t.type === type)
    if (search.trim()) {
      const q = search.toLowerCase()
      r = r.filter(t => t.category?.toLowerCase().includes(q) || (t.note || '').toLowerCase().includes(q))
    }
    setFiltered(r)
  }, [search, type, all])

  const handleDelete = async (id) => {
    if (confirmId !== id) { setConfirmId(id); return }
    try {
      await transactionApi.remove(id)
      toast.success('Deleted')
      setAll(prev => prev.filter(t => t.id !== id))
    } catch { toast.error('Delete failed') }
    finally { setConfirmId(null) }
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
    </div>
  )

  return (
    <div className="px-4 pt-6 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-bold">Transactions</h1>
        <Link href="/transactions/add" className="btn-primary py-2 px-3 text-xs">
          <FiPlus /> Add
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-3">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          className="input pl-9" placeholder="Search category or note..." />
      </div>

      {/* Type Filter */}
      <div className="flex gap-2 mb-4">
        {TYPES.map(t => (
          <button key={t} onClick={() => setType(t)}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-colors ${
              type === t ? 'bg-blue-600 text-white' : 'bg-white text-gray-500 border border-gray-200'
            }`}>
            {t.charAt(0) + t.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Count */}
      <p className="text-xs text-gray-400 mb-3">{filtered.length} record{filtered.length !== 1 ? 's' : ''}</p>

      {/* List */}
      {filtered.length === 0
        ? (
          <div className="card text-center py-12">
            <p className="text-gray-400 mb-2">No transactions found</p>
            <Link href="/transactions/add" className="text-sm text-blue-600 underline">Add one</Link>
          </div>
        )
        : (
          <div className="card p-0 divide-y divide-gray-50">
            {filtered.map(tx => (
              <div key={tx.id} className="px-4">
                <TransactionItem
                  tx={tx}
                  onEdit={() => window.location.href = `/transactions/add?edit=${tx.id}`}
                  onDelete={() => handleDelete(tx.id)}
                />
                {confirmId === tx.id && (
                  <div className="pb-2 flex gap-3 justify-end">
                    <button onClick={() => handleDelete(tx.id)} className="text-xs text-red-600 font-semibold">Confirm delete?</button>
                    <button onClick={() => setConfirmId(null)} className="text-xs text-gray-400">Cancel</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
    </div>
  )
}
