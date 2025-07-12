export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="relative">
        <div className="w-16 h-16 walmart-spinner"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 bg-walmart-spark rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}
