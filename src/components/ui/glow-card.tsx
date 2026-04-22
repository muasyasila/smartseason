'use client'

import { ReactNode } from 'react'

interface GlowCardProps {
  children: ReactNode
  className?: string
}

export function GlowCard({ children, className = '' }: GlowCardProps) {
  return (
    <div className={`group relative ${className}`}>
      <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500" />
      <div className="relative bg-white rounded-2xl shadow-sm border border-gray-100 group-hover:border-transparent transition-all">
        {children}
      </div>
    </div>
  )
}