import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  // Только POST запросы
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  const supabaseUrl = process.env.SUPABASE_URL || 'https://tlzxcghfvgazkzaoawtj.supabase.co'
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SECRET_KEY
  
  if (!supabaseServiceKey) {
    return res.status(500).json({ ok: false, error: 'Missing SUPABASE_SERVICE_KEY' })
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const { table, data, id, order, filter, match } = req.body

  try {
    // INSERT
    if (req.url.includes('/insert')) {
      if (!table || !data) {
        return res.status(400).json({ ok: false, error: 'Missing table or data' })
      }

      const { data: result, error } = await supabase.from(table).insert(data).select().single()
      
      if (error) throw error
      return res.status(200).json({ ok: true, result })
    }

    // UPDATE
    if (req.url.includes('/update')) {
      if (!table || !id || !data) {
        return res.status(400).json({ ok: false, error: 'Missing table, id or data' })
      }

      const { data: result, error } = await supabase
        .from(table)
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return res.status(200).json({ ok: true, result })
    }

    // DELETE
    if (req.url.includes('/delete')) {
      if (!table || !id) {
        return res.status(400).json({ ok: false, error: 'Missing table or id' })
      }

      const { error } = await supabase.from(table).delete().eq('id', id)
      
      if (error) throw error
      return res.status(200).json({ ok: true, result: { id } })
    }

    // QUERY (SELECT)
    if (req.url.includes('/query')) {
      if (!table) {
        return res.status(400).json({ ok: false, error: 'Missing table' })
      }

      let query = supabase.from(table).select('*')
      
      if (order) {
        query = query.order(order.column, { ascending: order.ascending ?? false })
      }
      if (filter) {
        query = query.eq(filter.column, filter.value)
      }
      if (match) {
        query = query.match(match)
      }

      const { data: result, error } = await query
      
      if (error) throw error
      return res.status(200).json({ ok: true, result: result || [] })
    }

    return res.status(404).json({ ok: false, error: 'Not found' })
  } catch (error) {
    console.error(`Admin API error [${table}]:`, error)
    return res.status(500).json({ ok: false, error: error.message })
  }
}
