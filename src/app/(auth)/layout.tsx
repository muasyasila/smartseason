export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="container relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
          <div className="absolute inset-0 bg-gradient-to-br from-green-700 to-emerald-900" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            🌾 SmartSeason
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                "This system helps us track over 5,000 smallholder farmers across Kenya,
                ensuring no field falls behind schedule."
              </p>
              <footer className="text-sm">— Shamba Records Team</footer>
            </blockquote>
          </div>
        </div>
        <div className="flex p-8 lg:p-12">
          {children}
        </div>
      </div>
    </div>
  )
}