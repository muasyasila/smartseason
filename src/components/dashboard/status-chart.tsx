'use client'

import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react'

interface StatusChartProps {
  data: {
    Active: number
    'At Risk': number
    Completed: number
  }
}

const COLORS = {
  Active: '#10b981',
  'At Risk': '#f43f5e',
  Completed: '#3b82f6',
}

const STATUS_CONFIG = {
  Active: {
    label: 'Active',
    color: COLORS.Active,
    icon: TrendingUp,
    textColor: 'text-emerald-600',
  },
  'At Risk': {
    label: 'At Risk',
    color: COLORS['At Risk'],
    icon: AlertTriangle,
    textColor: 'text-rose-600',
  },
  Completed: {
    label: 'Completed',
    color: COLORS.Completed,
    icon: CheckCircle,
    textColor: 'text-blue-600',
  },
}

export function StatusChart({ data }: StatusChartProps) {
  const chartData = Object.entries(data)
    .filter(([, value]) => value > 0)
    .map(([name, value]) => ({ name, value, color: COLORS[name as keyof typeof COLORS] }))

  const total = chartData.reduce((sum, item) => sum + item.value, 0)

  if (total === 0) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-gray-900">Field Status</h3>
            <p className="text-sm text-gray-500 mt-0.5">Distribution by condition</p>
          </div>
        </div>
        <div className="flex h-80 items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
              <TrendingUp className="h-8 w-8 text-gray-400" />
            </div>
            <p className="mt-3 text-sm text-gray-500">No data available</p>
            <p className="text-xs text-gray-400">Create fields to see distribution</p>
          </div>
        </div>
      </div>
    )
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const percentage = ((payload[0].value / total) * 100).toFixed(1)
      const config = STATUS_CONFIG[payload[0].name as keyof typeof STATUS_CONFIG]
      const Icon = config?.icon
      
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-lg"
        >
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: payload[0].payload.color }} />
            {Icon && <Icon className={`h-3.5 w-3.5 ${config?.textColor}`} />}
            <p className="text-sm font-semibold text-gray-900">{payload[0].name}</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{payload[0].value}</p>
          <p className="text-xs text-gray-500 mt-1">{percentage}% of total fields</p>
        </motion.div>
      )
    }
    return null
  }

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
    const RADIAN = Math.PI / 180
    const radius = outerRadius * 1.15
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)
    const percentage = (percent * 100).toFixed(0)
    
    if (percent < 0.05) return null
    
    return (
      <text
        x={x}
        y={y}
        fill="#6b7280"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {percentage}%
      </text>
    )
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-semibold text-gray-900">Field Status</h3>
          <p className="text-sm text-gray-500 mt-0.5">Distribution by condition</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center">
            <span className="text-xs font-medium text-gray-600">{total}</span>
          </div>
          <span className="text-xs text-gray-400">total fields</span>
        </div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={85}
              paddingAngle={4}
              dataKey="value"
              labelLine={false}
              label={renderCustomLabel}
              stroke="white"
              strokeWidth={3}
              animationBegin={0}
              animationDuration={800}
              animationEasing="ease-out"
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                  style={{
                    filter: `drop-shadow(0 4px 6px ${entry.color}40)`,
                  }}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Simple Legend - One Line */}
      <div className="mt-6 flex justify-center gap-6">
        {chartData.map((item) => {
          const config = STATUS_CONFIG[item.name as keyof typeof STATUS_CONFIG]
          const percentage = ((item.value / total) * 100).toFixed(0)
          
          return (
            <div key={item.name} className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-xs font-medium text-gray-600">{config?.label}</span>
              <span className="text-xs font-semibold text-gray-900">{percentage}%</span>
              <span className="text-xs text-gray-400">({item.value})</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}