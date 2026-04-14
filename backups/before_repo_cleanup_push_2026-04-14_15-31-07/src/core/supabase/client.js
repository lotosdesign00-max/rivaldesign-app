import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://tlzxcghfvgazkzaoawtj.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Клиент для основного приложения (anon ключ - только чтение)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Клиент для админки (service_role ключ - полный доступ)
// ВАЖНО: Этот ключ используется ТОЛЬКО в serverless функциях Vercel!
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY || import.meta.env.SUPABASE_SERVICE_KEY || ''

export const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null

export default supabase
