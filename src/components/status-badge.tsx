'use client'

interface StatusBadgeProps {
  status: string
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = {
    Active: { 
      bg: 'bg-green-50', 
      text: 'text-green-700',
      border: 'border-green-200',
      dot: 'bg-green-500'
    },
    'At Risk': { 
      bg: 'bg-red-50', 
      text: 'text-red-700',
      border: 'border-red-200',
      dot: 'bg-red-500'
    },
    Completed: { 
      bg: 'bg-blue-50', 
      text: 'text-blue-700',
      border: 'border-blue-200',
      dot: 'bg-blue-500'
    },
  }
  
  const { bg, text, border, dot } = config[status as keyof typeof config] || config.Active
  
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${bg} ${text} ${border}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {status}
    </span>
  )
}