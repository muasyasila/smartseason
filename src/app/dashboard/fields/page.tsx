import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { FieldsTable } from '@/components/fields-table'
import { CreateFieldButton } from '@/components/create-field-button'

export default async function FieldsPage() {
  const supabase = await createServerClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  
  let fieldsQuery = supabase
    .from('fields')
    .select(`
      *,
      agent:profiles!agent_id (name, email)
    `)
    .order('created_at', { ascending: false })
  
  // If agent, only show their fields
  if (profile?.role === 'agent') {
    fieldsQuery = fieldsQuery.eq('agent_id', user.id)
  }
  
  const { data: fields } = await fieldsQuery
  
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fields</h1>
          <p className="text-gray-600">
            {profile?.role === 'admin' 
              ? 'Manage and monitor all agricultural fields' 
              : 'View and update your assigned fields'}
          </p>
        </div>
        {profile?.role === 'admin' && <CreateFieldButton />}
      </div>
      
      <FieldsTable fields={fields || []} isAdmin={profile?.role === 'admin'} />
    </div>
  )
}