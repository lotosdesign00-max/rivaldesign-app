import React, { useMemo, useState } from "react";

const COUNTRIES = [
  { id: "ru", flag: "????", name: "??????", nameEn: "Russia", details: "??? / ???? / ?-???? / ?????" },
  { id: "ua", flag: "????", name: "???????", nameEn: "Ukraine", details: "Monobank / PrivatBank / IBAN" },
  { id: "kz", flag: "????", name: "?????????", nameEn: "Kazakhstan", details: "Kaspi / Halyk / ?????" },
  { id: "by", flag: "????", name: "????????", nameEn: "Belarus", details: "????? / ????" },
  { id: "eu", flag: "????", name: "??????", nameEn: "Europe", details: "SEPA / Revolut" },
  { id: "other", flag: "??", name: "?????? ??????", nameEn: "Other region", details: "???????? ??????? ?????? ???????" },
];

export default function PaymentDetailsModal({ onClose, onRequestDetails, lang }) {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [sent, setSent] = useState(false);
  const isEn = lang === "en";

  const copy = useMemo(
    () =>
      isEn
        ? {
            title: "Alternative payment details",
            body: "Choose your region and I will open a direct request for the most convenient payment method.",
            method: "Preferred method",
            cancel: "Cancel",
            send: "Send request",
            successTitle: "Request sent",
            successBody: "The designer will reply with payment details in Telegram.",
          }
        : {
            title: "?????????????? ?????????",
            body: "?????? ??????, ? ? ?????? ?????? ?? ????? ??????? ?????? ?????? ????????.",
            method: "???????????????? ??????",
            cancel: "??????",
            send: "????????? ??????",
            successTitle: "?????? ?????????",
            successBody: "???????? ??????? ??????????? ? Telegram.",
          },
    [isEn]
  );

  const handleSend = () => {
    if (!selectedCountry) return;
    onRequestDetails?.(selectedCountry);
    setSent(true);
    setTimeout(() => onClose?.(), 1200);
  };

  return (
    <>
      <div
        onClick={() => !sent && onClose?.()}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          background: "rgba(2,3,7,.76)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
        }}
      />

      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "fixed",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: "min(430px, calc(100vw - 28px))",
          zIndex: 10000,
          borderRadius: 30,
          border: "1px solid rgba(255,255,255,.10)",
          background: "linear-gradient(180deg, rgba(18,20,34,.98) 0%, rgba(10,12,22,.99) 100%)",
          boxShadow: "0 28px 80px rgba(0,0,0,.46), inset 0 1px 0 rgba(255,255,255,.05)",
          padding: 24,
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(255,255,255,.03) 0%, transparent 28%)", pointerEvents: "none" }} />

        {sent ? (
          <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "28px 8px 20px" }}>
            <div style={{ width: 68, height: 68, borderRadius: 22, margin: "0 auto 16px", background: "linear-gradient(135deg, #10b981, #059669)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, fontWeight: 900, boxShadow: "0 10px 28px rgba(16,185,129,.38)" }}>?</div>
            <div className="type-display" style={{ fontSize: 24, color: "rgba(244,244,245,.96)", marginBottom: 8 }}>{copy.successTitle}</div>
            <div style={{ fontSize: 13, color: "rgba(161,161,170,.88)", lineHeight: 1.65 }}>{copy.successBody}</div>
          </div>
        ) : (
          <div style={{ position: "relative", zIndex: 1 }}>
            <div className="type-display" style={{ fontSize: 26, color: "rgba(244,244,245,.96)", lineHeight: 1.08, marginBottom: 10 }}>{copy.title}</div>
            <div style={{ fontSize: 13, color: "rgba(161,161,170,.86)", lineHeight: 1.7, marginBottom: 18 }}>{copy.body}</div>

            <div style={{ display: "grid", gap: 8, marginBottom: 16 }}>
              {COUNTRIES.map((country) => {
                const active = selectedCountry?.id === country.id;
                return (
                  <button
                    key={country.id}
                    onClick={() => setSelectedCountry(country)}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "14px 14px",
                      borderRadius: 18,
                      border: `1px solid ${active ? "rgba(99,102,241,.40)" : "rgba(255,255,255,.08)"}`,
                      background: active ? "rgba(99,102,241,.12)" : "rgba(255,255,255,.04)",
                      color: "rgba(244,244,245,.96)",
                      textAlign: "left",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ fontSize: 22, lineHeight: 1 }}>{country.flag}</div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 900 }}>{isEn ? country.nameEn : country.name}</div>
                      <div style={{ fontSize: 11.5, color: "rgba(161,161,170,.82)", marginTop: 4 }}>{country.details}</div>
                    </div>
                    <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${active ? "#818cf8" : "rgba(161,161,170,.45)"}`, background: active ? "#818cf8" : "transparent", flexShrink: 0 }} />
                  </button>
                );
              })}
            </div>

            {selectedCountry && (
              <div style={{ borderRadius: 18, border: "1px solid rgba(99,102,241,.20)", background: "rgba(99,102,241,.08)", padding: "14px 16px", marginBottom: 18 }}>
                <div className="type-micro" style={{ fontSize: 8.5, color: "rgba(161,161,170,.8)", marginBottom: 6 }}>{copy.method}</div>
                <div style={{ fontSize: 13, color: "rgba(244,244,245,.96)", fontWeight: 800 }}>{selectedCountry.details}</div>
              </div>
            )}

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => onClose?.()}
                style={{
                  flex: 1,
                  height: 48,
                  borderRadius: 16,
                  border: "1px solid rgba(255,255,255,.10)",
                  background: "rgba(255,255,255,.05)",
                  color: "rgba(244,244,245,.92)",
                  fontSize: 13,
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                {copy.cancel}
              </button>
              <button
                onClick={handleSend}
                disabled={!selectedCountry}
                style={{
                  flex: 1.3,
                  height: 48,
                  borderRadius: 16,
                  border: "1px solid rgba(255,255,255,.08)",
                  background: !selectedCountry ? "rgba(99,102,241,.20)" : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 900,
                  cursor: !selectedCountry ? "not-allowed" : "pointer",
                  boxShadow: !selectedCountry ? "none" : "0 10px 28px rgba(99,102,241,.34)",
                  opacity: !selectedCountry ? 0.6 : 1,
                }}
              >
                {copy.send}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
