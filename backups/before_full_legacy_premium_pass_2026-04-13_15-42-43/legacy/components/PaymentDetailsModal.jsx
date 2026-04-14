/**
 * PAYMENT DETAILS MODAL — Выбор страны для реквизитов
 * Bottom sheet с флагами стран и авто-сообщением дизайнеру
 */

import React, { useState } from "react";

const COUNTRIES = [
  { id: "ru", name: "Россия", nameEn: "Russia", flag: "🇷🇺", details: "Перевод по номеру карты Сбербанк / Тинькофф" },
  { id: "ua", name: "Украина", nameEn: "Ukraine", flag: "🇺", details: "Monobank / PrivatBank / IBAN" },
  { id: "kz", name: "Казахстан", nameEn: "Kazakhstan", flag: "🇰🇿", details: "Kaspi Bank / Halyk Bank" },
  { id: "by", name: "Беларусь", nameEn: "Belarus", flag: "🇧🇾", details: "Перевод на карту / ЕРИП" },
  { id: "uz", name: "Узбекистан", nameEn: "Uzbekistan", flag: "🇺", details: "Uzum Bank / Click / Payme" },
  { id: "ge", name: "Грузия", nameEn: "Georgia", flag: "🇬", details: "Bank of Georgia / TBC Bank" },
  { id: "am", name: "Армения", nameEn: "Armenia", flag: "🇦🇲", details: "Ameriabank / Ardshinbank" },
  { id: "az", name: "Азербайджан", nameEn: "Azerbaijan", flag: "🇦🇿", details: "Kapital Bank / Pasha Bank" },
  { id: "kg", name: "Кыргызстан", nameEn: "Kyrgyzstan", flag: "🇰🇬", details: "MBANK / Optima Bank" },
  { id: "md", name: "Молдова", nameEn: "Moldova", flag: "🇲", details: "Moldova Agroindbank / VTB" },
  { id: "tr", name: "Турция", nameEn: "Turkey", flag: "🇹🇷", details: "Garanti / Ziraat Bankası" },
  { id: "eu", name: "Европа (EU)", nameEn: "Europe", flag: "🇪🇺", details: "SEPA transfer / Revolut" },
];

