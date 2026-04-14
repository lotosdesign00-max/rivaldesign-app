const API_BASE = "/api/admin";

async function apiRequest(endpoint, payload) {
  const response = await fetch(`${API_BASE}/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json = await response.json();

  if (!response.ok || !json?.ok) {
    throw new Error(json?.error || "Admin API request failed");
  }

  return json.result;
}

export async function galleryList() {
  return apiRequest("content/query", { table: "gallery", order: { column: "created_at", ascending: false } });
}

export async function galleryAdd(item) {
  return apiRequest("content/insert", { table: "gallery", data: item });
}

export async function galleryUpdate(id, updates) {
  return apiRequest("content/update", { table: "gallery", id, data: updates });
}

export async function galleryDelete(id) {
  return apiRequest("content/delete", { table: "gallery", id });
}

export async function coursesList() {
  return apiRequest("content/query", { table: "courses", order: { column: "created_at", ascending: false } });
}

export async function coursesAdd(item) {
  return apiRequest("content/insert", { table: "courses", data: item });
}

export async function coursesUpdate(id, updates) {
  return apiRequest("content/update", { table: "courses", id, data: updates });
}

export async function coursesDelete(id) {
  return apiRequest("content/delete", { table: "courses", id });
}

export async function servicesList() {
  return apiRequest("content/query", { table: "services", order: { column: "created_at", ascending: false } });
}

export async function servicesAdd(item) {
  return apiRequest("content/insert", { table: "services", data: item });
}

export async function servicesUpdate(id, updates) {
  return apiRequest("content/update", { table: "services", id, data: updates });
}

export async function servicesDelete(id) {
  return apiRequest("content/delete", { table: "services", id });
}

export async function reviewsList() {
  return apiRequest("content/query", { table: "reviews", order: { column: "created_at", ascending: false } });
}

export async function reviewsAdd(item) {
  return apiRequest("content/insert", { table: "reviews", data: item });
}

export async function reviewsUpdate(id, updates) {
  return apiRequest("content/update", { table: "reviews", id, data: updates });
}

export async function reviewsDelete(id) {
  return apiRequest("content/delete", { table: "reviews", id });
}

export async function faqList() {
  return apiRequest("content/query", { table: "faq", order: { column: "created_at", ascending: false } });
}

export async function faqAdd(item) {
  return apiRequest("content/insert", { table: "faq", data: item });
}

export async function faqUpdate(id, updates) {
  return apiRequest("content/update", { table: "faq", id, data: updates });
}

export async function faqDelete(id) {
  return apiRequest("content/delete", { table: "faq", id });
}

export async function homeStatsList() {
  return apiRequest("content/query", { table: "home_stats" });
}

export async function homeStatsAdd(item) {
  return apiRequest("content/insert", { table: "home_stats", data: item });
}

export async function homeStatsUpdate(id, updates) {
  return apiRequest("content/update", { table: "home_stats", id, data: updates });
}

export async function homeStatsDelete(id) {
  return apiRequest("content/delete", { table: "home_stats", id });
}

export async function homeSocialsList() {
  return apiRequest("content/query", { table: "home_socials" });
}

export async function homeSocialsAdd(item) {
  return apiRequest("content/insert", { table: "home_socials", data: item });
}

export async function homeSocialsUpdate(id, updates) {
  return apiRequest("content/update", { table: "home_socials", id, data: updates });
}

export async function homeSocialsDelete(id) {
  return apiRequest("content/delete", { table: "home_socials", id });
}

export async function ordersList() {
  return apiRequest("orders/list");
}

export async function ordersUpdate(orderId, updates) {
  return apiRequest("orders/update", { orderId, ...updates });
}

export async function paymentsList() {
  return apiRequest("payments/list");
}

export async function paymentsUpdate(paymentId, updates) {
  return apiRequest("payments/update", { paymentId, ...updates });
}

export async function usersList() {
  return apiRequest("users/list");
}

export async function usersUpdateBalance(userId, balance) {
  return apiRequest("users/update-balance", { userId, balance });
}

export async function messagesByOrder(orderId) {
  return apiRequest("messages/by-order", { orderId });
}

export async function messageSend(orderId, text) {
  return apiRequest("messages/send", { orderId, text });
}

export async function dashboardStats() {
  return apiRequest("dashboard/stats");
}
