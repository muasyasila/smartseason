import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Singleton instance
let supabaseInstance: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  if (supabaseInstance) return supabaseInstance
  
  supabaseInstance = createBrowserClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
    global: {
      headers: { 'x-application-name': 'smartseason' },
    },
  })
  
  return supabaseInstance
}

// Helper function with retry logic
export async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  retries = 2,
  delay = 1000
): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    if (retries === 0) throw error
    console.log(`Retrying... ${retries} attempts left`)
    await new Promise(resolve => setTimeout(resolve, delay))
    return fetchWithRetry(fn, retries - 1, delay * 2)
  }
}