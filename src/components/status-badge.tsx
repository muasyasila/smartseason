'use client'

interface StatusBadgeProps {
  status: string
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = {
    Active: { color: 'bg-green-100 text-green-800', icon: '🌱', border: 'border-green-200' },
    'At Risk': { color: 'bg-red-100 text-red-800', icon: '⚠️', border: 'border-red-200' },
    Completed: { color: 'bg-blue-100 text-blue-800', icon: '✅', border: 'border-blue-200' },
  }
  
  const { color, icon, border } = config[status as keyof typeof config] || config.Active
  
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${color} ${border}`}>
      <span>{icon}</span>
      {status}
    </span>
  )
}