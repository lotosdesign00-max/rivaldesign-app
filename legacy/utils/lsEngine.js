/**
 * lsEngine — Enhanced localStorage engine with batched writes and Telegram sync.
 * This is the advanced storage used by AppLegacy with per-user scoping,
 * queued writes via requestIdleCallback, and remote settings cache.
 */

import { tgUser } from "./tma";

const tgUserId = tgUser?.id || "local";
const lsPendingWrites = new Map();
let lsFlushTimer = null;
const REMOTE_ENTITY_KEYS = new Set(["rs_wallet_balance4", "rs_payment_history4", "rs_orders4"]);
const EXTRA_SETTING_KEYS = new Set(["freepack_subscribed"]);

export function shouldSyncSettingKey(key) {
  return typeof key === "string" && ((key.startsWith("rs_") && !REMOTE_ENTITY_KEYS.has(key)) || EXTRA_SETTING_KEYS.has(key));
}

export function getUserStoragePrefix() {
  return `rs_${tgUserId}_`;
}

export function parseStoredValue(value, fallback = null) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

export function collectLocalSettings() {
  if (typeof window === "undefined") return {};
  const prefix = getUserStoragePrefix();
  const settings = {};
  try {
    for (let i = 0; i < localStorage.length; i += 1) {
      const storageKey = localStorage.key(i);
      if (!storageKey || !storageKey.startsWith(prefix)) continue;
      const key = storageKey.slice(prefix.length);
      if (!shouldSyncSettingKey(key)) continue;
      settings[key] = parseStoredValue(localStorage.getItem(storageKey), null);
    }
  } catch {}
  return settings;
}

export function hydrateLocalSettings(settings = {}) {
  if (typeof window === "undefined" || !settings || typeof settings !== "object") return;
  const prefix = getUserStoragePrefix();
  window.__RIVAL_REMOTE_SETTINGS_CACHE = { ...(window.__RIVAL_REMOTE_SETTINGS_CACHE || {}), ...settings };
  for (const [key, value] of Object.entries(settings)) {
    if (!shouldSyncSettingKey(key)) continue;
    try {
      localStorage.setItem(`${prefix}${key}`, JSON.stringify(value));
    } catch {}
  }
}

function flushLocalStorageQueue() {
  lsFlushTimer = null;
  for (const [key, value] of lsPendingWrites) {
    try {
      localStorage.setItem(key, value);
    } catch {}
  }
  lsPendingWrites.clear();
}

function scheduleLocalStorageWrite(key, value) {
  lsPendingWrites.set(key, value);
  if (lsFlushTimer) return;
  if (typeof window !== "undefined" && "requestIdleCallback" in window) {
    lsFlushTimer = window.requestIdleCallback(flushLocalStorageQueue, { timeout: 900 });
  } else {
    lsFlushTimer = setTimeout(flushLocalStorageQueue, 120);
  }
}

// Bind flush handlers for page unload
if (typeof window !== "undefined" && !window.__rsLocalStorageFlushBound) {
  window.__rsLocalStorageFlushBound = true;
  window.addEventListener("pagehide", flushLocalStorageQueue, { passive: true });
  window.addEventListener("beforeunload", flushLocalStorageQueue);
}

/**
 * ls — Per-user localStorage wrapper with batched writes.
 * Reads from remote cache first if available.
 */
export const ls = {
  get: (k, d) => {
    try {
      if (
        typeof window !== "undefined"
        && window.__RIVAL_REMOTE_SETTINGS_CACHE
        && Object.prototype.hasOwnProperty.call(window.__RIVAL_REMOTE_SETTINGS_CACHE, k)
      ) {
        return window.__RIVAL_REMOTE_SETTINGS_CACHE[k];
      }
      const key = `rs_${tgUserId}_${k}`;
      if (lsPendingWrites.has(key)) return JSON.parse(lsPendingWrites.get(key));
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : d;
    } catch { return d; }
  },
  set: (k, v) => {
    try {
      const key = `rs_${tgUserId}_${k}`;
      scheduleLocalStorageWrite(key, JSON.stringify(v));
      if (typeof window !== "undefined") {
        if (!window.__RIVAL_REMOTE_SETTINGS_CACHE) window.__RIVAL_REMOTE_SETTINGS_CACHE = {};
        if (shouldSyncSettingKey(k)) {
          window.__RIVAL_REMOTE_SETTINGS_CACHE[k] = v;
          window.__RIVAL_REMOTE_SETTINGS_SYNC?.(k, v);
        }
      }
    } catch {}
  },
};

export const openTg = (path, msg = "") =>
  window.open(`https://t.me/${path}${msg ? "?text=" + encodeURIComponent(msg) : ""}`, "_blank");
