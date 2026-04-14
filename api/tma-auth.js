import { createClient } from "@supabase/supabase-js"
import crypto from "crypto"

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' })

  try {
    const { initData } = req.body;
    const BOT_TOKEN = process.env.VITE_TELEGRAM_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

    if (!initData || !BOT_TOKEN) {
      return res.status(400).json({ error: "Missing initData or BOT_TOKEN" })
    }

    // Parse initData
    const urlParams = new URLSearchParams(initData)
    const hash = urlParams.get('hash')
    urlParams.delete('hash')
    urlParams.sort()
    
    let dataCheckString = ''
    for (const [key, value] of urlParams.entries()) {
      dataCheckString += `${key}=${value}\n`
    }
    dataCheckString = dataCheckString.slice(0, -1)

    const secretKey = crypto.createHmac('sha256', 'WebAppData').update(BOT_TOKEN).digest()
    const calculatedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex')

    if (calculatedHash !== hash) {
      return res.status(403).json({ error: "Invalid Telegram Auth Signature" })
    }

    const userData = JSON.parse(urlParams.get('user') || '{}')
    const telegramId = userData.id

    if (!telegramId) return res.status(403).json({ error: "No user found in initData" })

    // Check if admin in Supabase
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
    
    // Auto-promote first user or hardcoded admin (example: check ENV)
    const ADMIN_TELEGRAM_ID = Number(process.env.ADMIN_TELEGRAM_ID || 0)

    let { data: user } = await supabaseAdmin.from('users').select('*').eq('telegram_id', telegramId).maybeSingle()

    if (!user) {
      // Create user
      const { data: newUser } = await supabaseAdmin.from('users').insert({
        telegram_id: telegramId,
        username: userData.username,
        first_name: userData.first_name,
        last_name: userData.last_name,
        is_admin: telegramId === ADMIN_TELEGRAM_ID
      }).select('*').single()
      user = newUser
    } else if (telegramId === ADMIN_TELEGRAM_ID && !user.is_admin) {
      // Promote if matching env variable
      const { data: updated } = await supabaseAdmin.from('users').update({ is_admin: true }).eq('id', user.id).select('*').single()
      user = updated
    }

    if (!user?.is_admin) {
      return res.status(403).json({ error: "User is not an admin." })
    }

    // Success - user is authenticated as admin in TMA
    // We pass back a custom signed JWT or simply rely on the user ID for subsequent serverless calls
    return res.status(200).json({ ok: true, user })
  } catch (err) {
    console.error("TMA Auth Error:", err)
    return res.status(500).json({ error: "Internal Server Error" })
  }
}