function PaymentDetailsModal({ onClose, onRequestDetails, lang }) {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [sent, setSent] = useState(false);

  const handleSelectCountry = (country) => {
    setSelectedCountry(country);
  };

  const handleSendRequest = () => {
    if (!selectedCountry) return;
    onRequestDetails(selectedCountry);
    setSent(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  const getMessageText = () => {
    if (!selectedCountry) return "";
    const countryName = lang === "en" ? selectedCountry.nameEn : selectedCountry.name;
    return lang === "en"
      ? `Hi! I'd like to request payment details for ${countryName} ${selectedCountry.flag}. Please send me the card details.`
      : `Привет! Запрашиваю реквизиты для оплаты: ${countryName} ${selectedCountry.flag}. Пришли, пожалуйста, данные карты.`;
  };

  return (
    <>
      <style>{`
        @keyframes sheetSlideIn {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
        @keyframes sheetFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes checkmarkPop {
          0%   { transform: scale(0); }
          50%  { transform: scale(1.3); }
          100% { transform: scale(1); }
        }
      `}</style>

      {/* Scrim */}
      <div
        onClick={() => !sent && onClose()}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 99999,
          background: "rgba(2,3,7,0.70)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          animation: "sheetFadeIn 0.2s ease-out both",
        }}
      />

      {/* Bottom Sheet */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 100000,
          maxHeight: "80vh",
          overflow: "auto",
          background: "linear-gradient(180deg, rgba(20,22,40,0.98) 0%, rgba(10,11,20,0.99) 100%)",
          borderRadius: "24px 24px 0 0",
          borderTop: "1px solid rgba(99,102,241,0.18)",
          boxShadow: "0 -20px 60px rgba(0,0,0,0.5), 0 -2px 0 rgba(255,255,255,0.04) inset",
          animation: "sheetSlideIn 0.35s cubic-bezier(0.22,1,0.36,1) both",
        }}
      >
        {/* Drag Handle */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          padding: "14px 0 18px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}>
          <div style={{
            width: 36,
            height: 4,
            borderRadius: 999,
            background: "rgba(255,255,255,0.25)",
          }} />
        </div>

        {/* Content */}
        <div style={{ padding: "0 24px 32px" }}>

          {sent ? (
            /* Success State */
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "40px 0",
              animation: "sheetFadeIn 0.3s ease-out both",
            }}>
              <div style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #10b981, #059669)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 32,
                marginBottom: 20,
                boxShadow: "0 8px 24px rgba(16,185,129,0.4)",
                animation: "checkmarkPop 0.5s cubic-bezier(0.34,1.56,0.64,1) both",
              }}>
                ✓
              </div>
              <h3 style={{
                fontSize: 18,
                fontWeight: 900,
                color: "rgba(224,231,255,0.95)",
                margin: "0 0 8px",
                textAlign: "center",
              }}>
                {lang === "en" ? "Request sent!" : "Запрос отправлен!"}
              </h3>
              <p style={{
                fontSize: 13,
                color: "rgba(148,163,184,0.8)",
                margin: 0,
                textAlign: "center",
                lineHeight: 1.55,
              }}>
                {lang === "en"
                  ? "The designer will reply with payment details shortly."
                  : "Дизайнер ответит с реквизитами в ближайшее время."}
              </p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div style={{ textAlign: "center", marginBottom: 20, marginTop: 4 }}>
                <div style={{
                  width: 56,
                  height: 56,
                  borderRadius: 18,
                  background: "linear-gradient(135deg, rgba(99,102,241,0.20), rgba(139,92,246,0.15))",
                  border: "1px solid rgba(99,102,241,0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 14px",
                  fontSize: 24,
                  boxShadow: "0 6px 20px rgba(99,102,241,0.25)",
                }}>
                  💳
                </div>
                <h3 style={{
                  fontSize: 20,
                  fontWeight: 900,
                  color: "rgba(224,231,255,0.95)",
                  margin: "0 0 6px",
                  letterSpacing: "-0.02em",
                }}>
                  {lang === "en" ? "Payment details" : "Реквизиты для оплаты"}
                </h3>
                <p style={{
                  fontSize: 13,
                  color: "rgba(148,163,184,0.8)",
                  margin: 0,
                  lineHeight: 1.55,
                }}>
                  {lang === "en"
                    ? "Select your country and I'll send you the card details."
                    : "Выбери страну, и я пришлю реквизиты карты."}
                </p>
              </div>

              {/* Country List */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 8,
                marginBottom: 20,
                maxHeight: "40vh",
                overflowY: "auto",
              }}>
                {COUNTRIES.map((country) => {
                  const isSelected = selectedCountry?.id === country.id;
                  return (
                    <button
                      key={country.id}
                      onClick={() => handleSelectCountry(country)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "12px 14px",
                        borderRadius: 14,
                        border: `1px solid ${isSelected ? "rgba(99,102,241,0.50)" : "rgba(99,102,241,0.12)"}`,
                        background: isSelected
                          ? "rgba(99,102,241,0.15)"
                          : "rgba(255,255,255,0.03)",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        textAlign: "left",
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                          e.currentTarget.style.borderColor = "rgba(99,102,241,0.25)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                          e.currentTarget.style.borderColor = "rgba(99,102,241,0.12)";
                        }
                      }}
                    >
                      <span style={{ fontSize: 22, lineHeight: 1 }}>{country.flag}</span>
                      <div style={{ minWidth: 0 }}>
                        <div style={{
                          fontSize: 13,
                          fontWeight: 800,
                          color: isSelected ? "rgba(224,231,255,0.95)" : "rgba(200,210,255,0.85)",
                        }}>
                          {country.name}
                        </div>
                        {isSelected && (
                          <div style={{
                            fontSize: 10,
                            color: "rgba(148,163,184,0.7)",
                            marginTop: 2,
                          }}>
                            {country.details}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Selected country details */}
              {selectedCountry && (
                <div style={{
                  padding: "14px 16px",
                  borderRadius: 14,
                  background: "rgba(99,102,241,0.08)",
                  border: "1px solid rgba(99,102,241,0.20)",
                  marginBottom: 16,
                  animation: "sheetFadeIn 0.2s ease-out both",
                }}>
                  <div style={{ fontSize: 11, color: "rgba(148,163,184,0.7)", marginBottom: 4 }}>
                    {lang === "en" ? "Method" : "Способ оплаты"}
                  </div>
                  <div style={{ fontSize: 13, color: "rgba(224,231,255,0.90)", fontWeight: 700 }}>
                    {selectedCountry.details}
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={onClose}
                  style={{
                    flex: 1,
                    height: 48,
                    borderRadius: 16,
                    border: "1px solid rgba(99,102,241,0.18)",
                    background: "rgba(255,255,255,0.04)",
                    color: "rgba(200,210,255,0.85)",
                    fontSize: 14,
                    fontWeight: 800,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                    e.currentTarget.style.borderColor = "rgba(99,102,241,0.30)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                    e.currentTarget.style.borderColor = "rgba(99,102,241,0.18)";
                  }}
                >
                  {lang === "en" ? "Cancel" : "Отмена"}
                </button>
                <button
                  onClick={handleSendRequest}
                  disabled={!selectedCountry}
                  style={{
                    flex: 1.4,
                    height: 48,
                    borderRadius: 16,
                    border: "none",
                    background: selectedCountry
                      ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                      : "rgba(99,102,241,0.15)",
                    color: selectedCountry ? "#fff" : "rgba(200,210,255,0.35)",
                    fontSize: 14,
                    fontWeight: 900,
                    cursor: selectedCountry ? "pointer" : "not-allowed",
                    boxShadow: selectedCountry
                      ? "0 6px 22px rgba(99,102,241,0.40), inset 0 1px 0 rgba(255,255,255,0.15)"
                      : "none",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (selectedCountry) {
                      e.currentTarget.style.transform = "translateY(-1px)";
                      e.currentTarget.style.boxShadow = "0 8px 28px rgba(99,102,241,0.50), inset 0 1px 0 rgba(255,255,255,0.15)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedCountry) {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 6px 22px rgba(99,102,241,0.40), inset 0 1px 0 rgba(255,255,255,0.15)";
                    }
                  }}
                >
                  {lang === "en" ? "Get details" : "Получить реквизиты"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default PaymentDetailsModal;
