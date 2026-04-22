export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        <div className="h-12 w-12 rounded-full border-4 border-gray-200" />
        <div className="absolute top-0 left-0 h-12 w-12 rounded-full border-4 border-green-600 border-t-transparent animate-spin" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="h-4 w-4 bg-green-600 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  )
}