'use client'
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const COLORS = ['#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6','#06b6d4','#f97316','#6b7280','#84cc16','#ec4899']

export default function SpendingPieChart({ data }) {
  const entries = Object.entries(data || {})
  if (!entries.length) return (
    <div className="flex items-center justify-center h-44 text-gray-400 text-sm">No expense data</div>
  )

  const chartData = {
    labels: entries.map(([k]) => k.charAt(0) + k.slice(1).toLowerCase()),
    datasets: [{
      data: entries.map(([, v]) => parseFloat(v)),
      backgroundColor: COLORS.slice(0, entries.length),
      borderWidth: 2,
      borderColor: '#fff',
    }],
  }

  return (
    <div style={{ height: 220 }}>
      <Doughnut data={chartData} options={{
        responsive: true, maintainAspectRatio: false, cutout: '65%',
        plugins: {
          legend: { position: 'bottom', labels: { font: { size: 11 }, padding: 12, usePointStyle: true } },
          tooltip: { callbacks: { label: (c) => ` ₹${c.parsed.toLocaleString('en-IN')}` } },
        },
      }} />
    </div>
  )
}
