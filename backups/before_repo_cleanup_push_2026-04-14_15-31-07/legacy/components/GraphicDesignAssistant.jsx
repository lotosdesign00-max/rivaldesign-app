import React, { useMemo, useState } from "react";
import SystemIcon from "./SystemIcon";

const PROJECT_TYPES = [
  { id: "avatar",   label: "Аватарка" },
  { id: "preview",  label: "Превью" },
  { id: "banner",   label: "Баннер" },
  { id: "logo",     label: "Логотип" },
];
const STYLE_PRESETS = [
  { id: "minimal", label: "Минимализм", text: "чистая композиция и акцент на форме" },
  { id: "cyber",   label: "Киберпанк",  text: "неон, сложный свет и технологичные детали" },
  { id: "retro",   label: "Ретро",      text: "зерно, винтажные текстуры и теплые оттенки" },
  { id: "bold",    label: "Bold",       text: "крупная типографика и сильный фокус на главном объекте" },
];
const COLOR_PRESETS = [
  { id: "neon",  label: "Неон",    text: "cyan + magenta + темный графит" },
  { id: "mono",  label: "Моно",    text: "черно-белая база + один акцент" },
  { id: "warm",  label: "Теплая",  text: "оранжевый, красный и золотой" },
  { id: "cold",  label: "Холодная",text: "синий, бирюзовый и фиолетовый" },
];

function getById(list, id) { return list.find(i => i.id === id) || list[0]; }

function buildBrief({ lang, project, style, palette, audience }) {
  const target = audience.trim() || (lang === "en" ? "content creators" : "контент-мейкеры");
  return lang === "en"
    ? `${project.label}. ${style.text}. Palette: ${palette.text}. Audience: ${target}. Focus on one strong focal point, readable typography and 2 versions: safe + bold.`
    : `${project.label}. ${style.text}. Палитра: ${palette.text}. Аудитория: ${target}. Один сильный акцент, читаемая типографика и 2 версии: базовая + смелая.`;
}

function formatStamp(date, lang) {
  try {
    return new Intl.DateTimeFormat(lang === "en" ? "en-US" : "ru-RU", {
      day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
    }).format(new Date(date));
  } catch { return "now"; }
}

/* ── Chip selector row ── */
function ChipRow({ label, items, value, onChange }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
      <div style={{ fontSize: 9.5, fontWeight: 900, color: "#818cf8", letterSpacing: ".1em", textTransform: "uppercase" }}>{label}</div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {items.map(item => {
          const active = value === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              style={{
                padding: "6px 13px", borderRadius: 999, fontSize: 11.5, fontWeight: 700, cursor: "pointer",
                border: `1px solid ${active ? "rgba(99,102,241,.55)" : "rgba(99,102,241,.12)"}`,
                background: active ? "rgba(99,102,241,.20)" : "rgba(8,9,20,.65)",
                color: active ? "#c7d2fe" : "rgba(100,116,139,.7)",
                boxShadow: active ? "0 3px 12px rgba(99,102,241,.22)" : "none",
                transition: "all .18s ease",
              }}
            >{item.label}</button>
          );
        })}
      </div>
    </div>
  );
}

