'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface CropChartProps {
  data: Record<string, number>
}

const CROP_COLORS: Record<string, string> = {
  Maize: '#fbbf24',
  Beans: '#a3e635',
  Wheat: '#fcd34d',
  Rice: '#e4e4e7',
  Soybeans: '#86efac',
}

const CROP_ICONS: Record<string, string> = {
  Maize: '🌽',
  Beans: '🫘',
  Wheat: '🌾',
  Rice: '🍚',
  Soybeans: '🫛',
}

export function CropChart({ data }: CropChartProps) {
  const chartData = Object.entries(data)
    .filter(([_, value]) => value > 0)
    .map(([name, value]) => ({
      name,
      value,
      icon: CROP_ICONS[name] || '🌱',
    }))
    .sort((a, b) => b.value - a.value) // Sort by value descending

  const total = chartData.reduce((sum, item) => sum + item.value, 0)

  if (chartData.length === 0) {
    return (
      <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Crop Distribution</h3>
          <p className="text-sm text-gray-500">Breakdown by crop type</p>
        </div>
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <div className="rounded-full bg-gray-100 p-4 mx-auto w-16 h-16 flex items-center justify-center">
              <span className="text-2xl">🌾</span>
            </div>
            <p className="mt-3 text-sm text-gray-500">No crop data available</p>
            <p className="text-xs text-gray-400">Create fields to see distribution</p>
          </div>
        </div>
      </div>
    )
  }

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const percentage = ((payload[0].value / total) * 100).toFixed(0)
      return (
        <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
          <p className="text-sm font-medium text-gray-900">
            {CROP_ICONS[payload[0].payload.name]} {payload[0].payload.name}
          </p>
          <p className="text-lg font-bold text-gray-900">{payload[0].value} fields</p>
          <p className="text-xs text-gray-500">{percentage}% of total</p>
        </div>
      )
    }
    return null
  }

  // Custom YAxis tick renderer
  const renderYAxisTick = (props: any) => {
    const { x, y, payload } = props
    const cropName = payload.value
    const cropValue = chartData.find(c => c.name === cropName)?.value || 0
    const percentage = ((cropValue / total) * 100).toFixed(0)
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={-8} y={0} dy={4} textAnchor="end" fill="#374151" fontSize={12} fontWeight={500}>
          {CROP_ICONS[cropName] || '🌱'} {cropName}
        </text>
        <text x={-8} y={16} dy={4} textAnchor="end" fill="#9ca3af" fontSize={10}>
          {percentage}%
        </text>
      </g>
    )
  }

  const maxValue = Math.max(...chartData.map(d => d.value))

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Crop Distribution</h3>
        <p className="text-sm text-gray-500">Breakdown by crop type</p>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ left: 100, right: 20, top: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
            <XAxis 
              type="number" 
              stroke="#9ca3af" 
              fontSize={12}
              domain={[0, maxValue + 1]}
              tickFormatter={(value) => `${value}`}
            />
            <YAxis 
              type="category" 
              dataKey="name" 
              stroke="#9ca3af"
              tick={renderYAxisTick}
              width={100}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f9fafb' }} />
            <Bar 
              dataKey="value" 
              radius={[0, 6, 6, 0]}
              maxBarSize={40}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={CROP_COLORS[entry.name] || '#22c55e'}
                  stroke="white"
                  strokeWidth={1}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-center text-sm text-gray-500">
          Total crops: <span className="font-semibold text-gray-900">{total}</span> fields across {chartData.length} crop types
        </p>
      </div>
    </div>
  )
}