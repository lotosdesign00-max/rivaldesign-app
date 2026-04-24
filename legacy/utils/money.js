/**
 * Money utilities — currency conversion and formatting
 */

import { LANGS } from "../data/langs";

export const STARS_UAH_PER_STAR = 0.84;

export const roundMoney = (value) => Math.round(Number(value || 0) * 100) / 100;
export const moneyUsd = (value) => `$${roundMoney(value).toFixed(2)}`;

export function getLangConfigByCode(currencyCode = "", langs = LANGS) {
  return Object.values(langs || {}).find((item) => item?.code === currencyCode) || null;
}

export function getUahPerUsd(langs = LANGS) {
  return getLangConfigByCode("UAH", langs)?.rate || 40;
}

export function getLocalPerStar(currencyCode = "USD", langs = LANGS) {
  if (currencyCode === "UAH") return STARS_UAH_PER_STAR;
  const localRate = getLangConfigByCode(currencyCode, langs)?.rate || 1;
  const usdPerStar = STARS_UAH_PER_STAR / getUahPerUsd(langs);
  return roundMoney(usdPerStar * localRate);
}

export function estimateStarsFromUsd(amountUsd, langs = LANGS) {
  const totalUah = roundMoney(Number(amountUsd || 0) * getUahPerUsd(langs));
  return Math.max(1, Math.ceil(totalUah / STARS_UAH_PER_STAR));
}

export const makeEntityId = (prefix) => `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

export const REMOTE_BRIEF_MARK = "__RIVAL_META__::";

export function encodeRemoteBrief(userBrief = "", meta = {}) {
  return `${REMOTE_BRIEF_MARK}${JSON.stringify({
    userBrief,
    ...meta,
  })}`;
}

export function decodeRemoteBrief(rawBrief = "") {
  if (typeof rawBrief !== "string" || !rawBrief.startsWith(REMOTE_BRIEF_MARK)) {
    return { userBrief: rawBrief || "", meta: {} };
  }
  try {
    const parsed = JSON.parse(rawBrief.slice(REMOTE_BRIEF_MARK.length));
    return {
      userBrief: parsed.userBrief || "",
      meta: parsed || {},
    };
  } catch {
    return { userBrief: rawBrief || "", meta: {} };
  }
}

export function deriveBotInvoiceUrl(rawUrl = "") {
  if (!rawUrl || typeof rawUrl !== "string") return "";
  if (rawUrl.includes("t.me/CryptoBot?start=")) return rawUrl;

  const startAppMatch = rawUrl.match(/startapp=invoice-([^&]+)/i);
  if (startAppMatch?.[1]) {
    return `https://t.me/CryptoBot?start=${startAppMatch[1]}`;
  }

  const webMatch = rawUrl.match(/\/invoices\/([^/?#]+)/i);
  if (webMatch?.[1]) {
    return `https://t.me/CryptoBot?start=${webMatch[1]}`;
  }

  return "";
}

export function deriveInvoiceHash(input = "") {
  if (!input || typeof input !== "string") return "";

  const botMatch = input.match(/[?&]start=([^&]+)/i);
  if (botMatch?.[1]) return botMatch[1];

  const startAppMatch = input.match(/startapp=invoice-([^&]+)/i);
  if (startAppMatch?.[1]) return startAppMatch[1];

  const webMatch = input.match(/\/invoices\/([^/?#]+)/i);
  if (webMatch?.[1]) return webMatch[1];

  return "";
}
