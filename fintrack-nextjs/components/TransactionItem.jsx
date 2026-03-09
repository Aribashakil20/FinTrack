import { FiArrowUpRight, FiArrowDownRight } from 'react-icons/fi'

const CAT_COLORS = {
  FOOD:'bg-orange-100 text-orange-700', TRANSPORT:'bg-blue-100 text-blue-700',
  BILLS:'bg-red-100 text-red-700', SHOPPING:'bg-purple-100 text-purple-700',
  RENT:'bg-pink-100 text-pink-700', ENTERTAINMENT:'bg-yellow-100 text-yellow-700',
  HEALTH:'bg-teal-100 text-teal-700', EDUCATION:'bg-indigo-100 text-indigo-700',
  SALARY:'bg-emerald-100 text-emerald-700', FREELANCE:'bg-cyan-100 text-cyan-700',
  INVESTMENT:'bg-amber-100 text-amber-700', OTHER:'bg-gray-100 text-gray-600',
}

const CAT_EMOJI = {
  FOOD:'🍔', TRANSPORT:'🚌', BILLS:'💡', SHOPPING:'🛍️', RENT:'🏠',
  ENTERTAINMENT:'🎬', HEALTH:'❤️', EDUCATION:'📚', SALARY:'💰',
  FREELANCE:'💻', INVESTMENT:'📈', OTHER:'📌',
}

export default function TransactionItem({ tx, onEdit, onDelete }) {
  const isIncome = tx.type === 'INCOME'
  const cat = tx.category?.toUpperCase()
  const emoji = CAT_EMOJI[cat] || '📌'
  const colorClass = CAT_COLORS[cat] || 'bg-gray-100 text-gray-600'

  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${colorClass}`}>
        {emoji}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">
          {cat ? cat.charAt(0) + cat.slice(1).toLowerCase() : '—'}
        </p>
        <p className="text-xs text-gray-400 truncate">{tx.note || tx.date}</p>
      </div>

      <div className="text-right flex-shrink-0">
        <div className="flex items-center justify-end gap-0.5">
          {isIncome
            ? <FiArrowUpRight className="text-emerald-500 text-xs" />
            : <FiArrowDownRight className="text-red-500 text-xs" />}
          <span className={`text-sm font-semibold ${isIncome ? 'text-emerald-600' : 'text-red-500'}`}>
            {isIncome ? '+' : '-'}₹{parseFloat(tx.amount).toLocaleString('en-IN')}
          </span>
        </div>
        <p className="text-xs text-gray-400">{tx.date}</p>
      </div>

      {(onEdit || onDelete) && (
        <div className="flex gap-1 flex-shrink-0">
          {onEdit  && <button onClick={() => onEdit(tx)}  className="text-xs text-blue-500 hover:underline">Edit</button>}
          {onDelete && <button onClick={() => onDelete(tx.id)} className="text-xs text-red-400 hover:underline">Del</button>}
        </div>
      )}
    </div>
  )
}
