'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Sprout, TrendingUp, Shield, Zap, ArrowRight, Users, Globe, Award, Clock, BarChart3, Leaf, Droplets, Thermometer } from 'lucide-react'

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled ? 'bg-white shadow-lg backdrop-blur-md bg-white/95' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full blur-xl opacity-60 animate-pulse" />
                <Sprout className="relative h-8 w-8 text-green-600" />
              </div>
              <span className="text-xl font-bold text-gray-900">SmartSeason</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-green-600 transition-colors">Features</a>
              <a href="#dashboard" className="text-gray-600 hover:text-green-600 transition-colors">Dashboard</a>
              <a href="#pricing" className="text-gray-600 hover:text-green-600 transition-colors">Pricing</a>
              <Link href="/login">
                <button className="px-4 py-2 text-green-600 hover:text-green-700 font-medium transition-colors">
                  Sign In
                </button>
              </Link>
              <Link href="/login">
                <button className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:shadow-lg transition-all hover:scale-105">
                  Get Started
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-emerald-50" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-green-200 blur-2xl" />
          <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-emerald-200 blur-2xl" />
          <div className="absolute top-1/3 left-1/4 w-16 h-16 rounded-full bg-green-300 blur-2xl" />
        </div>
        
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 mb-6 shadow-sm border border-green-100">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-sm text-gray-600">Trusted by 500+ farms across Kenya</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="text-gray-900">Smart Farming Starts</span>
              <br />
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                With Smart Data
              </span>
            </h1>
            
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
              Track crop progress, manage field agents, and make data-driven decisions 
              that impact thousands of smallholder farmers across Kenya.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login">
                <button className="group px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-xl transition-all hover:scale-105 flex items-center gap-2 mx-auto">
                  Launch Dashboard
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <a href="#dashboard">
                <button className="px-8 py-3 bg-white text-gray-700 rounded-lg font-semibold border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all">
                  View Demo
                </button>
              </a>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
            {[
              { label: 'Active Fields', value: '2,500+', icon: Sprout, change: '+23%' },
              { label: 'Farmers Served', value: '5,000+', icon: Users, change: '+15%' },
              { label: 'Data Points', value: '50K+', icon: BarChart3, change: '+47%' },
              { label: 'Success Rate', value: '94%', icon: Award, change: '+8%' },
            ].map((stat, i) => (
              <div key={i} className="group text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="inline-flex p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl mb-3 group-hover:scale-110 transition-transform">
                  <stat.icon className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
                <div className="text-xs text-green-600 mt-1">{stat.change}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Real Dashboard Preview */}
      <section id="dashboard" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              See Your Fields Come to Life
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Real-time dashboard with interactive charts and smart analytics
            </p>
          </div>

          {/* Interactive Dashboard Preview */}
          <div className="relative">
            {/* Mock Dashboard */}
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
              {/* Dashboard Header */}
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sprout className="h-5 w-5 text-green-400" />
                    <span className="text-white font-semibold">SmartSeason Dashboard</span>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-2 w-2 rounded-full bg-red-500" />
                    <div className="h-2 w-2 rounded-full bg-yellow-500" />
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                  </div>
                </div>
              </div>
              
              {/* Dashboard Content - Static Preview */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: 'Total Fields', value: '156', color: 'from-blue-500 to-blue-600', icon: '🌾' },
                    { label: 'Active Fields', value: '89', color: 'from-green-500 to-green-600', icon: '🌱' },
                    { label: 'At Risk', value: '23', color: 'from-red-500 to-red-600', icon: '⚠️' },
                    { label: 'Completed', value: '44', color: 'from-purple-500 to-purple-600', icon: '✅' },
                  ].map((stat, i) => (
                    <div key={i} className={`p-4 rounded-xl bg-gradient-to-r ${stat.color} text-white`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm opacity-90">{stat.label}</p>
                          <p className="text-2xl font-bold">{stat.value}</p>
                        </div>
                        <span className="text-2xl">{stat.icon}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-gray-100 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">Field Status</h3>
                      <div className="flex gap-1">
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                        <div className="h-2 w-2 rounded-full bg-red-500" />
                        <div className="h-2 w-2 rounded-full bg-purple-500" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      {[
                        { label: 'Active', value: 89, color: 'bg-green-500', width: '57%' },
                        { label: 'At Risk', value: 23, color: 'bg-red-500', width: '15%' },
                        { label: 'Completed', value: 44, color: 'bg-purple-500', width: '28%' },
                      ].map((item) => (
                        <div key={item.label}>
                          <div className="flex justify-between text-sm mb-1">
                            <span>{item.label}</span>
                            <span>{item.value} fields</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className={`h-full ${item.color} rounded-full`} style={{ width: item.width }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="border border-gray-100 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                      {[
                        { user: 'Admin', action: 'created field "North Field"', time: '2 min ago' },
                        { user: 'John O.', action: 'updated "South Field" to Growing', time: '1 hour ago' },
                        { user: 'Admin', action: 'assigned "East Field" to agent', time: '3 hours ago' },
                      ].map((activity, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm">
                          <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs">👤</span>
                          </div>
                          <div>
                            <p className="text-gray-700">
                              <span className="font-medium">{activity.user}</span> {activity.action}
                            </p>
                            <p className="text-xs text-gray-400">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-green-500 rounded-full blur-2xl opacity-20 animate-pulse" />
            <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-emerald-500 rounded-full blur-2xl opacity-20 animate-pulse delay-1000" />
          </div>
          
          <div className="text-center mt-8">
            <Link href="/login">
              <button className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium">
                Try the live dashboard
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Powerful features designed specifically for agricultural data management
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <TrendingUp className="h-6 w-6" />,
                title: 'Real-time Tracking',
                description: 'Monitor field progress and get instant alerts when crops need attention',
                color: 'from-green-500 to-emerald-500',
              },
              {
                icon: <Shield className="h-6 w-6" />,
                title: 'Role-based Access',
                description: 'Secure separation between admin coordinators and field agents',
                color: 'from-blue-500 to-indigo-500',
              },
              {
                icon: <Zap className="h-6 w-6" />,
                title: 'Smart Analytics',
                description: 'Automatic status detection and predictive insights for better decisions',
                color: 'from-purple-500 to-pink-500',
              },
              {
                icon: <Droplets className="h-6 w-6" />,
                title: 'Weather Integration',
                description: 'Real-time weather data to optimize planting and harvesting',
                color: 'from-cyan-500 to-blue-500',
              },
              {
                icon: <Thermometer className="h-6 w-6" />,
                title: 'Climate Monitoring',
                description: 'Track temperature and rainfall patterns for each field',
                color: 'from-orange-500 to-red-500',
              },
              {
                icon: <Leaf className="h-6 w-6" />,
                title: 'Sustainable Insights',
                description: 'Data-driven recommendations for crop rotation and soil health',
                color: 'from-lime-500 to-green-500',
              },
            ].map((feature, i) => (
              <div key={i} className="group p-6 bg-white rounded-2xl border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-2">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} p-2.5 mb-4 group-hover:scale-110 transition-transform`}>
                  <div className="text-white">{feature.icon}</div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-600 to-emerald-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Farm Management?
          </h2>
          <p className="text-green-100 mb-8 text-lg">
            Join thousands of farmers already using SmartSeason to optimize their yields
          </p>
          <Link href="/login">
            <button className="px-8 py-3 bg-white text-green-600 rounded-lg font-semibold hover:shadow-xl transition-all hover:scale-105">
              Get Started for Free
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Sprout className="h-6 w-6 text-green-400" />
              <span className="font-bold text-white">SmartSeason</span>
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">Terms</a>
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">Contact</a>
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">Support</a>
            </div>
            <div className="text-sm text-gray-500">
              © 2026 SmartSeason. Empowering Kenyan agriculture.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}