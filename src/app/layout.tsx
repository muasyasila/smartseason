import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SmartSeason - Field Monitoring System',
  description: 'Track crop progress across multiple fields in Kenya',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        {children}
      </body>
    </html>
  )
}