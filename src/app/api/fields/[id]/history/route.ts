import { createServerClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    console.log('API history received field id:', id)
    
    if (!id || id === 'undefined') {
      return NextResponse.json({ success: false, error: 'Invalid field ID provided' }, { status: 400 })
    }
    
    const supabase = await createServerClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ success: true, data: [] })
    }
    
    // Fetch update history from field_updates table
    const { data: history, error: historyError } = await supabase
      .from('field_updates')
      .select(`
        *,
        user:profiles!created_by (name)
      `)
      .eq('field_id', id)
      .order('created_at', { ascending: false })
    
    if (historyError) {
      console.log('No field_updates table or error:', historyError)
      return NextResponse.json({ success: true, data: [] })
    }
    
    return NextResponse.json({ success: true, data: history })
  } catch (error) {
    console.error('History API error:', error)
    return NextResponse.json({ success: true, data: [] })
  }
}