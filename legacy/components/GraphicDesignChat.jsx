import React, { useEffect, useMemo, useRef, useState } from "react";
import { cancelIdle, scheduleIdle } from "../utils/performance";

function buildFallbackReply(text, lang) {
  const clean = text.toLowerCase();

  if (lang === "en") {
    if (clean.includes("avatar")) {
      return "For avatar design: use one dominant face silhouette, high-contrast rim light, and 2 accent colors max. Keep details bold so it stays readable at 64x64.";
    }
    if (clean.includes("banner")) {
      return "For banner: split composition into 3 zones (brand, hero, CTA), keep typography large, and leave safe margins for mobile crop.";
    }
    return "Start with goal -> audience -> mood. Then pick 1 focal object, 1 typography style, and 1 color hierarchy. I can build a full brief if you share your niche.";
  }

  if (clean.includes("аватар")) {
    return "Для аватарки: один главный силуэт, контровой свет и максимум 2 акцентных цвета. Детали делай крупными, чтобы иконка читалась даже в маленьком размере.";
  }
  if (clean.includes("баннер")) {
    return "Для баннера: дели композицию на 3 зоны - бренд, главный объект и CTA. Оставляй безопасные поля под мобильный кроп и используй крупную типографику.";
  }
  return "Начни с цепочки: цель -> аудитория -> настроение. Потом выбери 1 главный объект, 1 типографическую систему и иерархию цвета. Если хочешь, соберу бриф под твой проект.";
}

function getReadableError(error, lang, model, mode) {
  const isEn = lang === "en";
  const message = String(error?.message || "");
  const lowMessage = message.toLowerCase();
  const target = mode === "image" ? (isEn ? "image model" : "модель изображений") : (isEn ? "text model" : "текстовая модель");

  if (message === "IMAGEROUTER_KEY_MISSING") {
    return isEn
      ? "ImageRouter API key is missing. Add VITE_IMAGEROUTER_API_KEY to .env and restart the dev server."
      : "Не найден ImageRouter API key. Добавь VITE_IMAGEROUTER_API_KEY в .env и перезапусти dev-сервер.";
  }

  if (message === "IMAGEROUTER_FREE_MODELS_WEBSITE_ONLY") {
    return isEn
      ? "This ImageRouter key is valid, but free models are API-locked until you make any deposit in the dashboard."
      : "Ключ ImageRouter валиден, но free-модели по API заблокированы, пока ты не внесешь любой депозит в кабинете.";
  }

  if (message === "IMAGEROUTER_429") {
    return isEn
      ? "The free ImageRouter model is temporarily rate-limited. Retry in a few seconds."
      : "Бесплатная модель ImageRouter временно уперлась в rate limit. Попробуй еще раз через несколько секунд.";
  }

  if (message === "IMAGEROUTER_401" || message === "IMAGEROUTER_403") {
    return isEn
      ? "ImageRouter rejected the request. Check the API key and dashboard settings."
      : "ImageRouter отклонил запрос. Проверь API key и настройки в кабинете.";
  }

  if (message === "IMAGEROUTER_500") {
    return isEn
      ? "ImageRouter returned an internal error for the current image model. Retry later or switch the model."
      : "ImageRouter вернул внутреннюю ошибку для текущей image-модели. Попробуй позже или смени модель.";
  }

  if (message === "IMAGEROUTER_IMAGE_FAILED") {
    return isEn
      ? "ImageRouter did not return a valid image. Retry with a shorter prompt or try again in a moment."
      : "ImageRouter не вернул корректное изображение. Попробуй короче промпт или повтори чуть позже.";
  }

  if (message === "OPENROUTER_KEY_MISSING") {
    return isEn
      ? "OpenRouter API key is missing. Add VITE_OPENROUTER_API_KEY to .env and restart the dev server."
      : "Не найден OpenRouter API key. Добавь VITE_OPENROUTER_API_KEY в .env и перезапусти dev-сервер.";
  }

  if (message.startsWith("OPENROUTER_404")) {
    return isEn
      ? `The current ${target} is unavailable: ${model}. Change it in the chat settings or in .env.`
      : `Текущая ${target} недоступна: ${model}. Сменить ее можно в настройках чата или в .env.`;
  }

  if (message.startsWith("OPENROUTER_429")) {
    return isEn
      ? "The current provider is temporarily rate-limited. Retry shortly or switch the model."
      : "У текущего провайдера временный rate limit. Попробуй чуть позже или смени модель.";
  }

  if (message.startsWith("OPENROUTER_402")) {
    return isEn
      ? "OpenRouter says credits are required for this model. Top up balance or switch to another model."
      : "OpenRouter просит кредиты для этой модели. Пополни баланс или смени модель.";
  }

  if (message.startsWith("OPENROUTER_401") || message.startsWith("OPENROUTER_403")) {
    if (lowMessage.includes("user not found")) {
      return isEn
        ? "OpenRouter says this API key does not belong to an existing user. Create a fresh key in OpenRouter and restart the dev server."
        : "OpenRouter ответил: этот API key не привязан к существующему пользователю. Создай новый ключ в OpenRouter и перезапусти dev-сервер.";
    }
    return isEn
      ? "OpenRouter rejected the request with 401/403. Check the API key, account settings, and whether the key was revoked."
      : "OpenRouter отклонил запрос с 401/403. Проверь API key, настройки аккаунта и не был ли ключ отозван.";
  }

  return isEn
    ? "The model request failed. Check the model id, OpenRouter privacy settings, and available credits."
    : "Запрос к модели не прошел. Проверь id модели, privacy-настройки OpenRouter и доступные кредиты.";
}

