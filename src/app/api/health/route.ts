import { createServerClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createServerClient()
    const { data, error } = await supabase.from('fields').select('count', { count: 'exact', head: true })
    
    if (error) throw error
    
    return NextResponse.json({ status: 'healthy', timestamp: new Date().toISOString() })
  } catch (error) {
    return NextResponse.json({ status: 'unhealthy', error: String(error) }, { status: 500 })
  }
}