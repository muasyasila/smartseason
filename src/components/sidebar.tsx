'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  LayoutDashboard,
  Sprout,
  History,
  Settings,
  LogOut,
  User,
  Bell,
} from 'lucide-react'

const navItems = {
  admin: [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'All Fields', href: '/dashboard/fields', icon: Sprout },
    { name: 'Activity Log', href: '/dashboard/activity', icon: History },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ],
  agent: [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Fields', href: '/dashboard/fields', icon: Sprout },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ],
}

export function Sidebar({ user }: { user: { name: string; role: string } }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  
  const items = navItems[user.role as keyof typeof navItems] || navItems.agent
  
  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }
  
  return (
    <div className="flex w-64 flex-col bg-white border-r shadow-sm">
      <div className="p-6 border-b">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-green-600 to-emerald-600">
            <Sprout className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">
            SmartSeason
          </span>
        </div>
        
        {/* User Info Card */}
        <div className="mt-6 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 p-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
              <User className="h-4 w-4 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user.role}</p>
            </div>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {items.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 font-medium shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? 'text-green-600' : ''}`} />
              {item.name}
              {isActive && (
                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-green-600" />
              )}
            </Link>
          )
        })}
      </nav>
      
      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 transition-all duration-200 hover:bg-red-50"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  )
}