import React, { useMemo, useState } from "react";
import ClientHub from "./ClientHub";
import PaymentDetailsModal from "./PaymentDetailsModal";

function moneyUsd(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

export default function OrdersTab({
  th,
  lang,
  walletBalance = 0,
  paymentHistory = [],
  orders = [],
  onRequestTopUp,
  onMarkPaymentSubmitted,
  onRefreshInvoiceStatus,
  onAddOrderMessage,
  onOpenCryptoBot,
  onOpenTelegram,
  onRequestPaymentDetails,
}) {
  const [paymentDetailsOpen, setPaymentDetailsOpen] = useState(false);
  const isEn = lang === "en";

  const copy = isEn
    ? {
        kicker: "Order desk",
        title: "Payments, queue and live order tracking",
        body:
          "One place for balance top-up, payment drafts, project statuses and direct communication inside every order.",
        active: "Active",
        paid: "Paid",
        pending: "Pending",
        wallet: "Balance",
        request: "Request details",
        telegram: "Open Telegram",
        requestHint: "Alternative payment details for cards and bank transfers.",
      }
    : {
        kicker: "??????? ???????",
        title: "??????, ??????? ? ????? ??????? ??????",
        body:
          "????? ??????? ??????, ????????? ?????, ??????? ???????? ? ?????? ???????????? ?????? ?????? ???????? ??????.",
        active: "????????",
        paid: "????????",
        pending: "???????",
        wallet: "??????",
        request: "????????? ?????????",
        telegram: "??????? Telegram",
        requestHint: "?????????????? ????????? ??? ???? ? ?????????? ?????????.",
      };

  const summary = useMemo(() => {
    const activeOrders = (orders || []).filter((order) =>
      ["waiting_payment", "payment_review", "queued", "in_progress", "preview_sent", "revision"].includes(order.status)
    ).length;
    const paidPayments = (paymentHistory || []).filter((item) => item.status === "paid").length;
    const pendingPayments = (paymentHistory || []).filter((item) => ["pending", "review"].includes(item.status)).length;
    return { activeOrders, paidPayments, pendingPayments };
  }, [orders, paymentHistory]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 30,
          border: `1px solid ${th.border}`,
          background: `linear-gradient(180deg, ${th.card} 0%, ${th.surface} 100%)`,
          boxShadow: "0 20px 48px rgba(0,0,0,.26), inset 0 1px 0 rgba(255,255,255,.05)",
          padding: "24px 20px",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              th.id === "graphite"
                ? "linear-gradient(180deg, rgba(255,255,255,.04) 0%, transparent 28%)"
                : "radial-gradient(circle at 82% 18%, rgba(99,102,241,.18) 0%, transparent 26%), linear-gradient(180deg, rgba(255,255,255,.03) 0%, transparent 28%)",
          }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div className="type-micro" style={{ fontSize: 9, color: th.sub, marginBottom: 10 }}>
            {copy.kicker}
          </div>
          <div className="type-display" style={{ fontSize: 28, color: th.text, lineHeight: 1.04, marginBottom: 10 }}>
            {copy.title}
          </div>
          <div style={{ maxWidth: 420, color: th.sub, fontSize: 13, lineHeight: 1.7, marginBottom: 18 }}>
            {copy.body}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 10, marginBottom: 16 }}>
            {[
              { label: copy.wallet, value: moneyUsd(walletBalance) },
              { label: copy.active, value: String(summary.activeOrders) },
              { label: copy.pending, value: String(summary.pendingPayments) },
              { label: copy.paid, value: String(summary.paidPayments) },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  borderRadius: 18,
                  border: `1px solid ${th.border}`,
                  background: "rgba(255,255,255,.04)",
                  padding: "14px 12px",
                  minWidth: 0,
                }}
              >
                <div className="type-micro" style={{ fontSize: 8.5, color: th.sub }}>
                  {item.label}
                </div>
                <div style={{ fontSize: 16, color: th.text, fontWeight: 900, marginTop: 8, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              onClick={() => setPaymentDetailsOpen(true)}
              style={{
                minHeight: 46,
                padding: "0 18px",
                borderRadius: 16,
                border: `1px solid ${th.border}`,
                background: `linear-gradient(135deg, ${th.accent} 0%, ${th.accentB} 100%)`,
                color: th.btnTxt || "#fff",
                fontSize: 12.5,
                fontWeight: 900,
                cursor: "pointer",
              }}
            >
              {copy.request}
            </button>
            <button
              onClick={() => onOpenTelegram?.(null, "orders")}
              style={{
                minHeight: 46,
                padding: "0 18px",
                borderRadius: 16,
                border: `1px solid ${th.border}`,
                background: "rgba(255,255,255,.05)",
                color: th.text,
                fontSize: 12.5,
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              {copy.telegram}
            </button>
          </div>
          <div style={{ fontSize: 11.5, color: th.sub, marginTop: 12, lineHeight: 1.6 }}>
            {copy.requestHint}
          </div>
        </div>
      </section>

      <ClientHub
        th={th}
        lang={lang}
        walletBalance={walletBalance}
        paymentHistory={paymentHistory}
        orders={orders}
        onRequestTopUp={onRequestTopUp}
        onMarkPaymentSubmitted={onMarkPaymentSubmitted}
        onRefreshInvoiceStatus={onRefreshInvoiceStatus}
        onAddOrderMessage={onAddOrderMessage}
        onOpenCryptoBot={onOpenCryptoBot}
        onOpenTelegram={onOpenTelegram}
      />

      {paymentDetailsOpen && (
        <PaymentDetailsModal
          onClose={() => setPaymentDetailsOpen(false)}
          onRequestDetails={(country) => onRequestPaymentDetails?.(country)}
          lang={lang}
        />
      )}
    </div>
  );
}
