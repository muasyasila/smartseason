'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { User, Save, AlertCircle, CheckCircle, Lock, Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface SettingsFormProps {
  user: any
  profile: any
}

export function SettingsForm({ user, profile }: SettingsFormProps) {
  const router = useRouter()
  const supabase = createClient()
  
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    
    try {
      // Update profile name
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ name: formData.name })
        .eq('id', user.id)
      
      if (profileError) throw profileError
      
      setSuccess('Profile updated successfully!')
      router.refresh()
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate passwords
    if (!formData.currentPassword) {
      setError('Please enter your current password')
      return
    }
    
    if (!formData.newPassword) {
      setError('Please enter a new password')
      return
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match')
      return
    }
    
    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    
    if (formData.newPassword === formData.currentPassword) {
      setError('New password must be different from current password')
      return
    }
    
    setLoading(true)
    setError('')
    setSuccess('')
    
    try {
      // First verify current password by attempting to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: formData.currentPassword,
      })
      
      if (signInError) {
        setError('Current password is incorrect')
        setLoading(false)
        return
      }
      
      // Update to new password
      const { error: updateError } = await supabase.auth.updateUser({
        password: formData.newPassword
      })
      
      if (updateError) throw updateError
      
      setSuccess('Password updated successfully! Please login again with your new password.')
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
      
      // Sign out after password change to force re-login with new password
      setTimeout(async () => {
        await supabase.auth.signOut()
        router.push('/login')
        router.refresh()
      }, 2000)
      
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Profile Settings */}
      <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <User className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Profile Settings</h2>
        </div>
        
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Display Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              placeholder="Your full name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-gray-500 cursor-not-allowed"
            />
            <p className="mt-1 text-xs text-gray-500">
              Email cannot be changed. Contact admin for assistance.
            </p>
          </div>
          
          {success && (
            <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-700 border border-green-200">
              <CheckCircle className="h-4 w-4" />
              {success}
            </div>
          )}
          
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-2 text-sm text-white hover:shadow-md transition-all disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
      
      {/* Change Password */}
      <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <Lock className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
        </div>
        
        <form onSubmit={handlePasswordUpdate} className="space-y-4">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={formData.currentPassword}
                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                placeholder="Enter your current password"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          
          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                placeholder="Enter new password (min. 6 characters)"
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Password must be at least 6 characters long
            </p>
          </div>
          
          {/* Confirm New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                placeholder="Confirm your new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          
          {/* Password strength indicator */}
          {formData.newPassword && (
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className={`h-1.5 flex-1 rounded-full ${
                  formData.newPassword.length >= 6 ? 'bg-green-500' : 'bg-gray-200'
                }`} />
                <div className={`h-1.5 flex-1 rounded-full ${
                  formData.newPassword.length >= 8 && /[0-9]/.test(formData.newPassword) ? 'bg-green-500' : 'bg-gray-200'
                }`} />
                <div className={`h-1.5 flex-1 rounded-full ${
                  formData.newPassword.length >= 10 && /[!@#$%^&*]/.test(formData.newPassword) ? 'bg-green-500' : 'bg-gray-200'
                }`} />
              </div>
              <p className="text-xs text-gray-500">
                Password strength: {
                  formData.newPassword.length >= 10 && /[!@#$%^&*]/.test(formData.newPassword) ? 'Strong' :
                  formData.newPassword.length >= 8 ? 'Medium' :
                  formData.newPassword.length >= 6 ? 'Weak' : 'Too short'
                }
              </p>
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading || !formData.currentPassword || !formData.newPassword || !formData.confirmPassword}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm text-white hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-4 w-4" />
            {loading ? 'Updating Password...' : 'Update Password'}
          </button>
        </form>
      </div>
      
      {/* Session Management */}
      <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Session Management</h2>
        
        <button
          onClick={async () => {
            if (confirm('Are you sure you want to sign out of all devices?')) {
              await supabase.auth.signOut()
              router.push('/login')
              router.refresh()
            }
          }}
          className="flex items-center gap-2 rounded-lg border border-red-300 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
        >
          Sign Out All Devices
        </button>
        <p className="mt-2 text-xs text-gray-500">
          This will sign you out of all active sessions on all devices.
        </p>
      </div>
    </div>
  )
}