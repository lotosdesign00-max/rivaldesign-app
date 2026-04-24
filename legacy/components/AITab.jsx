import React from "react";
import GraphicDesignAssistant from "./GraphicDesignAssistant";
import GraphicDesignChat from "./GraphicDesignChat";

export default function AITab({ th, t, lang, showToast, globals }) {
  const g = globals || ((typeof window !== "undefined" && window.__RIVAL_GLOBALS) || {});
  const { SFX, openTg, ls } = g;
  const safeLs = ls || { get: (_k, d) => d, set: () => {} };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, animation: "cardIn .35s ease both" }}>
      <GraphicDesignChat th={th} lang={lang} sfx={SFX} safeLs={safeLs} showToast={showToast} />

      <GraphicDesignAssistant
        th={th}
        lang={lang}
        safeLs={safeLs}
        showToast={showToast}
        onCopy={(text) => {
          SFX.copy();
          try { navigator.clipboard.writeText(text); } catch {}
          showToast(t.copied, "success");
        }}
        onOrder={(text) => {
          SFX.order();
          openTg("Rivaldsg", (lang === "en" ? "Hi! I want to order a design based on this brief: " : "Привет! Хочу заказать дизайн по этому брифу: ") + text);
        }}
      />
    </div>
  );
}

