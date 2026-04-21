'use server'

import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

export type FieldStatus = 'Active' | 'At Risk' | 'Completed'
export type FieldStage = 'Planted' | 'Growing' | 'Ready' | 'Harvested'

const fieldSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  crop_type: z.string().min(1, 'Crop type is required'),
  location: z.string().optional(),
  size_hectares: z.number().positive().optional(),
  planting_date: z.string().date(),
  agent_id: z.string().uuid('Please select an agent'),
  notes: z.string().optional(),
})

function calculateStatus(stage: FieldStage, plantingDate: string): FieldStatus {
  const daysSincePlanting = Math.floor(
    (Date.now() - new Date(plantingDate).getTime()) / (1000 * 60 * 60 * 24)
  )
  
  if (stage === 'Ready' || stage === 'Harvested') return 'Completed'
  if (daysSincePlanting > 60) return 'At Risk'
  return 'Active'
}

export async function createField(formData: FormData) {
  const supabase = await createServerClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  
  if (profile?.role !== 'admin') {
    throw new Error('Only admins can create fields')
  }
  
  const rawData = {
    name: formData.get('name'),
    crop_type: formData.get('crop_type'),
    location: formData.get('location') || null,
    size_hectares: formData.get('size_hectares') ? parseFloat(formData.get('size_hectares') as string) : null,
    planting_date: formData.get('planting_date'),
    agent_id: formData.get('agent_id'),
    notes: formData.get('notes') || null,
  }
  
  const validated = fieldSchema.parse(rawData)
  
  const initialStage: FieldStage = 'Planted'
  const status = calculateStatus(initialStage, validated.planting_date)
  
  const { data, error } = await supabase
    .from('fields')
    .insert({
      name: validated.name,
      crop_type: validated.crop_type,
      location: validated.location,
      size_hectares: validated.size_hectares,
      planting_date: validated.planting_date,
      current_stage: initialStage,
      status,
      agent_id: validated.agent_id,
      notes: validated.notes,
      created_by: user.id,
    })
    .select()
    .single()
  
  if (error) throw new Error(error.message)
  
  // Log activity with field name for better display
  await supabase.from('activity_logs').insert({
    user_id: user.id,
    action: 'CREATE_FIELD',
    details: { 
      field_id: data.id, 
      field_name: data.name,
      crop_type: data.crop_type
    },
  })
  
  revalidatePath('/dashboard/fields')
  return { success: true, data }
}

export async function updateFieldStage(fieldId: string, formData: FormData) {
  const supabase = await createServerClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  
  const newStage = formData.get('current_stage') as FieldStage
  const notes = formData.get('notes') as string
  
  // Get current field with name
  const { data: field, error: fetchError } = await supabase
    .from('fields')
    .select('planting_date, current_stage, name')
    .eq('id', fieldId)
    .single()
  
  if (fetchError) {
    console.error('Fetch error:', fetchError)
    throw new Error(`Field not found: ${fetchError.message}`)
  }
  
  if (!field) throw new Error('Field not found')
  
  // Don't update if stage hasn't changed
  if (field.current_stage === newStage) {
    return { success: true, message: 'No changes made' }
  }
  
  const status = calculateStatus(newStage, field.planting_date)
  
  // Update field
  const { error: updateError } = await supabase
    .from('fields')
    .update({
      current_stage: newStage,
      status,
      notes: notes || null,
    })
    .eq('id', fieldId)
  
  if (updateError) {
    console.error('Update error:', updateError)
    throw new Error(updateError.message)
  }
  
  // Log to activity_logs with field name for better display
  try {
    await supabase.from('activity_logs').insert({
      user_id: user.id,
      action: 'UPDATE_FIELD_STAGE',
      details: { 
        field_id: fieldId,
        field_name: field.name,
        old_stage: field.current_stage,
        new_stage: newStage,
        notes: notes || null
      },
    })
  } catch (logError) {
    console.warn('Activity log failed:', logError)
    // Don't fail the update if logging fails
  }
  
  revalidatePath('/dashboard/fields')
  return { success: true }
}

export async function editField(fieldId: string, formData: FormData): Promise<{ success: boolean; error?: string }> {
  const supabase = await createServerClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }
  
  // Check if user is admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  
  if (profile?.role !== 'admin') {
    return { success: false, error: 'Only admins can edit fields' }
  }
  
  const name = formData.get('name') as string
  const crop_type = formData.get('crop_type') as string
  const location = formData.get('location') as string || null
  const size_hectares = formData.get('size_hectares') ? parseFloat(formData.get('size_hectares') as string) : null
  const planting_date = formData.get('planting_date') as string
  const agent_id = formData.get('agent_id') as string
  const notes = formData.get('notes') as string || null
  
  // Get current field data for logging changes
  const { data: oldField } = await supabase
    .from('fields')
    .select('name, crop_type, location, size_hectares, planting_date, agent_id')
    .eq('id', fieldId)
    .single()
  
  // Update field
  const { error: updateError } = await supabase
    .from('fields')
    .update({
      name,
      crop_type,
      location,
      size_hectares,
      planting_date,
      agent_id,
      notes,
    })
    .eq('id', fieldId)
  
  if (updateError) {
    console.error('Update error:', updateError)
    return { success: false, error: updateError.message }
  }
  
  // Log the edit activity
  try {
    await supabase.from('activity_logs').insert({
      user_id: user.id,
      action: 'EDIT_FIELD',
      details: { 
        field_id: fieldId,
        field_name: name,
        old_values: {
          crop_type: oldField?.crop_type,
          location: oldField?.location,
          size_hectares: oldField?.size_hectares,
          planting_date: oldField?.planting_date,
        },
        new_values: {
          crop_type,
          location,
          size_hectares,
          planting_date,
        }
      },
    })
  } catch (logError) {
    console.warn('Activity log failed:', logError)
  }
  
  revalidatePath('/dashboard/fields')
  return { success: true }
}

export async function deleteField(fieldId: string) {
  const supabase = await createServerClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  
  // Check if user is admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  
  if (profile?.role !== 'admin') {
    throw new Error('Only admins can delete fields')
  }
  
  // Get field name before deleting for logging
  const { data: field } = await supabase
    .from('fields')
    .select('name')
    .eq('id', fieldId)
    .single()
  
  const { error } = await supabase
    .from('fields')
    .delete()
    .eq('id', fieldId)
  
  if (error) throw new Error(error.message)
  
  // Log deletion
  if (field) {
    await supabase.from('activity_logs').insert({
      user_id: user.id,
      action: 'DELETE_FIELD',
      details: { 
        field_id: fieldId,
        field_name: field.name
      },
    })
  }
  
  revalidatePath('/dashboard/fields')
  return { success: true }
}

export async function getAgents() {
  const supabase = await createServerClient()
  
  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, email')
    .eq('role', 'agent')
  
  if (error) throw new Error(error.message)
  return data
}

export async function getFieldById(fieldId: string) {
  const supabase = await createServerClient()
  
  const { data, error } = await supabase
    .from('fields')
    .select(`
      *,
      agent:profiles!agent_id (name, email),
      creator:profiles!created_by (name)
    `)
    .eq('id', fieldId)
    .single()
  
  if (error) throw new Error(error.message)
  return data
}