function extractTextContent(message) {
  if (!message) return "";
  if (typeof message.content === "string") return message.content.trim();
  if (Array.isArray(message.content)) {
    return message.content
      .map((part) => {
        if (typeof part === "string") return part;
        if (part?.type === "text") return part.text || "";
        return "";
      })
      .join("\n")
      .trim();
  }
  return "";
}

async function readApiError(response) {
  const raw = await response.text().catch(() => "");
  if (!raw) return "";

  try {
    const json = JSON.parse(raw);
    return (
      json?.error?.message ||
      json?.error?.name ||
      json?.errors?.[0]?.message ||
      json?.errors?.[0]?.code ||
      raw
    );
  } catch {
    return raw.slice(0, 220);
  }
}

function extractImageUrl(message, data) {
  const fromMessageImages =
    message?.images?.[0]?.image_url?.url ||
    message?.images?.[0]?.imageUrl?.url ||
    message?.images?.[0]?.url;

  if (fromMessageImages) return fromMessageImages;

  if (Array.isArray(message?.content)) {
    for (const part of message.content) {
      const url = part?.image_url?.url || part?.imageUrl?.url || part?.url;
      if (url) return url;
    }
  }

  const fromData =
    data?.images?.[0]?.image_url?.url ||
    data?.images?.[0]?.imageUrl?.url ||
    data?.images?.[0]?.url;

  return fromData || "";
}

function uniqModels(models) {
  return [...new Set(models.filter(Boolean).map((item) => String(item).trim()).filter(Boolean))];
}

const DEFAULT_FAST_TEXT_MODEL = "google/gemma-3-4b-it:free";
const DEFAULT_QUALITY_TEXT_MODEL = "qwen/qwen3-next-80b-a3b-instruct:free";
const TEXT_MODEL_FALLBACKS = [
  DEFAULT_FAST_TEXT_MODEL,
  "google/gemma-3n-e4b-it:free",
  DEFAULT_QUALITY_TEXT_MODEL,
  "meta-llama/llama-3.3-70b-instruct:free",
  "openai/gpt-oss-20b:free",
  "z-ai/glm-4.5-air:free",
];
const RETIRED_TEXT_MODELS = new Set([
  "openrouter/free",
  "qwen/qwen3.6-plus:free",
  "mistralai/mistral-small-3.1-24b-instruct:free",
  "google/gemma-3n-e2b-it:free",
  "google/gemma-3-27b-it",
  "google/gemma-3-27b-it-preview",
  "google/gemma-3-27b-it-preview:free",
]);

function normalizeTextModel(model, fallback = DEFAULT_FAST_TEXT_MODEL) {
  const normalized = String(model || "").trim();
  if (!normalized || RETIRED_TEXT_MODELS.has(normalized.toLowerCase())) {
    return fallback;
  }
  return normalized;
}

