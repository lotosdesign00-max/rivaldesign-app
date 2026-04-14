import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
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

  const endpoint = req.url.split('/').pop()

  try {
    // ЗАКАЗЫ - список
    if (endpoint === 'list' && req.url.includes('orders')) {
      const { data, error } = await supabase
        .from('orders')
        .select('*, users(*), payments(*)')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return res.status(200).json({ ok: true, result: data || [] })
    }

    // ЗАКАЗЫ - обновление
    if (endpoint === 'update' && req.url.includes('orders')) {
      const { orderId, status, designerNotes, deliveryUrl } = req.body
      if (!orderId) {
        return res.status(400).json({ ok: false, error: 'Missing orderId' })
      }

      const updateData = { updated_at: new Date().toISOString() }
      if (status) updateData.status = status
      if (designerNotes !== undefined) updateData.designer_notes = designerNotes
      if (deliveryUrl !== undefined) updateData.delivery_url = deliveryUrl
      if (status === 'delivered') updateData.delivered_at = new Date().toISOString()
      if (status === 'closed') updateData.closed_at = new Date().toISOString()

      const { data, error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId)
        .select('*, users(*), payments(*)')
        .single()
      
      if (error) throw error
      return res.status(200).json({ ok: true, result: { order: data } })
    }

    // ПЛАТЕЖИ - список
    if (endpoint === 'list' && req.url.includes('payments')) {
      const { data, error } = await supabase
        .from('payments')
        .select('*, users(*)')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return res.status(200).json({ ok: true, result: data || [] })
    }

    // ПЛАТЕЖИ - обновление
    if (endpoint === 'update' && req.url.includes('payments')) {
      const { paymentId, status } = req.body
      if (!paymentId || !status) {
        return res.status(400).json({ ok: false, error: 'Missing paymentId or status' })
      }

      const updateData = { status, updated_at: new Date().toISOString() }
      if (status === 'paid') updateData.paid_at = new Date().toISOString()

      const { data, error } = await supabase
        .from('payments')
        .update(updateData)
        .eq('id', paymentId)
        .select('*, users(*)')
        .single()
      
      if (error) throw error
      return res.status(200).json({ ok: true, result: { payment: data } })
    }

    // ПОЛЬЗОВАТЕЛИ - список
    if (endpoint === 'list' && req.url.includes('users')) {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return res.status(200).json({ ok: true, result: data || [] })
    }

    // ПОЛЬЗОВАТЕЛИ - баланс
    if (endpoint === 'update-balance' && req.url.includes('users')) {
      const { userId, balance } = req.body
      if (!userId || balance === undefined) {
        return res.status(400).json({ ok: false, error: 'Missing userId or balance' })
      }

      const { data, error } = await supabase
        .from('users')
        .update({ balance: Number(balance).toFixed(2), updated_at: new Date().toISOString() })
        .eq('id', userId)
        .select('*')
        .single()
      
      if (error) throw error
      return res.status(200).json({ ok: true, result: { user: data } })
    }

    // СООБЩЕНИЯ - по заказу
    if (endpoint === 'by-order' && req.url.includes('messages')) {
      const { orderId } = req.body
      if (!orderId) {
        return res.status(400).json({ ok: false, error: 'Missing orderId' })
      }

      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('order_id', orderId)
        .order('created_at', { ascending: true })
      
      if (error) throw error
      return res.status(200).json({ ok: true, result: data || [] })
    }

    // СООБЩЕНИЯ - отправить
    if (endpoint === 'send' && req.url.includes('messages')) {
      const { orderId, text } = req.body
      if (!orderId || !text?.trim()) {
        return res.status(400).json({ ok: false, error: 'Missing orderId or text' })
      }

      const { data, error } = await supabase
        .from('messages')
        .insert({
          order_id: orderId,
          sender_role: 'designer',
          text: text.trim(),
        })
        .select('*')
        .single()
      
      if (error) throw error
      return res.status(200).json({ ok: true, result: { message: data } })
    }

    // DASHBOARD - статистика
    if (endpoint === 'stats' && req.url.includes('dashboard')) {
      const [{ data: orders }, { data: payments }, { data: users }] = await Promise.all([
        supabase.from('orders').select('*'),
        supabase.from('payments').select('*'),
        supabase.from('users').select('id'),
      ])

      const activeOrders = (orders || []).filter(o => 
        ['waiting_payment', 'payment_review', 'queued', 'in_progress', 'preview_sent', 'revision'].includes(o.status)
      ).length
      
      const revenue = (payments || [])
        .filter(p => p.status === 'paid')
        .reduce((sum, p) => sum + Number(p.amount || 0), 0)
      
      const inbox = (orders || []).filter(o =>
        o.service_name?.toLowerCase().includes('реквизит') ||
        o.service_name?.toLowerCase().includes('payment details')
      ).length

      return res.status(200).json({
        ok: true,
        result: {
          activeOrders,
          revenue: Number(revenue.toFixed(2)),
          users: (users || []).length,
          inbox,
          totalOrders: (orders || []).length,
          totalPayments: (payments || []).length,
        }
      })
    }

    return res.status(404).json({ ok: false, error: 'Not found' })
  } catch (error) {
    console.error(`Admin API error [${endpoint}]:`, error)
    return res.status(500).json({ ok: false, error: error.message })
  }
}
