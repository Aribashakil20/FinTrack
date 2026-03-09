'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FiHome, FiList, FiPlusCircle, FiPieChart, FiUser } from 'react-icons/fi'

const NAV = [
  { href: '/dashboard',    icon: FiHome,       label: 'Home'    },
  { href: '/transactions', icon: FiList,       label: 'History' },
  { href: '/transactions/add', icon: FiPlusCircle, label: 'Add', primary: true },
  { href: '/budget',       icon: FiPieChart,   label: 'Budget'  },
  { href: '/profile',      icon: FiUser,       label: 'Profile' },
]

export default function BottomNav() {
  const path = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-lg"
         style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="flex items-center justify-around max-w-lg mx-auto h-16">
        {NAV.map(({ href, icon: Icon, label, primary }) => {
          const active = path === href || (href !== '/dashboard' && path.startsWith(href))
          if (primary) {
            return (
              <Link key={href} href={href}
                className="flex flex-col items-center -mt-5">
                <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 active:scale-95 transition-transform">
                  <Icon className="text-white text-2xl" />
                </div>
                <span className="text-xs text-blue-600 font-medium mt-0.5">{label}</span>
              </Link>
            )
          }
          return (
            <Link key={href} href={href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-colors ${
                active ? 'text-blue-600' : 'text-gray-400'
              }`}>
              <Icon className="text-xl" />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