function buildTextMessagesForModel(model, systemPrompt, conversation) {
  const normalized = String(model || "").toLowerCase();
  const baseConversation = conversation
    .filter((item) => item.kind !== "image")
    .map((item) => ({ role: item.role === "assistant" ? "assistant" : "user", content: item.text }));

  if (normalized.startsWith("google/gemma-")) {
    if (!baseConversation.length) {
      return [{ role: "user", content: systemPrompt }];
    }

    const [first, ...rest] = baseConversation;
    if (first.role === "user") {
      return [{ role: "user", content: `${systemPrompt}\n\n${first.content}` }, ...rest];
    }

    return [{ role: "user", content: systemPrompt }, ...baseConversation];
  }

  return [{ role: "system", content: systemPrompt }, ...baseConversation];
}

function getModelDisplayName(model) {
  const normalized = String(model || "").toLowerCase();

  if (normalized === "google/gemma-3-4b-it:free") return "Gemma 3 4B";
  if (normalized === "google/gemma-3n-e4b-it:free") return "Gemma 3N E4B";
  if (normalized === "google/gemma-3n-e2b-it:free") return "Gemma 3N E2B";
  if (normalized === "qwen/qwen3-next-80b-a3b-instruct:free") return "Qwen3 Next 80B";
  if (normalized === "meta-llama/llama-3.3-70b-instruct:free") return "Llama 3.3 70B";
  if (normalized === "openai/gpt-oss-20b:free") return "GPT OSS 20B";
  if (normalized === "z-ai/glm-4.5-air:free") return "GLM 4.5 Air";
  if (normalized === "qwen/qwen3.6-plus:free") return "Qwen 3.6 Plus";
  if (normalized === "@cf/black-forest-labs/flux-2-klein-4b") return "FLUX 2 Klein 4B";
  if (normalized === "@cf/black-forest-labs/flux-2-dev") return "FLUX 2 Dev";
  if (normalized === "@cf/black-forest-labs/flux-1-schnell") return "FLUX 1 Schnell";
  if (normalized === "pollinations/flux") return "Pollinations FLUX";

  return String(model || "")
    .split("/")
    .pop()
    ?.replace(/:free$/i, "")
    ?.replace(/-/g, " ")
    ?.replace(/\b\w/g, (char) => char.toUpperCase()) || "Model";
}

function getAspectSize(aspect) {
  switch (aspect) {
    case "16:9":
      return { width: 1280, height: 720 };
    case "9:16":
      return { width: 720, height: 1280 };
    case "4:5":
      return { width: 960, height: 1200 };
    case "3:4":
      return { width: 900, height: 1200 };
    default:
      return { width: 1024, height: 1024 };
  }
}

const IMAGE_ASPECT_OPTIONS = [
  { id: "1:1", label: "Square", ru: "Квадрат", size: "1024 x 1024" },
  { id: "16:9", label: "Wide", ru: "Широкий", size: "1280 x 720" },
  { id: "9:16", label: "Story", ru: "Сторис", size: "720 x 1280" },
  { id: "4:5", label: "Post", ru: "Пост", size: "960 x 1200" },
  { id: "3:4", label: "Poster", ru: "Постер", size: "900 x 1200" },
];

function getImageAspectOption(aspect) {
  return IMAGE_ASPECT_OPTIONS.find((option) => option.id === aspect) || IMAGE_ASPECT_OPTIONS[0];
}

function buildPollinationsImageUrl(prompt, aspect) {
  const { width, height } = getAspectSize(aspect);
  const normalizedPrompt = String(prompt || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 1200);
  const seed =
    Math.abs(
      [...normalizedPrompt].reduce((hash, char) => ((hash << 5) - hash + char.charCodeAt(0)) | 0, Date.now())
    ) % 1000000000;
  const params = new URLSearchParams({
    width: String(width),
    height: String(height),
    model: "flux",
    nologo: "true",
    private: "true",
    enhance: "true",
    seed: String(seed),
  });

  return `https://image.pollinations.ai/prompt/${encodeURIComponent(normalizedPrompt)}?${params.toString()}`;
}

