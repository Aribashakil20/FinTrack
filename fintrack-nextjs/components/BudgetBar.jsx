import { FiAlertTriangle } from 'react-icons/fi'

export default function BudgetBar({ budget, onDelete }) {
  const pct = Math.min(budget.percentage, 100)
  const barColor = pct >= 100 ? 'bg-red-500' : pct >= 80 ? 'bg-amber-400' : 'bg-emerald-500'
  const textColor = budget.exceeded ? 'text-red-600' : 'text-gray-700'

  return (
    <div className="py-3 border-b border-gray-50 last:border-0">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          {budget.exceeded && <FiAlertTriangle className="text-red-500 text-xs" />}
          <span className="text-sm font-medium text-gray-800">
            {budget.category.charAt(0) + budget.category.slice(1).toLowerCase()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold ${textColor}`}>
            ₹{parseFloat(budget.spent).toLocaleString('en-IN')} / ₹{parseFloat(budget.limitAmount).toLocaleString('en-IN')}
          </span>
          {onDelete && (
            <button onClick={() => onDelete(budget.id)} className="text-xs text-gray-400 hover:text-red-500">×</button>
          )}
        </div>
      </div>

      <div className="w-full bg-gray-100 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="flex justify-between mt-1">
        <span className="text-xs text-gray-400">{pct.toFixed(0)}% used</span>
        {budget.exceeded
          ? <span className="text-xs text-red-500 font-medium">Over by ₹{Math.abs(parseFloat(budget.remaining)).toLocaleString('en-IN')}</span>
          : <span className="text-xs text-gray-400">₹{parseFloat(budget.remaining).toLocaleString('en-IN')} left</span>}
      </div>
    </div>
  )
}
