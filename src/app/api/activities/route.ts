// src/app/api/activities/route.ts
import { createServerClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createServerClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    
    if (profile?.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
    }
    
    // Fetch all activity logs
    const { data: logs } = await supabase
      .from('activity_logs')
      .select(`
        *,
        user:profiles!user_id (name, email, role)
      `)
      .order('created_at', { ascending: false })
      .limit(200)
    
    // Fetch field updates
    const { data: fieldUpdates } = await supabase
      .from('field_updates')
      .select(`
        *,
        field:fields (name, crop_type),
        user:profiles!created_by (name, email)
      `)
      .order('created_at', { ascending: false })
      .limit(200)
    
    // Combine activities
    const activities = [
      ...(logs || []).map(log => ({
        id: log.id,
        type: 'system',
        action: log.action,
        user: log.user?.name || 'System',
        userEmail: log.user?.email,
        userRole: log.user?.role,
        details: log.details || {},
        timestamp: log.created_at,
      })),
      ...(fieldUpdates || []).map(update => ({
        id: update.id,
        type: 'field',
        action: 'UPDATE_FIELD_STAGE',
        user: update.user?.name || 'System',
        userEmail: update.user?.email,
        userRole: update.user?.role,
        details: {
          field_id: update.field_id,
          field_name: update.field?.name,
          crop_type: update.field?.crop_type,
          old_stage: update.previous_stage,
          new_stage: update.new_stage,
          notes: update.notes,
        },
        timestamp: update.created_at,
      })),
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    
    // Get unique users and actions
    const uniqueUsers = [...new Map(activities.map(a => [a.user, a.user])).values()].filter(Boolean).sort()
    const uniqueActions = [...new Set(activities.map(a => a.action))].sort()
    
    return NextResponse.json({
      success: true,
      activities,
      uniqueUsers,
      uniqueActions,
      totalActivities: activities.length,
      uniqueActors: uniqueUsers.length,
      fieldUpdatesCount: fieldUpdates?.length || 0,
      systemActionsCount: logs?.length || 0,
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}