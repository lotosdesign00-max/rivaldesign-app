/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SUPABASE CLIENT
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://tlzxcghfvgazkzaoawtj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsenhjZ2hmdmdhemt6YW9hd3RqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwMTE1MDcsImV4cCI6MjA5MTU4NzUwN30.XlMxBse8mJs3tVFEhELkJKTcSYvKSEAu-dSh1jzTFng';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// ═══════════════════════════════════════════════════════════════════════
// AUTH HELPERS — Telegram WebApp auth (passwordless)
// ═══════════════════════════════════════════════════════════════════════

/**
 * Sign in using Telegram user data (no password needed)
 * Uses Telegram WebApp initData as the auth token
 */
export async function signInWithTelegram(telegramUser) {
  if (!telegramUser) return { error: new Error('No Telegram user data') };

  const { id, username, first_name, last_name } = telegramUser;

  // Check if user exists
  const { data: existingUser, error: fetchError } = await supabase
    .from('users')
    .select('*')
    .eq('telegram_id', id)
    .single();

  if (existingUser) {
    return { user: existingUser, error: null };
  }

  // Create new user
  const { data: newUser, error: createError } = await supabase
    .from('users')
    .insert({
      telegram_id: id,
      username: username || null,
      first_name: first_name || null,
      last_name: last_name || null,
    })
    .select()
    .single();

  if (createError) {
    return { user: null, error: createError };
  }

  return { user: newUser, error: null };
}

/**
 * Get current user by telegram_id
 */
export async function getCurrentUser(telegramId) {
  if (!telegramId) return null;

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('telegram_id', telegramId)
    .single();

  return data || null;
}

// ═══════════════════════════════════════════════════════════════════════
// BALANCE HELPERS
// ═══════════════════════════════════════════════════════════════════════

export async function getBalance(telegramId) {
  const user = await getCurrentUser(telegramId);
  if (!user) return 0;
  return parseFloat(user.balance) || 0;
}

export async function updateBalance(userId, amount) {
  const { data, error } = await supabase
    .from('users')
    .update({ balance: amount })
    .eq('id', userId)
    .select()
    .single();

  return { data, error };
}

// ═══════════════════════════════════════════════════════════════════════
// PAYMENT HELPERS
// ═══════════════════════════════════════════════════════════════════════

export async function createPayment(userId, amount, cryptoInvoiceId = null, cryptoPayUrl = null) {
  const { data, error } = await supabase
    .from('payments')
    .insert({
      user_id: userId,
      amount,
      currency: 'USD',
      status: 'pending',
      crypto_invoice_id: cryptoInvoiceId,
      crypto_pay_url: cryptoPayUrl,
    })
    .select()
    .single();

  return { data, error };
}

export async function updatePaymentStatus(paymentId, status) {
  const updateData = { status };
  if (status === 'paid') {
    updateData.paid_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('payments')
    .update(updateData)
    .eq('id', paymentId)
    .select()
    .single();

  return { data, error };
}

export async function getUserPayments(userId) {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  return { data: data || [], error };
}

// ═══════════════════════════════════════════════════════════════════════
// ORDER HELPERS
// ═══════════════════════════════════════════════════════════════════════

export async function createOrder(userId, serviceId, serviceName, totalAmount, paymentId = null, brief = '') {
  const { data, error } = await supabase
    .from('orders')
    .insert({
      user_id: userId,
      service_id: serviceId,
      service_name: serviceName,
      total_amount: totalAmount,
      payment_id: paymentId,
      brief,
      status: paymentId ? 'payment_review' : 'waiting_payment',
    })
    .select()
    .single();

  return { data, error };
}

export async function getUserOrders(userId) {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      messages (count)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  return { data: data || [], error };
}

export async function getOrderById(orderId) {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single();

  return { data, error };
}

export async function updateOrderStatus(orderId, status) {
  const updateData = { status };
  if (status === 'delivered') {
    updateData.delivered_at = new Date().toISOString();
  } else if (status === 'closed') {
    updateData.closed_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('orders')
    .update(updateData)
    .eq('id', orderId)
    .select()
    .single();

  return { data, error };
}

// ═══════════════════════════════════════════════════════════════════════
// MESSAGE HELPERS
// ═══════════════════════════════════════════════════════════════════════

export async function sendMessage(orderId, senderId, senderRole, text, attachmentUrl = null) {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      order_id: orderId,
      sender_id: senderId,
      sender_role: senderRole,
      text,
      attachment_url: attachmentUrl,
    })
    .select()
    .single();

  return { data, error };
}

export async function getOrderMessages(orderId) {
  const { data, error } = await supabase
    .from('messages')
    .select(`
      *,
      sender:users (id, username, first_name, last_name, is_admin)
    `)
    .eq('order_id', orderId)
    .order('created_at', { ascending: true });

  return { data: data || [], error };
}

// Subscribe to new messages in real-time
export function subscribeToMessages(orderId, callback) {
  return supabase
    .channel(`messages:${orderId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `order_id=eq.${orderId}`,
      },
      (payload) => {
        callback(payload.new);
      }
    )
    .subscribe();
}

// ═══════════════════════════════════════════════════════════════════════
// SERVICES HELPERS
// ═══════════════════════════════════════════════════════════════════════

export async function getServices() {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  return { data: data || [], error };
}

// ═══════════════════════════════════════════════════════════════════════
// NOTIFICATION HELPERS
// ═══════════════════════════════════════════════════════════════════════

export async function getUserNotifications(userId) {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);

  return { data: data || [], error };
}

export async function markNotificationRead(notificationId) {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId);

  return { error };
}

export async function markAllNotificationsRead(userId) {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', userId);

  return { error };
}
