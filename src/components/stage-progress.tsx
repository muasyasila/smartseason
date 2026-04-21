'use client'

interface StageProgressProps {
  currentStage: string
}

export function StageProgress({ currentStage }: StageProgressProps) {
  const stages = ['Planted', 'Growing', 'Ready', 'Harvested']
  const currentIndex = stages.indexOf(currentStage as any)
  
  return (
    <div className="flex items-center gap-1">
      {stages.map((stage, idx) => (
        <div key={stage} className="flex items-center">
          <div
            className={`h-2 w-6 rounded-full transition-all duration-300 ${
              idx <= currentIndex ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gray-200'
            }`}
            title={stage}
          />
          {idx < stages.length - 1 && (
            <div
              className={`h-0.5 w-3 transition-all duration-300 ${
                idx < currentIndex ? 'bg-green-400' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )
}