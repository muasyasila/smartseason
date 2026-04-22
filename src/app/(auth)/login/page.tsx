'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Sprout, Mail, Lock, Eye, EyeOff, ArrowRight, Leaf, Cloud, Sun } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    
    if (error) {
      setError(error.message)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a3d2e] via-[#1a5c44] to-[#2d7a5c] p-4 relative overflow-hidden">
      {/* Animated nature elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 opacity-20 animate-float">
          <Leaf className="h-16 w-16 text-emerald-300" />
        </div>
        <div className="absolute bottom-10 right-10 opacity-20 animate-float-delayed">
          <Sprout className="h-12 w-12 text-emerald-300" />
        </div>
        <div className="absolute top-1/3 right-1/4 opacity-10 animate-pulse">
          <Sun className="h-32 w-32 text-yellow-300" />
        </div>
        <div className="absolute bottom-1/3 left-1/4 opacity-10 animate-float">
          <Cloud className="h-24 w-24 text-white" />
        </div>
        {/* Animated particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/10 animate-particle"
            style={{
              width: Math.random() * 4 + 2 + 'px',
              height: Math.random() * 4 + 2 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              animationDelay: Math.random() * 5 + 's',
              animationDuration: Math.random() * 10 + 5 + 's',
            }}
          />
        ))}
      </div>

      <div className="relative w-full max-w-5xl flex flex-col lg:flex-row bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
        {/* Left side - Branding */}
        <div className="lg:w-1/2 p-8 lg:p-12 bg-gradient-to-br from-green-900/50 to-emerald-900/50 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-xl">
              <Sprout className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">SmartSeason</span>
          </div>
          
          <div className="space-y-4 mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
              Welcome Back to<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-300">
                Smart Agriculture
              </span>
            </h1>
            <p className="text-green-100/80">
              Continue managing your fields and tracking crop progress with Kenya's leading agricultural platform.
            </p>
          </div>

          {/* Feature list */}
          <div className="space-y-3">
            {[
              'Real-time field tracking',
              'Advanced crop analytics',
              'Multi-agent management',
              'Mobile-optimized dashboard',
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-2 text-green-100">
                <div className="h-1.5 w-1.5 rounded-full bg-green-400" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/10">
            <p className="text-sm text-green-100 italic">
              "SmartSeason has transformed how we manage our 500+ fields across Kiambu County."
            </p>
            <p className="text-xs text-green-300 mt-2">— James Mwangi, Farm Coordinator</p>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="lg:w-1/2 p-8 lg:p-12 bg-white">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Sign In</h2>
            <p className="text-gray-500 mt-1">Access your dashboard to manage fields</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-green-600 transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 pl-9 pr-3 py-2.5 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all"
                  placeholder="admin@demo.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-green-600 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 pl-9 pr-9 py-2.5 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:shadow-lg transition-all hover:scale-[1.02] disabled:opacity-50 flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-6 w-6 rounded-full bg-green-200 flex items-center justify-center">
                <span className="text-xs">🎯</span>
              </div>
              <p className="text-xs font-semibold text-green-800">Demo Access</p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-gray-600">Admin:</span>
                <code className="block text-green-700 font-mono">admin@demo.com</code>
                <code className="block text-green-700 font-mono text-[10px]">Admin123!</code>
              </div>
              <div>
                <span className="text-gray-600">Agent:</span>
                <code className="block text-green-700 font-mono">agent@demo.com</code>
                <code className="block text-green-700 font-mono text-[10px]">Agent123!</code>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(15px); }
        }
        @keyframes particle {
          0% { transform: translateY(0px) translateX(0px); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(-100px) translateX(50px); opacity: 0; }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 5s ease-in-out infinite; }
        .animate-particle { animation: particle 8s linear infinite; }
      `}</style>
    </div>
  )
}