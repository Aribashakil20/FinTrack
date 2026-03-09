import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { summaryApi, transactionApi } from '../services/api'
import CategoryChart from '../components/CategoryChart'
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiPlus, FiArrowUpRight, FiArrowDownRight } from 'react-icons/fi'
import toast from 'react-hot-toast'

function StatCard({ title, amount, icon: Icon, colorClass, bgClass }) {
  return (
    <div className="card flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bgClass}`}>
        <Icon className={`text-xl ${colorClass}`} />
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className={`text-2xl font-bold ${colorClass}`}>
          ${parseFloat(amount || 0).toFixed(2)}
        </p>
      </div>
    </div>
  )
}

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

export default function Dashboard() {
  const [summary, setSummary] = useState(null)
  const [recentTx, setRecentTx] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, txRes] = await Promise.all([
          summaryApi.get(),
          transactionApi.getAll(),
        ])
        setSummary(summaryRes.data)
        setRecentTx(txRes.data.slice(0, 5))
      } catch {
        toast.error('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Your financial overview</p>
        </div>
        <Link to="/transactions/add" className="btn-primary flex items-center gap-2">
          <FiPlus />
          Add Transaction
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard
          title="Total Income"
          amount={summary?.totalIncome}
          icon={FiTrendingUp}
          colorClass="text-green-600"
          bgClass="bg-green-50"
        />
        <StatCard
          title="Total Expense"
          amount={summary?.totalExpense}
          icon={FiTrendingDown}
          colorClass="text-red-500"
          bgClass="bg-red-50"
        />
        <StatCard
          title="Balance"
          amount={summary?.balance}
          icon={FiDollarSign}
          colorClass={parseFloat(summary?.balance || 0) >= 0 ? 'text-blue-600' : 'text-red-600'}
          bgClass="bg-blue-50"
        />
      </div>

      {/* Chart + Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Doughnut Chart */}
        <div className="card">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Expense by Category</h2>
          <CategoryChart categoryBreakdown={summary?.categoryBreakdown} />
        </div>

        {/* Recent Transactions */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-800">Recent Transactions</h2>
            <Link to="/transactions" className="text-sm text-blue-600 hover:underline">
              View all
            </Link>
          </div>

          {recentTx.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">
              No transactions yet.{' '}
              <Link to="/transactions/add" className="text-blue-600 hover:underline">
                Add one
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTx.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium ${CATEGORY_COLORS[tx.category] || 'bg-gray-100 text-gray-700'}`}>
                      {tx.category.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {tx.category.charAt(0) + tx.category.slice(1).toLowerCase()}
                      </p>
                      <p className="text-xs text-gray-400">{tx.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {tx.type === 'INCOME'
                      ? <FiArrowUpRight className="text-green-500" />
                      : <FiArrowDownRight className="text-red-500" />}
                    <span className={`text-sm font-semibold ${tx.type === 'INCOME' ? 'text-green-600' : 'text-red-500'}`}>
                      {tx.type === 'INCOME' ? '+' : '-'}${parseFloat(tx.amount).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
