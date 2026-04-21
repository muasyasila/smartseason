import { createServerClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createServerClient()
    
    const { data: agents, error } = await supabase
      .from('profiles')
      .select('id, name, email')
      .eq('role', 'agent')
      .order('name')
    
    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ success: true, data: agents })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}