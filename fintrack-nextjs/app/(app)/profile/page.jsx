'use client'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../context/AuthContext'
import toast from 'react-hot-toast'
import { FiUser, FiMail, FiLogOut, FiCalendar, FiShield, FiTrendingUp } from 'react-icons/fi'

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    toast.success('Logged out')
    router.push('/login')
  }

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'

  return (
    <div className="px-4 pt-6 pb-4 space-y-5">
      <h1 className="text-xl font-bold">Profile</h1>

      {/* Avatar Card */}
      <div className="card flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
          {initials}
        </div>
        <div>
          <p className="text-lg font-semibold text-gray-900">{user?.name}</p>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>
      </div>

      {/* Info */}
      <div className="card space-y-4">
        <h2 className="text-sm font-semibold text-gray-700">Account Details</h2>
        {[
          { icon: FiUser,     label: 'Full Name',  value: user?.name },
          { icon: FiMail,     label: 'Email',      value: user?.email },
          { icon: FiShield,   label: 'Auth',       value: 'JWT + BCrypt' },
          { icon: FiTrendingUp, label: 'Platform', value: 'FinTrack v2.0' },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center">
              <Icon className="text-gray-500 text-sm" />
            </div>
            <div>
              <p className="text-xs text-gray-400">{label}</p>
              <p className="text-sm font-medium text-gray-800">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* About */}
      <div className="card bg-blue-50 border-blue-100">
        <p className="text-xs font-semibold text-blue-700 mb-1">About FinTrack</p>
        <p className="text-xs text-blue-600 leading-relaxed">
          A personal finance tracker for students, families, and individuals.
          Track income, expenses, set budgets, and get insights — all in one place.
        </p>
      </div>

      {/* Logout */}
      <button onClick={handleLogout} className="btn-danger w-full">
        <FiLogOut /> Sign Out
      </button>
    </div>
  )
}
