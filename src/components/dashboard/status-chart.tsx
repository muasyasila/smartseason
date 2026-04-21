'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

interface StatusChartProps {
  data: {
    Active: number
    'At Risk': number
    Completed: number
  }
}

const COLORS = {
  Active: '#22c55e',
  'At Risk': '#ef4444',
  Completed: '#8b5cf6',
}

export function StatusChart({ data }: StatusChartProps) {
  // Prepare data - include all statuses even if zero
  const chartData = [
    { name: 'Active', value: data.Active, icon: '🌱', color: COLORS.Active },
    { name: 'At Risk', value: data['At Risk'], icon: '⚠️', color: COLORS['At Risk'] },
    { name: 'Completed', value: data.Completed, icon: '✅', color: COLORS.Completed },
  ]

  const total = chartData.reduce((sum, item) => sum + item.value, 0)

  // If no data
  if (total === 0) {
    return (
      <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Field Status Distribution</h3>
          <p className="text-sm text-gray-500">Overview of all field conditions</p>
        </div>
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <div className="rounded-full bg-gray-100 p-4 mx-auto w-16 h-16 flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
            <p className="mt-3 text-sm text-gray-500">No field data available</p>
            <p className="text-xs text-gray-400">Create fields to see distribution</p>
          </div>
        </div>
      </div>
    )
  }

  // Custom label renderer - positions labels outside the pie chart
  const renderCustomLabel = (entry: any) => {
    const percentage = ((entry.value / total) * 100).toFixed(1)
    // Only show labels for segments with > 5% to avoid clutter
    if (parseFloat(percentage) < 5) return ''
    return `${percentage}%`
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const dataItem = payload[0].payload
      const percentage = ((dataItem.value / total) * 100).toFixed(1)
      return (
        <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
          <p className="text-sm font-medium text-gray-900">
            {dataItem.icon} {dataItem.name}
          </p>
          <p className="text-lg font-bold text-gray-900">{dataItem.value} fields</p>
          <p className="text-xs text-gray-500">{percentage}% of total</p>
        </div>
      )
    }
    return null
  }

  // Custom legend content
  const renderLegendContent = (props: any) => {
    const { payload } = props
    return (
      <ul className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry: any, index: number) => {
          const percentage = ((entry.payload.value / total) * 100).toFixed(1)
          return (
            <li key={`item-${index}`} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-sm text-gray-700">{entry.value}</span>
              <span className="text-xs text-gray-500">({percentage}%)</span>
            </li>
          )
        })}
      </ul>
    )
  }

  // Filter out zero values for the pie chart
  const nonZeroData = chartData.filter(item => item.value > 0)

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Field Status Distribution</h3>
        <p className="text-sm text-gray-500">Overview of all field conditions</p>
      </div>
      
      {/* Summary Stats Row */}
      <div className="mb-6 grid grid-cols-3 gap-4 pb-4 border-b border-gray-100">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">{total}</p>
          <p className="text-xs text-gray-500">Total Fields</p>
        </div>
        <div className="text-center border-l border-gray-200">
          <p className="text-2xl font-bold text-green-600">{data.Active}</p>
          <p className="text-xs text-gray-500">Active</p>
        </div>
        <div className="text-center border-l border-gray-200">
          <p className="text-2xl font-bold text-purple-600">{data.Completed}</p>
          <p className="text-xs text-gray-500">Completed</p>
        </div>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={nonZeroData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={90}
              paddingAngle={3}
              dataKey="value"
              label={renderCustomLabel}
              labelLine={{ stroke: '#9ca3af', strokeWidth: 1, strokeDasharray: '3 3' }}
            >
              {nonZeroData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color} 
                  stroke="white"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              height={60}
              content={renderLegendContent}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      {/* At Risk Alert */}
      {data['At Risk'] > 0 && (
        <div className="mt-4 rounded-lg bg-red-50 p-3 border border-red-100">
          <div className="flex items-center gap-2">
            <span className="text-lg">⚠️</span>
            <p className="text-sm text-red-800">
              <span className="font-semibold">{data['At Risk']}</span> field{data['At Risk'] !== 1 ? 's are' : ' is'} at risk and needs attention
            </p>
          </div>
        </div>
      )}
    </div>
  )
}