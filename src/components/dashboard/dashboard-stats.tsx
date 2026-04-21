'use client'

import { Sprout, AlertCircle, CheckCircle, TrendingUp, MapPin, Calendar } from 'lucide-react'

interface DashboardStatsProps {
  total: number
  active: number
  atRisk: number
  completed: number
  totalHectares?: number
  activeAgents?: number
}

export function DashboardStats({ total, active, atRisk, completed, totalHectares = 0, activeAgents = 0 }: DashboardStatsProps) {
  const stats = [
    {
      title: 'Total Fields',
      value: total,
      icon: Sprout,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      change: `${total} total fields`,
    },
    {
      title: 'Active Fields',
      value: active,
      icon: TrendingUp,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      change: `${active} fields growing`,
    },
    {
      title: 'At Risk',
      value: atRisk,
      icon: AlertCircle,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
      change: atRisk > 0 ? `${atRisk} need attention` : 'All healthy',
    },
    {
      title: 'Completed',
      value: completed,
      icon: CheckCircle,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      change: `${completed} fields harvested`,
    },
  ]

  return (
    <>
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <div
            key={stat.title}
            className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="mt-1 text-xs text-gray-500">{stat.change}</p>
              </div>
              <div className={`rounded-full ${stat.bgColor} p-3 transition-transform group-hover:scale-110`}>
                <Icon className={`h-5 w-5 ${stat.iconColor}`} />
              </div>
            </div>
            
            <div className="absolute bottom-0 left-0 h-1 w-full bg-gray-100">
              <div
                className={`h-full bg-gradient-to-r ${stat.color} transition-all duration-500`}
                style={{
                  width: stat.title === 'Total Fields' ? '100%' :
                         stat.title === 'Active Fields' ? (total ? (active / total) * 100 : 0) + '%' :
                         stat.title === 'At Risk' ? (total ? (atRisk / total) * 100 : 0) + '%' :
                         (total ? (completed / total) * 100 : 0) + '%'
                }}
              />
            </div>
          </div>
        )
      })}
    </>
  )
}