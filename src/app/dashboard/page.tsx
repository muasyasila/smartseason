import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardStats } from '@/components/dashboard/dashboard-stats'
import { StatusChart } from '@/components/dashboard/status-chart'
import { CropChart } from '@/components/dashboard/crop-chart'
import { RecentActivity } from '@/components/dashboard/recent-activity'
import { AtRiskAlerts } from '@/components/dashboard/at-risk-alerts'
import { Suspense } from 'react'

// Loading component
function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
        <div className="mt-2 h-4 w-64 animate-pulse rounded bg-gray-200" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-xl bg-gray-100" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-80 animate-pulse rounded-xl bg-gray-100" />
        <div className="h-80 animate-pulse rounded-xl bg-gray-100" />
      </div>
    </div>
  )
}

// Main dashboard component with error handling
async function DashboardContent() {
  const supabase = await createServerClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, name')
    .eq('id', user.id)
    .single()
  
  // Build query based on role
  let fieldsQuery = supabase.from('fields').select('*')
  if (profile?.role === 'agent') {
    fieldsQuery = fieldsQuery.eq('agent_id', user.id)
  }
  
  const { data: fields } = await fieldsQuery
  
  // Calculate stats
  const totalFields = fields?.length || 0
  const activeFields = fields?.filter(f => f.status === 'Active').length || 0
  const atRiskFields = fields?.filter(f => f.status === 'At Risk').length || 0
  const completedFields = fields?.filter(f => f.status === 'Completed').length || 0
  
  const statusBreakdown = { 
    Active: activeFields, 
    'At Risk': atRiskFields, 
    Completed: completedFields 
  }
  
  // Crop distribution
  const cropDistribution = fields?.reduce((acc, field) => {
    acc[field.crop_type] = (acc[field.crop_type] || 0) + 1
    return acc
  }, {} as Record<string, number>) || {}
  
  // Get recent activities
  const { data: recentActivities } = await supabase
    .from('activity_logs')
    .select(`
      id,
      action,
      details,
      created_at
    `)
    .order('created_at', { ascending: false })
    .limit(10)
  
  // Get user names separately to avoid relation issues
  const formattedActivities = await Promise.all((recentActivities || []).map(async (activity) => {
    let userName = 'System'
    if (activity.details?.user_id) {
      const { data: userData } = await supabase
        .from('profiles')
        .select('name')
        .eq('id', activity.details.user_id)
        .single()
      if (userData) {
        userName = userData.name
      }
    }
    return {
      id: activity.id,
      action: activity.action,
      user: userName,
      details: activity.details || {},
      timestamp: activity.created_at,
    }
  }))
  
  // Get at-risk fields
  const atRiskFieldsList = fields?.filter(f => f.status === 'At Risk') || []
  
  // Get user name for welcome message
  const userName = profile?.name?.split(' ')[0] || 'User'
  
  return (
    <>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">
          Welcome back, {userName}! Here's your farm overview.
        </p>
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardStats
          total={totalFields}
          active={activeFields}
          atRisk={atRiskFields}
          completed={completedFields}
        />
      </div>
      
      <div className="grid gap-6 lg:grid-cols-2">
        <StatusChart data={statusBreakdown} />
        <CropChart data={cropDistribution} />
      </div>
      
      <div className="grid gap-6 lg:grid-cols-2">
        <RecentActivity activities={formattedActivities} />
        <AtRiskAlerts fields={atRiskFieldsList} />
      </div>
    </>
  )
}

// Main dashboard page with Suspense for loading
export default async function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  )
}