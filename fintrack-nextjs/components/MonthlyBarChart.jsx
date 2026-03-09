'use client'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

export default function MonthlyBarChart({ monthlyData }) {
  if (!monthlyData?.length) return (
    <div className="flex items-center justify-center h-44 text-gray-400 text-sm">No data yet</div>
  )

  const data = {
    labels: monthlyData.map((d) => d.month),
    datasets: [
      {
        label: 'Income',
        data: monthlyData.map((d) => parseFloat(d.income)),
        backgroundColor: '#10b981',
        borderRadius: 4,
      },
      {
        label: 'Expense',
        data: monthlyData.map((d) => parseFloat(d.expense)),
        backgroundColor: '#ef4444',
        borderRadius: 4,
      },
    ],
  }

  return (
    <div style={{ height: 220 }}>
      <Bar data={data} options={{
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position: 'top', labels: { font: { size: 11 }, usePointStyle: true } } },
        scales: {
          x: { grid: { display: false } },
          y: { grid: { color: '#f1f5f9' }, ticks: { font: { size: 10 } } },
        },
      }} />
    </div>
  )
}
