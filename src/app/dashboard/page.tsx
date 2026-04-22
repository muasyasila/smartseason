import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardStats } from '@/components/dashboard/dashboard-stats'
import { StatusChart } from '@/components/dashboard/status-chart'
import { CropChart } from '@/components/dashboard/crop-chart'
import { RecentActivity } from '@/components/dashboard/recent-activity'
import { AtRiskAlerts } from '@/components/dashboard/at-risk-alerts'

export default async function DashboardPage() {
  const supabase = await createServerClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, name')
    .eq('id', user.id)
    .single()
  
  let fieldsQuery = supabase.from('fields').select('*')
  if (profile?.role === 'agent') {
    fieldsQuery = fieldsQuery.eq('agent_id', user.id)
  }
  
  const { data: fields } = await fieldsQuery
  
  const totalFields = fields?.length || 0
  const activeFields = fields?.filter(f => f.status === 'Active').length || 0
  const atRiskFields = fields?.filter(f => f.status === 'At Risk').length || 0
  const completedFields = fields?.filter(f => f.status === 'Completed').length || 0
  
  const statusBreakdown = { 
    Active: activeFields, 
    'At Risk': atRiskFields, 
    Completed: completedFields 
  }
  
  const cropDistribution = fields?.reduce((acc, field) => {
    acc[field.crop_type] = (acc[field.crop_type] || 0) + 1
    return acc
  }, {} as Record<string, number>) || {}
  
  const { data: recentActivities } = await supabase
    .from('activity_logs')
    .select('id, action, details, created_at')
    .order('created_at', { ascending: false })
    .limit(5)
  
  const formattedActivities = recentActivities?.map(activity => ({
    id: activity.id,
    action: activity.action,
    user: 'System',
    details: activity.details || {},
    timestamp: activity.created_at,
  })) || []
  
  const atRiskFieldsList = fields?.filter(f => f.status === 'At Risk') || []
  const userName = profile?.name?.split(' ')[0] || 'User'
  
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening'
  
  return (
    <div className="p-6 space-y-6">
      <div className="animate-fade-up">
        <h1 className="text-2xl font-semibold text-gray-900">
          Good {greeting}, <span className="text-emerald-600">{userName}</span>
        </h1>
        <p className="text-sm text-gray-500 mt-1">Here's what's happening with your fields today.</p>
      </div>
      
      <DashboardStats
        total={totalFields}
        active={activeFields}
        atRisk={atRiskFields}
        completed={completedFields}
      />
      
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="animate-fade-up" style={{ animationDelay: '100ms' }}>
          <StatusChart data={statusBreakdown} />
        </div>
        <div className="animate-fade-up" style={{ animationDelay: '150ms' }}>
          <CropChart data={cropDistribution} />
        </div>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="animate-fade-up" style={{ animationDelay: '200ms' }}>
          <RecentActivity activities={formattedActivities} />
        </div>
        <div className="animate-fade-up" style={{ animationDelay: '250ms' }}>
          <AtRiskAlerts fields={atRiskFieldsList} />
        </div>
      </div>
    </div>
  )
}