async function requestPollinationsImage(prompt, aspect) {
  const imageUrl = buildPollinationsImageUrl(prompt, aspect);
  if (!imageUrl) {
    throw new Error("POLLINATIONS_IMAGE_FAILED");
  }
  return imageUrl;
}

export default function GraphicDesignChat({ th, lang, sfx, safeLs, showToast }) {
  const fastTextModel = normalizeTextModel(import.meta.env.VITE_OPEN_MODEL_TEXT_FAST, DEFAULT_FAST_TEXT_MODEL);
  const qualityTextModel = normalizeTextModel(
    import.meta.env.VITE_OPEN_MODEL_TEXT_QUALITY || import.meta.env.VITE_OPEN_MODEL_TEXT || import.meta.env.VITE_OPEN_MODEL,
    DEFAULT_QUALITY_TEXT_MODEL
  );
  const defaultTextPreset = safeLs.get("rs_ai_text_preset4", "quality") === "fast" ? "fast" : "quality";
  const defaultTextModel = defaultTextPreset === "fast" ? fastTextModel : qualityTextModel;
  const openRouterKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  const siteUrl = import.meta.env.VITE_APP_URL || (typeof window !== "undefined" ? window.location.origin : "http://localhost");
  const siteName = import.meta.env.VITE_APP_NAME || "RivalDesign AI Chat";

  const welcome = useMemo(
    () =>
      lang === "en"
        ? "Hi! I am your graphic design AI assistant. Use Text for advice and Image for visual generation."
        : "Привет! Я AI-ассистент по графическому дизайну. Используй Текст для советов, а Изображение для генерации визуала.",
    [lang]
  );

  const [messages, setMessages] = useState(() => safeLs.get("rs_ai_chat4", [{ id: 1, role: "assistant", kind: "text", text: welcome }]));
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState(() => safeLs.get("rs_ai_mode4", "text"));
  const [textModel, setTextModel] = useState(() => safeLs.get("rs_ai_text_model4", defaultTextModel));
  const [textPreset, setTextPreset] = useState(defaultTextPreset);
  const [imageAspect, setImageAspect] = useState(() => safeLs.get("rs_ai_image_aspect4", "1:1"));
  const [renderMenuOpen, setRenderMenuOpen] = useState(false);
  const persistTasksRef = useRef({});

  const persistLater = (key, value, timeout = 650) => {
    cancelIdle(persistTasksRef.current[key]);
    persistTasksRef.current[key] = scheduleIdle(() => {
      safeLs.set(key, value);
      delete persistTasksRef.current[key];
    }, timeout);
  };

  useEffect(() => () => {
    Object.values(persistTasksRef.current).forEach(cancelIdle);
    persistTasksRef.current = {};
  }, []);

  useEffect(() => {
    const current = String(textModel || "").trim();
    const targetModel = textPreset === "fast" ? fastTextModel : qualityTextModel;
    const normalized = normalizeTextModel(current, targetModel);

    if (normalized !== textModel) {
      setTextModel(normalized);
    }
    persistLater("rs_ai_text_preset4", textPreset);
    persistLater("rs_ai_text_model4", normalized);
  }, [fastTextModel, qualityTextModel, safeLs, textModel, textPreset]);

  const persistTextPreset = (next) => {
    const normalizedPreset = next === "fast" ? "fast" : "quality";
    const nextModel = normalizedPreset === "fast" ? fastTextModel : qualityTextModel;
    setTextPreset(normalizedPreset);
    setTextModel(nextModel);
    persistLater("rs_ai_text_preset4", normalizedPreset);
    persistLater("rs_ai_text_model4", nextModel);
  };

  const persistMessages = (next) => {
    setMessages(next);
    persistLater("rs_ai_chat4", next, 900);
  };

  const persistMode = (next) => {
    setMode(next);
    persistLater("rs_ai_mode4", next);
    setRenderMenuOpen(false);
  };

  const persistTextModel = (next) => {
    setTextModel(next);
    persistLater("rs_ai_text_model4", next);
  };

  const persistImageAspect = (next) => {
    setImageAspect(next);
    persistLater("rs_ai_image_aspect4", next);
  };

  const activeTextModelName = getModelDisplayName(textPreset === "fast" ? fastTextModel : qualityTextModel);
  const activeImageAspect = getImageAspectOption(imageAspect);

  const chipBaseStyle = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    borderRadius: 999,
    padding: "8px 12px",
    border: `1px solid ${th.border}`,
    background: th.surface,
    color: th.sub,
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: ".01em",
    cursor: "pointer",
    transition: "all .16s ease",
    whiteSpace: "nowrap",
  };

  const activeChipStyle = {
    background: th.grad,
    color: th.btnTxt,
    border: "none",
    boxShadow: "0 8px 20px rgba(0,0,0,.16)",
  };

  const sendMessage = async () => {
    const text = draft.trim();
    if (!text || loading) return;

    const activeModel =
      mode === "image"
        ? "pollinations/flux"
        : normalizeTextModel(textModel, textPreset === "fast" ? fastTextModel : qualityTextModel);
    const userMsg = { id: Date.now(), role: "user", kind: "text", text };
    const nextWithUser = [...messages, userMsg];

    persistMessages(nextWithUser);
    setDraft("");
    setLoading(true);
    sfx.ai?.();

    try {
      if (mode === "image") {
        let resolvedImageModel = activeModel;
        const imageUrl = await requestPollinationsImage(text, imageAspect);

        const caption =
          resolvedImageModel === "pollinations/flux"
            ? lang === "en"
              ? `Image generated with Pollinations FLUX · ${activeImageAspect.id} · ${activeImageAspect.size}.`
              : `Изображение сгенерировано через Pollinations FLUX · ${activeImageAspect.id} · ${activeImageAspect.size}.`
            : lang === "en"
              ? "Image generated successfully."
              : "Изображение успешно сгенерировано.";

        const finalList = [
          ...nextWithUser,
          {
            id: Date.now() + 1,
            role: "assistant",
            kind: "image",
            text: caption,
            imageUrl,
            model: resolvedImageModel,
          },
        ];
        persistMessages(finalList);
        sfx.aiDone?.();
        showToast?.(lang === "en" ? "Image generated" : "Изображение готово", "success");
      } else {
        const textSystem =
          lang === "en"
            ? "You are a senior graphic design assistant for branding, banners, thumbnails, avatars, layouts, and visual identity. Give sharp, practical, taste-driven advice with strong composition, typography, color, hierarchy, and production suggestions. Be concise, concrete, and design-oriented."
            : "Ты сильный AI-ассистент по графическому дизайну для логотипов, баннеров, превью, аватарок, композиций и айдентики. Давай вкусные, практичные и конкретные советы: композиция, типографика, цвет, иерархия, подача и продакшн-решения. Отвечай четко, по делу и с дизайнерским фокусом.";

        const textModelsToTry = uniqModels([
          activeModel,
          textPreset === "fast" ? qualityTextModel : fastTextModel,
          qualityTextModel,
          fastTextModel,
          ...TEXT_MODEL_FALLBACKS,
        ]);

        let data = null;
        let resolvedTextModel = activeModel;
        let lastError = null;
        const openRouterEndpoint = openRouterKey ? "https://openrouter.ai/api/v1/chat/completions" : "/api/openrouter/chat/completions";
        const openRouterHeaders = {
          "Content-Type": "application/json",
          "HTTP-Referer": siteUrl,
          "X-Title": siteName,
          "X-Rival-Referer": siteUrl,
          "X-Rival-Title": siteName,
        };

        if (openRouterKey) {
          openRouterHeaders.Authorization = `Bearer ${openRouterKey}`;
        }

        for (const candidateModel of textModelsToTry) {
          const response = await fetch(openRouterEndpoint, {
            method: "POST",
            headers: openRouterHeaders,
            body: JSON.stringify({
              model: candidateModel,
              temperature: 0.7,
              max_tokens: 700,
              messages: buildTextMessagesForModel(candidateModel, textSystem, nextWithUser),
            }),
          });

          if (response.ok) {
            data = await response.json();
            resolvedTextModel = candidateModel;
            break;
          }

          const errorText = await readApiError(response);
          lastError = new Error(`OPENROUTER_${response.status}${errorText ? `:${errorText}` : ""}`);
          if (![404, 429].includes(response.status)) {
            throw lastError;
          }
        }

        if (!data) {
          throw lastError || new Error("OPENROUTER_429");
        }

        const answer = extractTextContent(data.choices?.[0]?.message) || buildFallbackReply(text, lang);
        const finalList = [...nextWithUser, { id: Date.now() + 1, role: "assistant", kind: "text", text: answer, model: resolvedTextModel }];
        persistMessages(finalList);
        sfx.aiDone?.();
      }
    } catch (error) {
      const answer = getReadableError(error, lang, activeModel, mode);
      const finalList = [...nextWithUser, { id: Date.now() + 1, role: "assistant", kind: "text", text: answer, model: activeModel }];
      persistMessages(finalList);
      showToast?.(
        lang === "en" ? "Model request failed. See the last AI message." : "Запрос к модели не прошел. Смотри последнее сообщение AI.",
        "info"
      );
      sfx.aiDone?.();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: th.card, borderRadius: 22, border: `1px solid ${th.border}`, padding: 14, display: "flex", flexDirection: "column", gap: 12, position: "relative" }}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={() => {
            const reset = [{ id: 1, role: "assistant", kind: "text", text: welcome }];
            persistMessages(reset);
            showToast?.(lang === "en" ? "Chat cleared" : "Чат очищен", "success");
          }}
          style={{
            border: `1px solid ${th.border}`,
            background: "transparent",
            color: th.sub,
            borderRadius: 10,
            padding: "6px 10px",
            fontSize: 11,
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          {lang === "en" ? "Clear" : "Очистить"}
        </button>
      </div>

      <div style={{ minHeight: 310, maxHeight: 420, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8, paddingRight: 2 }}>
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              alignSelf: message.role === "user" ? "flex-end" : "flex-start",
              maxWidth: "92%",
              background: message.role === "user" ? th.accent + "18" : th.surface,
              border: `1px solid ${message.role === "user" ? th.accent + "28" : th.border}`,
              borderRadius: 16,
              padding: "10px 12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 6 }}>
              <div style={{ fontSize: 10, color: th.sub }}>{message.role === "user" ? (lang === "en" ? "You" : "Вы") : "AI"}</div>
              {message.model && (
                <div style={{ fontSize: 9, color: th.sub, maxWidth: 140, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{message.model}</div>
              )}
            </div>

            {message.imageUrl && (
              <a href={message.imageUrl} target="_blank" rel="noreferrer" style={{ display: "block", marginBottom: message.text ? 8 : 0 }}>
                  <img src={message.imageUrl} alt={lang === "en" ? "Generated design" : "Сгенерированное изображение"} loading="lazy" decoding="async" style={{ width: "100%", maxWidth: 280, borderRadius: 14, display: "block", border: `1px solid ${th.border}` }} />
              </a>
            )}

            {message.text && <div style={{ fontSize: 12, color: th.text, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{message.text}</div>}
          </div>
        ))}

        {loading &&
          (mode === "image" ? (
            <div
              style={{
                alignSelf: "flex-start",
                width: "100%",
                maxWidth: 320,
                background: `linear-gradient(135deg, ${th.surface}, ${th.card})`,
                border: `1px solid ${th.border}`,
                borderRadius: 18,
                padding: 12,
                display: "flex",
                flexDirection: "column",
                gap: 10,
                boxShadow: `0 16px 30px rgba(0,0,0,.18)`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                <div style={{ fontSize: 10, color: th.sub }}>AI</div>
                <div style={{ fontSize: 9, color: th.sub }}>Pollinations FLUX · {activeImageAspect.id}</div>
              </div>
              <div
                style={{
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: 16,
                  aspectRatio: imageAspect === "16:9" ? "16 / 9" : imageAspect === "9:16" ? "9 / 16" : imageAspect === "4:5" ? "4 / 5" : "1 / 1",
                  background: `linear-gradient(135deg, ${th.surface}, ${th.card}, ${th.surface})`,
                  border: `1px solid ${th.border}`,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: `linear-gradient(110deg, transparent 0%, ${th.accent}18 28%, ${th.accent}38 50%, transparent 72%)`,
                    transform: "translateX(-100%)",
                    animation: "aiImageSweep 1.6s ease-in-out infinite",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 14,
                    borderRadius: 12,
                    border: `1px dashed ${th.border}`,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    textAlign: "center",
                    padding: 12,
                  }}
                >
                  <div style={{ width: 42, height: 42, borderRadius: 999, background: `${th.accent}18`, border: `1px solid ${th.accent}40`, display: "grid", placeItems: "center", color: th.accent, fontWeight: 900 }}>AI</div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: th.text }}>
                    {lang === "en" ? "Generating concept" : "Создаю концепт"}
                  </div>
                  <div style={{ fontSize: 11, color: th.sub, lineHeight: 1.5 }}>
                    {lang === "en"
                      ? `Rendering ${activeImageAspect.label.toLowerCase()} format at ${activeImageAspect.size}.`
                      : `Рендерю формат ${activeImageAspect.ru.toLowerCase()} в ${activeImageAspect.size}.`}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {[0, 1, 2].map((idx) => (
                  <div
                    key={idx}
                    style={{
                      height: 6,
                      flex: 1,
                      borderRadius: 999,
                      background: idx === 1 ? th.grad : `${th.accent}18`,
                      opacity: idx === 1 ? 1 : 0.7,
                      animation: `aiPulse 1.2s ease-in-out ${idx * 0.18}s infinite`,
                    }}
                  />
                ))}
              </div>
              <style>{`
                @keyframes aiImageSweep {
                  0% { transform: translateX(-100%); }
                  100% { transform: translateX(100%); }
                }
                @keyframes aiPulse {
                  0%, 100% { transform: scaleX(.96); opacity: .55; }
                  50% { transform: scaleX(1); opacity: 1; }
                }
              `}</style>
            </div>
          ) : (
            <div style={{ fontSize: 12, color: th.sub }}>
              {lang === "en" ? "AI is typing..." : "AI печатает..."}
            </div>
          ))}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          padding: 0,
          background: "transparent",
        }}
      >
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <button
            onClick={() => {
              persistMode("text");
              sfx.tab?.();
            }}
            style={{
              ...chipBaseStyle,
              ...(mode === "text" ? activeChipStyle : null),
            }}
          >
            {lang === "en" ? "Text" : "Текст"}
          </button>
          <button
            onClick={() => {
              persistMode("image");
              sfx.tab?.();
            }}
            style={{
              ...chipBaseStyle,
              ...(mode === "image" ? activeChipStyle : null),
            }}
          >
            {lang === "en" ? "Image" : "Изображение"}
          </button>

          {mode === "image" && (
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setRenderMenuOpen((prev) => !prev)}
                style={{
                  ...chipBaseStyle,
                  color: th.text,
                  minWidth: 164,
                  justifyContent: "space-between",
                }}
              >
                <span>
                  {activeImageAspect.id}
                  <span style={{ opacity: 0.68 }}>
                    {" "}· {lang === "en" ? activeImageAspect.label : activeImageAspect.ru} · {activeImageAspect.size}
                  </span>
                </span>
                <span style={{ fontSize: 10, opacity: 0.7 }}>{renderMenuOpen ? "▲" : "▼"}</span>
              </button>

              {renderMenuOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 8px)",
                    left: 0,
                    minWidth: 220,
                    padding: 8,
                    borderRadius: 18,
                    border: `1px solid ${th.border}`,
                    background: `linear-gradient(180deg, ${th.card}, ${th.surface})`,
                    boxShadow: "0 18px 40px rgba(0,0,0,.28)",
                    zIndex: 5,
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                  }}
                >
                  {IMAGE_ASPECT_OPTIONS.map((option) => {
                    const active = imageAspect === option.id;
                    return (
                      <button
                        key={option.id}
                        onClick={() => {
                          persistImageAspect(option.id);
                          setRenderMenuOpen(false);
                          sfx.tab?.();
                        }}
                        style={{
                          border: active ? "none" : `1px solid ${th.border}`,
                          borderRadius: 14,
                          padding: "10px 12px",
                          background: active ? th.grad : "transparent",
                          color: active ? th.btnTxt : th.text,
                          cursor: "pointer",
                          textAlign: "left",
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                        }}
                      >
                        <span style={{ fontSize: 12, fontWeight: 800 }}>
                          {option.id} · {lang === "en" ? option.label : option.ru}
                        </span>
                        <span style={{ fontSize: 11, color: active ? `${th.btnTxt}cc` : th.sub, lineHeight: 1.4 }}>
                          {option.size} · Pollinations FLUX
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {mode === "text" && (
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setRenderMenuOpen((prev) => !prev)}
                style={{
                  ...chipBaseStyle,
                  color: th.text,
                  minWidth: 164,
                  justifyContent: "space-between",
                }}
              >
                <span>
                  {textPreset === "quality" ? (lang === "en" ? "Quality" : "Качество") : (lang === "en" ? "Fast" : "Быстро")}
                  <span style={{ opacity: 0.68 }}> · {activeTextModelName}</span>
                </span>
                <span style={{ fontSize: 10, opacity: 0.7 }}>{renderMenuOpen ? "▲" : "▼"}</span>
              </button>

              {renderMenuOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 8px)",
                    left: 0,
                    minWidth: 220,
                    padding: 8,
                    borderRadius: 18,
                    border: `1px solid ${th.border}`,
                    background: `linear-gradient(180deg, ${th.card}, ${th.surface})`,
                    boxShadow: "0 18px 40px rgba(0,0,0,.28)",
                    zIndex: 5,
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                  }}
                >
                  {[
                    {
                      id: "fast",
                      title: lang === "en" ? "Fast" : "Быстро",
                      desc: `${lang === "en" ? "Lighter model for quicker design feedback" : "Более легкая модель для быстрого дизайнерского фидбека"} · ${getModelDisplayName(fastTextModel)}`,
                    },
                    {
                      id: "quality",
                      title: lang === "en" ? "Quality" : "Качество",
                      desc: `${lang === "en" ? "Stronger model for deeper design answers" : "Более сильная модель для глубоких дизайнерских ответов"} · ${getModelDisplayName(qualityTextModel)}`,
                    },
                  ].map((option) => {
                    const active = textPreset === option.id;
                    return (
                      <button
                        key={option.id}
                        onClick={() => {
                          persistTextPreset(option.id);
                          setRenderMenuOpen(false);
                          sfx.tab?.();
                        }}
                        style={{
                          border: active ? "none" : `1px solid ${th.border}`,
                          borderRadius: 14,
                          padding: "10px 12px",
                          background: active ? th.grad : "transparent",
                          color: active ? th.btnTxt : th.text,
                          cursor: "pointer",
                          textAlign: "left",
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                        }}
                      >
                        <span style={{ fontSize: 12, fontWeight: 800 }}>{option.title}</span>
                        <span style={{ fontSize: 11, color: active ? `${th.btnTxt}cc` : th.sub, lineHeight: 1.4 }}>{option.desc}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "stretch",
            borderRadius: 20,
            border: `1px solid ${th.border}`,
            background: th.surface,
            padding: 6,
            boxShadow: `inset 0 1px 0 ${th.border}`,
          }}
        >
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder={mode === "image" ? (lang === "en" ? "Describe the image you want..." : "Опиши изображение, которое хочешь...") : (lang === "en" ? "Ask about design..." : "Спроси про дизайн...")}
            style={{
              width: "100%",
              borderRadius: 14,
              border: "none",
              background: "transparent",
              color: th.text,
              padding: "10px 12px",
              fontSize: 13,
              outline: "none",
              minWidth: 0,
              flex: 1,
            }}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !draft.trim()}
            style={{
              border: "none",
              borderRadius: 16,
              padding: "0 18px",
              background: loading ? `${th.card}` : th.grad,
              color: loading ? th.sub : th.btnTxt,
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: 12,
              fontWeight: 800,
              minWidth: mode === "image" ? 112 : 104,
              alignSelf: "stretch",
              flexShrink: 0,
            }}
          >
            {mode === "image" ? (lang === "en" ? "Create" : "Создать") : (lang === "en" ? "Send" : "Отправить")}
          </button>
        </div>
      </div>
    </div>
  );
}

