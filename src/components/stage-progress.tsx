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
            className={`h-1.5 w-5 rounded-full transition-all ${
              idx <= currentIndex ? 'bg-gray-700' : 'bg-gray-200'
            }`}
          />
          {idx < stages.length - 1 && (
            <div
              className={`h-px w-3 transition-all ${
                idx < currentIndex ? 'bg-gray-300' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )
}