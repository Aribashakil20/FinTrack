import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const CATEGORY_COLORS = {
  FOOD: '#f97316',
  TRANSPORT: '#3b82f6',
  SHOPPING: '#a855f7',
  BILLS: '#ef4444',
  SALARY: '#10b981',
  FREELANCE: '#06b6d4',
  INVESTMENT: '#f59e0b',
  OTHER: '#6b7280',
}

export default function CategoryChart({ categoryBreakdown }) {
  const entries = Object.entries(categoryBreakdown || {})

  if (entries.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
        No expense data available
      </div>
    )
  }

  const data = {
    labels: entries.map(([cat]) => cat.charAt(0) + cat.slice(1).toLowerCase()),
    datasets: [
      {
        data: entries.map(([, val]) => parseFloat(val)),
        backgroundColor: entries.map(([cat]) => CATEGORY_COLORS[cat] || '#6b7280'),
        borderWidth: 2,
        borderColor: '#fff',
        hoverBorderWidth: 0,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 16,
          font: { size: 12, family: 'Inter' },
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => ` $${ctx.parsed.toFixed(2)}`,
        },
      },
    },
    cutout: '65%',
  }

  return (
    <div style={{ height: '280px' }}>
      <Doughnut data={data} options={options} />
    </div>
  )
}
