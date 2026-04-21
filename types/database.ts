export type CropType = 'Maize' | 'Beans' | 'Wheat' | 'Rice' | 'Soybeans'
export type FieldStage = 'Planted' | 'Growing' | 'Ready' | 'Harvested'
export type FieldStatus = 'Active' | 'At Risk' | 'Completed'

export interface Field {
  id: string
  name: string
  crop_type: CropType
  location: string | null
  size_hectares: number | null
  planting_date: string
  expected_harvest_date: string | null
  current_stage: FieldStage
  status: FieldStatus
  notes: string | null
  agent_id: string | null
  agent?: { name: string; email: string }
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  email: string
  name: string
  role: 'admin' | 'agent'
  created_at: string
}