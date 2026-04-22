'use client'

import { motion } from 'framer-motion'
import { Sprout, TrendingUp, AlertTriangle, CheckCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react'

interface DashboardStatsProps {
  total: number
  active: number
  atRisk: number
  completed: number
}

export function DashboardStats({ total, active, atRisk, completed }: DashboardStatsProps) {
  const stats = [
    {
      label: 'Total Fields',
      value: total,
      icon: Sprout,
      change: '+12%',
      trend: 'up',
      color: 'text-slate-600',
      bgColor: 'bg-slate-50',
      iconBg: 'bg-slate-100',
      borderColor: 'border-slate-200',
      gradientFrom: 'from-slate-500',
      gradientTo: 'to-slate-600',
      progressColor: 'bg-gradient-to-r from-slate-500 to-slate-600',
    },
    {
      label: 'Active',
      value: active,
      icon: TrendingUp,
      change: '+5%',
      trend: 'up',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      iconBg: 'bg-emerald-100',
      borderColor: 'border-emerald-200',
      gradientFrom: 'from-emerald-500',
      gradientTo: 'to-emerald-600',
      progressColor: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
    },
    {
      label: 'At Risk',
      value: atRisk,
      icon: AlertTriangle,
      change: '-2%',
      trend: 'down',
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
      iconBg: 'bg-rose-100',
      borderColor: 'border-rose-200',
      gradientFrom: 'from-rose-500',
      gradientTo: 'to-rose-600',
      progressColor: 'bg-gradient-to-r from-rose-500 to-rose-600',
    },
    {
      label: 'Completed',
      value: completed,
      icon: CheckCircle,
      change: '+18%',
      trend: 'up',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      iconBg: 'bg-blue-100',
      borderColor: 'border-blue-200',
      gradientFrom: 'from-blue-500',
      gradientTo: 'to-blue-600',
      progressColor: 'bg-gradient-to-r from-blue-500 to-blue-600',
    },
  ]

  const totalValue = total || 1

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const percentage = Math.round((stat.value / totalValue) * 100)
        
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            className={`group relative overflow-hidden rounded-2xl border ${stat.borderColor} bg-white p-5 transition-all duration-300 hover:shadow-xl`}
            style={{
              boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)',
            }}
          >
            {/* Animated gradient border on hover */}
            <div className={`absolute inset-0 bg-gradient-to-r ${stat.gradientFrom} ${stat.gradientTo} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-2xl`} />
          
            {/* Shimmer effect on hover */}
            <div className="absolute -inset-full top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          
            <div className="relative z-10">
              <div className="flex items-start justify-between">
                <div>
                  <motion.p 
                    className="text-sm font-medium text-gray-500 mb-1"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.1 }}
                  >
                    {stat.label}
                  </motion.p>
                  <motion.p 
                    className="text-3xl font-bold text-gray-900 tracking-tight"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.15, type: "spring", stiffness: 300 }}
                  >
                    {stat.value}
                  </motion.p>
                  <motion.div 
                    className="mt-2 flex items-center gap-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                  >
                    {stat.trend === 'up' ? (
                      <ArrowUpRight className="h-3 w-3 text-emerald-600" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 text-rose-600" />
                    )}
                    <span className={`text-xs font-medium ${stat.trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {stat.change}
                    </span>
                    <span className="text-xs text-gray-400">vs last month</span>
                  </motion.div>
                </div>
                <motion.div 
                  className={`rounded-xl ${stat.iconBg} p-2.5 shadow-sm`}
                  whileHover={{ scale: 1.1, rotate: [0, -5, 5, -5, 0], transition: { duration: 0.4 } }}
                >
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </motion.div>
              </div>
              
              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                  <span>Completion</span>
                  <span className="font-medium">{percentage}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden shadow-inner">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, delay: index * 0.1 + 0.3, ease: "easeOut" }}
                    className={`h-full rounded-full ${stat.progressColor} relative`}
                  >
                    {/* Animated pulse effect on progress bar */}
                    <div className="absolute inset-0 bg-white/30 animate-pulse rounded-full" />
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}