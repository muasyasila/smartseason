import { createServerClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }
    
    const { data: field, error: fieldError } = await supabase
      .from('fields')
      .select(`
        *,
        agent:profiles!agent_id (id, name, email)
      `)
      .eq('id', id)
      .single()
    
    if (fieldError) {
      return NextResponse.json({ success: false, error: fieldError.message }, { status: 404 })
    }
    
    return NextResponse.json({ success: true, data: field })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }
    
    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    
    if (profile?.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Only admins can edit fields' }, { status: 403 })
    }
    
    const body = await request.json()
    
    const { error: updateError } = await supabase
      .from('fields')
      .update({
        name: body.name,
        crop_type: body.crop_type,
        location: body.location,
        size_hectares: body.size_hectares,
        planting_date: body.planting_date,
        agent_id: body.agent_id,
        notes: body.notes,
      })
      .eq('id', id)
    
    if (updateError) {
      return NextResponse.json({ success: false, error: updateError.message }, { status: 500 })
    }
    
    // Log activity
    await supabase.from('activity_logs').insert({
      user_id: user.id,
      action: 'EDIT_FIELD',
      details: { field_id: id },
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}