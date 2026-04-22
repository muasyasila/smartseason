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
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useState } from 'react'

const navItems = {
  admin: [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Fields', href: '/dashboard/fields', icon: Sprout },
    { name: 'Activity', href: '/dashboard/activity', icon: History },
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
  const [collapsed, setCollapsed] = useState(false)

  const items = navItems[user.role as keyof typeof navItems] || navItems.agent

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <div
      className={`relative flex h-screen flex-col bg-white border-r border-gray-100 transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Collapse Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-white border border-gray-200 text-gray-400 hover:text-green-600 hover:border-green-200 transition-all hover:scale-110"
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>

      {/* Logo */}
      <div className="flex h-16 items-center px-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-green-600 to-emerald-600">
            <Sprout className="h-4 w-4 text-white" />
          </div>
          {!collapsed && (
            <span className="text-sm font-semibold text-gray-900 tracking-tight">
              SmartSeason
            </span>
          )}
        </div>
      </div>

      {/* User Profile */}
      <div className="border-b border-gray-100 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-green-100 to-emerald-100">
            <User className="h-4 w-4 text-green-600" />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user.role}</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {items.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 font-medium'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              } ${collapsed ? 'justify-center' : ''}`}
            >
              <Icon className={`h-4 w-4 ${isActive ? 'text-green-600' : ''}`} />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-gray-100 p-3">
        <button
          onClick={handleLogout}
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200 ${
            collapsed ? 'justify-center' : ''
          } text-gray-500 hover:bg-red-50 hover:text-red-600`}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  )
}