export default function GraphicDesignAssistant({ th, lang, onCopy, onOrder, safeLs, showToast }) {
  const labels = useMemo(() => ({
    title: "AI Brief Builder",
    subtitle: lang === "en" ? "Generate a short visual brief in seconds." : "Краткий бриф для визуала — мгновенно.",
    project: lang === "en" ? "Format" : "Формат",
    style: lang === "en" ? "Style" : "Стиль",
    colors: lang === "en" ? "Palette" : "Палитра",
    audience: lang === "en" ? "Audience" : "Аудитория",
    action: lang === "en" ? "Generate Brief" : "Сгенерировать бриф",
    copy: lang === "en" ? "Copy" : "Копировать",
    order: lang === "en" ? "Order design" : "Заказать",
    ready: lang === "en" ? "Your Brief" : "Бриф готов",
    emptyTitle: lang === "en" ? "No brief yet" : "Бриф не создан",
    emptySub: lang === "en" ? "Pick settings above and hit Generate." : "Выбери параметры и нажми кнопку.",
    placeholder: lang === "en" ? "e.g. streamers, indie audience..." : "Напр.: стримеры, аудитория инди-игр...",
    historyTitle: lang === "en" ? "Brief History" : "История брифов",
    historyEmpty: lang === "en" ? "Generated briefs will appear here." : "Здесь появятся созданные брифы.",
    saved: lang === "en" ? "Brief saved" : "Бриф сохранён",
  }), [lang]);

  const storage = safeLs || { get: (_k, d) => d, set: () => {} };
  const [projectType, setProjectType] = useState(PROJECT_TYPES[0].id);
  const [styleType, setStyleType] = useState(STYLE_PRESETS[0].id);
  const [colorType, setColorType] = useState(COLOR_PRESETS[0].id);
  const [audience, setAudience] = useState(lang === "en" ? "gaming audience 16-28" : "гейминг аудитория 16-28");
  const [result, setResult] = useState("");
  const [activeMeta, setActiveMeta] = useState(null);
  const [history, setHistory] = useState(() => storage.get("rs_ai_brief_history4", []));

  const generateBrief = () => {
    const project = getById(PROJECT_TYPES, projectType);
    const style = getById(STYLE_PRESETS, styleType);
    const palette = getById(COLOR_PRESETS, colorType);
    const entry = {
      id: Date.now(),
      project: project.label, style: style.label, palette: palette.label,
      audience: audience.trim() || (lang === "en" ? "content creators" : "контент-мейкеры"),
      result: buildBrief({ lang, project, style, palette, audience }),
      createdAt: new Date().toISOString(),
    };
    const nextHistory = [entry, ...history.filter(h => h.result !== entry.result)].slice(0, 4);
    setResult(entry.result);
    setActiveMeta(entry);
    setHistory(nextHistory);
    storage.set("rs_ai_brief_history4", nextHistory);
    showToast?.(labels.saved, "success");
  };

  return (
    <div style={{
      background: "linear-gradient(180deg, rgba(13,15,26,.88) 0%, rgba(8,9,20,.92) 100%)",
      borderRadius: 24, border: "1px solid rgba(99,102,241,.16)", padding: 18,
      display: "flex", flexDirection: "column", gap: 16,
      boxShadow: "0 12px 40px rgba(3,4,8,.30), inset 0 1px 0 rgba(255,255,255,.04)",
      backdropFilter: "blur(12px)",
    }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10,
              background: "linear-gradient(135deg, rgba(99,102,241,.30), rgba(139,92,246,.22))",
              border: "1px solid rgba(99,102,241,.35)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14,
            }}><SystemIcon name="spark" size={18} color="rgba(224,231,255,.9)" animated /></div>
            <div style={{ fontSize: 17, fontWeight: 900, color: "rgba(224,231,255,.95)" }}>
              {labels.title}
            </div>
          </div>
          <div style={{ fontSize: 11.5, color: "rgba(100,116,139,.72)", lineHeight: 1.5, paddingLeft: 40 }}>
            {labels.subtitle}
          </div>
        </div>
      </div>

      {/* Chip selectors */}
      <ChipRow label={labels.project} items={PROJECT_TYPES}  value={projectType} onChange={setProjectType} />
      <ChipRow label={labels.style}   items={STYLE_PRESETS}  value={styleType}   onChange={setStyleType} />
      <ChipRow label={labels.colors}  items={COLOR_PRESETS}  value={colorType}   onChange={setColorType} />

      {/* Audience input */}
      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        <div style={{ fontSize: 9.5, fontWeight: 900, color: "#818cf8", letterSpacing: ".1em", textTransform: "uppercase" }}>
          {labels.audience}
        </div>
        <input
          value={audience}
          onChange={e => setAudience(e.target.value)}
          placeholder={labels.placeholder}
          style={{
            width: "100%", boxSizing: "border-box", padding: "11px 14px",
            borderRadius: 14, border: "1px solid rgba(99,102,241,.16)",
            background: "rgba(8,9,20,.75)", color: "rgba(224,231,255,.9)",
            fontSize: 12.5, outline: "none", fontFamily: "inherit",
            transition: "border-color .2s ease",
          }}
          onFocus={e => e.target.style.borderColor = "rgba(99,102,241,.45)"}
          onBlur={e => e.target.style.borderColor = "rgba(99,102,241,.16)"}
        />
      </div>

      {/* Generate button */}
      <button
        onClick={generateBrief}
        style={{
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff",
          border: "none", borderRadius: 16, padding: "14px",
          fontSize: 13.5, fontWeight: 900, cursor: "pointer",
          boxShadow: "0 6px 22px rgba(99,102,241,.40)",
          transition: "transform .15s ease, box-shadow .15s ease",
          letterSpacing: ".02em",
        }}
        onTouchStart={e => { e.currentTarget.style.transform = "scale(0.97)"; e.currentTarget.style.boxShadow = "0 3px 12px rgba(99,102,241,.30)"; }}
        onTouchEnd={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 6px 22px rgba(99,102,241,.40)"; }}
      >
        <SystemIcon name="spark" size={13} color="#fff" animated style={{ marginRight: 6 }} /> {labels.action}
      </button>

      {/* Result panel */}
      <div style={{
        minHeight: 140, borderRadius: 20,
        border: `1px solid ${result ? "rgba(99,102,241,.35)" : "rgba(99,102,241,.10)"}`,
        background: result ? "rgba(99,102,241,.06)" : "rgba(8,9,20,.60)",
        padding: 16,
        display: "flex", flexDirection: "column", justifyContent: result ? "space-between" : "center",
        gap: 12, transition: "border-color .3s ease",
      }}>
        {result ? (
          <>
            {/* Chips row */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              {[activeMeta?.project, activeMeta?.style, activeMeta?.palette].filter(Boolean).map(chip => (
                <span key={chip} style={{
                  padding: "3px 9px", borderRadius: 999, fontSize: 9.5, fontWeight: 700,
                  background: "rgba(99,102,241,.12)", border: "1px solid rgba(99,102,241,.22)", color: "#c7d2fe",
                }}>{chip}</span>
              ))}
            </div>

            <div>
              <div style={{ fontSize: 9.5, color: "#818cf8", fontWeight: 900, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 8 }}>
                <SystemIcon name="custom" size={11} color="#818cf8" animated style={{ marginRight: 6 }} /> {labels.ready}
              </div>
              <p style={{ margin: 0, color: "rgba(224,231,255,.88)", fontSize: 13, lineHeight: 1.75 }}>{result}</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <button
                onClick={() => onCopy?.(result)}
                style={{
                  padding: "11px", borderRadius: 12,
                  border: "1px solid rgba(99,102,241,.22)", background: "rgba(99,102,241,.08)",
                  color: "#c7d2fe", cursor: "pointer", fontSize: 11.5, fontWeight: 700,
                  transition: "all .18s ease",
                }}
              >вЊ {labels.copy}</button>
              <button
                onClick={() => onOrder?.(result)}
                style={{
                  padding: "11px", borderRadius: 12,
                  border: "none", background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  color: "#fff", cursor: "pointer", fontSize: 11.5, fontWeight: 900,
                  boxShadow: "0 4px 14px rgba(99,102,241,.35)",
                  transition: "all .18s ease",
                }}
              ><SystemIcon name="telegram" size={12} color="#fff" animated style={{ marginRight: 6 }} /> {labels.order}</button>
            </div>
          </>
        ) : (
          <div style={{ textAlign: "center" }}>
            <div style={{
              width: 48, height: 48, borderRadius: 16, margin: "0 auto 12px",
              background: "rgba(99,102,241,.08)", border: "1px solid rgba(99,102,241,.15)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
            }}><SystemIcon name="spark" size={22} color="rgba(224,231,255,.88)" animated /></div>
            <div style={{ fontSize: 14, fontWeight: 900, color: "rgba(224,231,255,.7)", marginBottom: 6 }}>{labels.emptyTitle}</div>
            <div style={{ fontSize: 11.5, color: "rgba(100,116,139,.65)", lineHeight: 1.6 }}>{labels.emptySub}</div>
          </div>
        )}
      </div>

      {/* History */}
      <div style={{
        background: "rgba(8,9,20,.65)", borderRadius: 18,
        border: "1px solid rgba(99,102,241,.10)", padding: 14,
      }}>
        <div style={{ fontSize: 10.5, fontWeight: 900, color: "#818cf8", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 10 }}>
          <SystemIcon name="about" size={11} color="#818cf8" animated style={{ marginRight: 6 }} /> {labels.historyTitle}
        </div>

        {history.length === 0 ? (
          <div style={{
            borderRadius: 13, border: "1px dashed rgba(99,102,241,.18)", padding: "14px",
            textAlign: "center", color: "rgba(100,116,139,.6)", fontSize: 11, lineHeight: 1.6,
          }}>{labels.historyEmpty}</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {history.slice(0, 3).map(entry => {
              const isCurrent = entry.result === result;
              return (
                <button
                  key={entry.id}
                  onClick={() => { setResult(entry.result); setActiveMeta(entry); }}
                  style={{
                    width: "100%", textAlign: "left",
                    background: isCurrent ? "rgba(99,102,241,.12)" : "rgba(13,15,26,.6)",
                    border: `1px solid ${isCurrent ? "rgba(99,102,241,.40)" : "rgba(99,102,241,.10)"}`,
                    borderRadius: 14, padding: "10px 12px", cursor: "pointer",
                    display: "flex", flexDirection: "column", gap: 6,
                    transition: "all .18s ease",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                    <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                      {[entry.project, entry.style].map(chip => (
                        <span key={chip} style={{
                          padding: "2px 7px", borderRadius: 999, fontSize: 9, fontWeight: 800,
                          background: "rgba(99,102,241,.10)", border: "1px solid rgba(99,102,241,.18)", color: "#a5b4fc",
                        }}>{chip}</span>
                      ))}
                    </div>
                    <span style={{ color: "rgba(100,116,139,.55)", fontSize: 9, fontWeight: 700, flexShrink: 0 }}>
                      {formatStamp(entry.createdAt, lang)}
                    </span>
                  </div>
                  <div style={{
                    fontSize: 11, color: "rgba(165,180,252,.75)", lineHeight: 1.5,
                    display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
                  }}>{entry.result}</div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}


