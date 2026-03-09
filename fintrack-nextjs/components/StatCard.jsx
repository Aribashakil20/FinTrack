export default function StatCard({ title, amount, icon: Icon, color, currency = '₹' }) {
  const colors = {
    blue:  { bg: 'bg-blue-50',    text: 'text-blue-600',    icon: 'text-blue-500'    },
    green: { bg: 'bg-emerald-50', text: 'text-emerald-600', icon: 'text-emerald-500' },
    red:   { bg: 'bg-red-50',     text: 'text-red-500',     icon: 'text-red-400'     },
    amber: { bg: 'bg-amber-50',   text: 'text-amber-600',   icon: 'text-amber-500'   },
  }
  const c = colors[color] || colors.blue

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{title}</p>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${c.bg}`}>
          <Icon className={`text-base ${c.icon}`} />
        </div>
      </div>
      <p className={`text-2xl font-bold ${c.text}`}>
        {currency}{parseFloat(amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
      </p>
    </div>
  )
}
