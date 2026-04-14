import { createClient } from "@supabase/supabase-js"
import crypto from "crypto"

// Vercel Serverless Function
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' })

  try {
    const CRYPTOPAY_API_TOKEN = process.env.CRYPTOPAY_API_TOKEN;
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

    // Verify CryptoPay Webhook Signature
    const cryptoAuthHeader = req.headers['crypto-pay-api-signature'] || req.headers['Crypto-Pay-Api-Signature']
    if (!cryptoAuthHeader) {
      return res.status(400).json({ error: "Missing signature" })
    }

    const secret = crypto.createHash('sha256').update(CRYPTOPAY_API_TOKEN).digest()
    const checkString = JSON.stringify(req.body)
    const hmac = crypto.createHmac('sha256', secret).update(checkString).digest('hex')

    if (hmac !== cryptoAuthHeader) {
      return res.status(403).json({ error: "Invalid signature" })
    }

    // Process webhook
    const { update_type, payload } = req.body
    if (update_type === 'invoice_paid') {
      const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
      
      const invoiceId = payload.invoice_id.toString()
      
      // Update Payment
      const { data: payment, error: paymentError } = await supabaseAdmin
        .from('payments')
        .update({ 
          status: 'paid', 
          paid_at: new Date().toISOString() 
        })
        .eq('crypto_invoice_id', invoiceId)
        .select('*')
        .single()
        
      if (paymentError) throw paymentError

      // Update linked Order
      const { data: order } = await supabaseAdmin
        .from('orders')
        .update({ status: 'queued', updated_at: new Date().toISOString() })
        .eq('payment_id', payment.id)
        .select('*')
        .maybeSingle()
        
      // Top up User balance if no order linked
      if (!order && payment.user_id) {
        const { data: user } = await supabaseAdmin.from('users').select('balance').eq('id', payment.user_id).single()
        if (user) {
          const nextBalance = Number(user.balance || 0) + Number(payment.amount || 0)
          await supabaseAdmin.from('users').update({ balance: nextBalance.toFixed(2) }).eq('id', payment.user_id)
        }
      }
    }

    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error("CryptoPay webhook err", err)
    return res.status(500).json({ error: err.message })
  }
}
