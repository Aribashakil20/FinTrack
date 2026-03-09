'use client'
import { useEffect, useState } from 'react'
import { useAuth } from '../../../context/AuthContext'
import { dashboardApi } from '../../../lib/api'
import StatCard from '../../../components/StatCard'
import SpendingPieChart from '../../../components/SpendingPieChart'
import MonthlyBarChart from '../../../components/MonthlyBarChart'
import TransactionItem from '../../../components/TransactionItem'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiZap, FiArrowRight } from 'react-icons/fi'

export default function DashboardPage() {
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dashboardApi.summary()
      .then(r => setData(r.data))
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
    </div>
  )

  const now = new Date()
  const monthName = now.toLocaleString('default', { month: 'long' })

  return (
    <div className="px-4 pt-6 pb-4 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Good {getGreeting()},</p>
          <h1 className="text-xl font-bold text-gray-900">{user?.name?.split(' ')[0]} 👋</h1>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">{monthName} {now.getFullYear()}</p>
          <p className="text-sm font-semibold text-blue-600">Monthly Overview</p>
        </div>
      </div>

      {/* Balance Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-5 text-white shadow-lg">
        <p className="text-sm text-blue-100">Total Balance</p>
        <p className="text-3xl font-bold mt-1">
          ₹{parseFloat(data?.totalBalance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </p>
        <div className="flex gap-4 mt-3">
          <div>
            <p className="text-xs text-blue-200">This month income</p>
            <p className="text-sm font-semibold">₹{parseFloat(data?.monthlyIncome || 0).toLocaleString('en-IN')}</p>
          </div>
          <div>
            <p className="text-xs text-blue-200">This month expense</p>
            <p className="text-sm font-semibold">₹{parseFloat(data?.monthlyExpense || 0).toLocaleString('en-IN')}</p>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard title="Income" amount={data?.monthlyIncome}  icon={FiTrendingUp}   color="green" />
        <StatCard title="Expense" amount={data?.monthlyExpense} icon={FiTrendingDown} color="red"   />
        <StatCard title="Savings" amount={data?.monthlySavings} icon={FiDollarSign}   color="blue"  />
      </div>

      {/* Insights */}
      {data?.insights?.length > 0 && (
        <div className="card bg-amber-50 border-amber-100 space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <FiZap className="text-amber-500" />
            <span className="text-sm font-semibold text-amber-700">Insights</span>
          </div>
          {data.insights.map((ins, i) => (
            <p key={i} className="text-xs text-amber-700 leading-relaxed">• {ins}</p>
          ))}
        </div>
      )}

      {/* Pie Chart */}
      <div className="card">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Spending by Category</h2>
        <SpendingPieChart data={data?.categoryBreakdown} />
      </div>

      {/* Bar Chart */}
      <div className="card">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Monthly Overview ({now.getFullYear()})</h2>
        <MonthlyBarChart monthlyData={data?.monthlyChart} />
      </div>

      {/* Recent Transactions */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-700">Recent Transactions</h2>
          <Link href="/transactions" className="text-xs text-blue-600 flex items-center gap-0.5 hover:underline">
            View all <FiArrowRight className="text-xs" />
          </Link>
        </div>
        {data?.recentTransactions?.length === 0
          ? <p className="text-xs text-gray-400 text-center py-4">No transactions yet. <Link href="/transactions/add" className="text-blue-600 underline">Add one</Link></p>
          : data?.recentTransactions?.map(tx => <TransactionItem key={tx.id} tx={tx} />)
        }
      </div>
    </div>
  )
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}
