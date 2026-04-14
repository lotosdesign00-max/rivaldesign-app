import React, { useMemo, useState } from "react";

const STATUS_META = {
  waiting_payment: { ru: "Ждет оплату", en: "Waiting for payment", color: "#f59e0b" },
  payment_review: { ru: "Платеж на проверке", en: "Payment in review", color: "#38bdf8" },
  queued: { ru: "В очереди", en: "Queued", color: "#a78bfa" },
  in_progress: { ru: "В работе", en: "In progress", color: "#6366f1" },
  preview_sent: { ru: "Превью отправлено", en: "Preview sent", color: "#c084fc" },
  revision: { ru: "Правки", en: "Revision", color: "#fb7185" },
  delivered: { ru: "Готово", en: "Delivered", color: "#10b981" },
  closed: { ru: "Закрыт", en: "Closed", color: "#94a3b8" },
};

const PAYMENT_META = {
  pending: { ru: "Ожидание", en: "Pending", color: "#f59e0b" },
  review: { ru: "Проверка", en: "Review", color: "#38bdf8" },
  paid: { ru: "Оплачено", en: "Paid", color: "#10b981" },
  canceled: { ru: "Отменено", en: "Canceled", color: "#94a3b8" },
};

const ORDER_STEPS = ["waiting_payment", "payment_review", "queued", "in_progress", "preview_sent", "revision", "delivered"];

function moneyUsd(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

function fmtDate(value, lang) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleString(lang === "en" ? "en-US" : "ru-RU", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return value;
  }
}

function statusLabel(id, lang) {
  return (STATUS_META[id] || STATUS_META.waiting_payment)[lang === "en" ? "en" : "ru"];
}

function paymentLabel(id, lang) {
  return (PAYMENT_META[id] || PAYMENT_META.pending)[lang === "en" ? "en" : "ru"];
}

function orderProgress(status) {
  const idx = ORDER_STEPS.indexOf(status);
  if (idx < 0) return 12;
  return Math.max(12, Math.min(100, ((idx + 1) / ORDER_STEPS.length) * 100));
}

function EmptyState({ th, title, text }) {
  return (
    <div
      style={{
        borderRadius: 24,
        border: `1px solid ${th.border}`,
        background: `linear-gradient(180deg, ${th.card} 0%, ${th.surface} 100%)`,
        padding: 22,
        textAlign: "center",
        boxShadow: "0 10px 28px rgba(0,0,0,.16)",
      }}
    >
      <div className="type-display" style={{ fontSize: 18, color: th.text, marginBottom: 6 }}>
        {title}
      </div>
      <div style={{ fontSize: 12.5, lineHeight: 1.6, color: th.sub }}>{text}</div>
    </div>
  );
}

function OrderCard({
  order,
  th,
  lang,
  drafts,
  setDrafts,
  onAddMessage,
  onOpenTelegram,
  onOpenCryptoBot,
  onMarkPaymentSubmitted,
  onRefreshInvoiceStatus,
}) {
  const [expanded, setExpanded] = useState(false);
  const status = STATUS_META[order.status] || STATUS_META.waiting_payment;
  const draft = drafts[order.id] || "";
  const paymentStatus = PAYMENT_META[order.paymentStatus || "pending"] || PAYMENT_META.pending;

  const sendDraft = () => {
    if (!draft.trim()) return;
    onAddMessage?.(order.id, "client", draft.trim());
    setDrafts((prev) => ({ ...prev, [order.id]: "" }));
  };

  return (
    <div
      style={{
        borderRadius: 26,
        border: `1px solid ${th.border}`,
        background: `linear-gradient(180deg, ${th.card} 0%, ${th.surface} 100%)`,
        padding: 18,
        boxShadow: "0 12px 34px rgba(0,0,0,.18)",
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
        <div style={{ minWidth: 0 }}>
          <div className="type-micro" style={{ color: th.sub, fontSize: 10 }}>
            {lang === "en" ? "Order" : "Заказ"} #{order.orderNo}
          </div>
          <div className="type-display" style={{ fontSize: 18, color: th.text, marginTop: 4 }}>
            {moneyUsd(order.totalUSD)}
          </div>
          <div style={{ fontSize: 12, color: th.sub, marginTop: 4 }}>
            {fmtDate(order.createdAt, lang)} · {order.deliveryLabel}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
          <span
            style={{
              padding: "7px 12px",
              borderRadius: 999,
              background: `${status.color}18`,
              border: `1px solid ${status.color}35`,
              color: status.color,
              fontSize: 11,
              fontWeight: 900,
              whiteSpace: "nowrap",
            }}
          >
            {statusLabel(order.status, lang)}
          </span>
          <span
            style={{
              padding: "6px 10px",
              borderRadius: 999,
              background: `${paymentStatus.color}12`,
              border: `1px solid ${paymentStatus.color}28`,
              color: paymentStatus.color,
              fontSize: 10,
              fontWeight: 800,
            }}
          >
            {paymentLabel(order.paymentStatus || "pending", lang)}
          </span>
        </div>
      </div>

      <div style={{ height: 8, borderRadius: 999, background: "rgba(255,255,255,.06)", overflow: "hidden" }}>
        <div
          style={{
            width: `${orderProgress(order.status)}%`,
            height: "100%",
            borderRadius: 999,
            background: `linear-gradient(90deg, ${status.color}, ${th.accentB})`,
            boxShadow: `0 0 20px ${status.color}40`,
            transition: "width .35s ease",
          }}
        />
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {order.items.map((item) => (
          <span
            key={`${order.id}_${item.id}`}
            style={{
              padding: "7px 12px",
              borderRadius: 999,
              background: "rgba(255,255,255,.05)",
              border: `1px solid ${th.border}`,
              color: th.text,
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            {item.icon} {item.name} ×{item.qty}
          </span>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {(order.status === "waiting_payment" || order.status === "payment_review") && (
          <button
            onClick={() => onMarkPaymentSubmitted?.(order.paymentId, order.id)}
            style={{
              flex: 1,
              minWidth: 150,
              height: 42,
              borderRadius: 14,
              border: `1px solid ${th.border}`,
              background: `linear-gradient(135deg, ${th.accent} 0%, ${th.accentB} 100%)`,
              color: th.btnTxt || "#fff",
              fontSize: 12,
              fontWeight: 900,
              cursor: "pointer",
            }}
          >
            {lang === "en" ? "I've paid" : "Я оплатил"}
          </button>
        )}

        {order.paymentMethod === "cryptobot" && order.cryptoInvoiceId && order.paymentStatus !== "paid" && (
          <button
            onClick={() => onRefreshInvoiceStatus?.(order.paymentId)}
            style={{
              flex: 1,
              minWidth: 150,
              height: 42,
              borderRadius: 14,
              border: `1px solid ${th.border}`,
              background: "rgba(255,255,255,.05)",
              color: th.text,
              fontSize: 12,
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            {lang === "en" ? "Check payment" : "Проверить оплату"}
          </button>
        )}

        {order.paymentMethod === "cryptobot" && (
          <button
            onClick={() => onOpenCryptoBot?.(order)}
            style={{
              flex: 1,
              minWidth: 150,
              height: 42,
              borderRadius: 14,
              border: `1px solid ${th.border}`,
              background: "rgba(255,255,255,.05)",
              color: th.text,
              fontSize: 12,
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            {lang === "en" ? "Open CryptoBot" : "Открыть CryptoBot"}
          </button>
        )}

        <button
          onClick={() => onOpenTelegram?.(order, "order")}
          style={{
            flex: 1,
            minWidth: 150,
            height: 42,
            borderRadius: 14,
            border: `1px solid ${th.border}`,
            background: "rgba(255,255,255,.05)",
            color: th.text,
            fontSize: 12,
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          {lang === "en" ? "Write in Telegram" : "Написать в Telegram"}
        </button>
      </div>

      {order.invoiceError && (
        <div
          style={{
            borderRadius: 14,
            border: "1px solid rgba(248,113,113,.28)",
            background: "rgba(127,29,29,.18)",
            color: "#fca5a5",
            fontSize: 11.5,
            lineHeight: 1.6,
            padding: "10px 12px",
          }}
        >
          {lang === "en" ? "Invoice error" : "Ошибка счета"}: {order.invoiceError}
        </div>
      )}

      <button
        onClick={() => setExpanded((prev) => !prev)}
        style={{
          height: 42,
          borderRadius: 14,
          border: `1px solid ${th.border}`,
          background: expanded ? `${th.accent}16` : "rgba(255,255,255,.04)",
          color: expanded ? th.accent : th.text,
          fontSize: 12,
          fontWeight: 800,
          cursor: "pointer",
        }}
      >
        {expanded
          ? lang === "en"
            ? "Hide details"
            : "Скрыть детали"
          : lang === "en"
            ? "Track order"
            : "Отслеживать заказ"}
      </button>

      {expanded && (
        <div style={{ display: "grid", gap: 14 }}>
          <div
            style={{
              borderRadius: 18,
              border: `1px solid ${th.border}`,
              background: "rgba(255,255,255,.035)",
              padding: 14,
              display: "grid",
              gap: 10,
            }}
          >
            <div className="type-micro" style={{ color: th.sub, fontSize: 10 }}>
              {lang === "en" ? "Timeline" : "Таймлайн"}
            </div>
            {order.timeline.map((entry) => (
              <div key={entry.id} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div
                  style={{
                    width: 10,
                    height: 10,
                    marginTop: 5,
                    borderRadius: "50%",
                    flexShrink: 0,
                    background: entry.color || status.color,
                    boxShadow: `0 0 14px ${(entry.color || status.color)}55`,
                  }}
                />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, color: th.text, fontWeight: 800 }}>{entry.title}</div>
                  {entry.text && <div style={{ fontSize: 11.5, color: th.sub, marginTop: 4, lineHeight: 1.5 }}>{entry.text}</div>}
                  <div style={{ fontSize: 10, color: th.sub, marginTop: 5 }}>{fmtDate(entry.at, lang)}</div>
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              borderRadius: 18,
              border: `1px solid ${th.border}`,
              background: "rgba(255,255,255,.035)",
              padding: 14,
              display: "grid",
              gap: 10,
            }}
          >
            <div className="type-micro" style={{ color: th.sub, fontSize: 10 }}>
              {lang === "en" ? "Mini chat" : "Мини-чат"}
            </div>
            <div style={{ display: "grid", gap: 8, maxHeight: 220, overflowY: "auto", paddingRight: 4 }}>
              {order.messages.map((message) => {
                const isClient = message.sender === "client";
                return (
                  <div
                    key={message.id}
                    style={{
                      justifySelf: isClient ? "end" : "start",
                      maxWidth: "88%",
                      borderRadius: 16,
                      padding: "10px 12px",
                      background: isClient ? `${th.accent}18` : "rgba(255,255,255,.06)",
                      border: `1px solid ${isClient ? `${th.accent}33` : th.border}`,
                    }}
                  >
                    <div style={{ fontSize: 11, color: isClient ? th.accent : th.sub, fontWeight: 800, marginBottom: 4 }}>
                      {isClient ? (lang === "en" ? "You" : "Вы") : "Rival"}
                    </div>
                    <div style={{ fontSize: 12.5, color: th.text, lineHeight: 1.55 }}>{message.text}</div>
                    <div style={{ fontSize: 10, color: th.sub, marginTop: 6 }}>{fmtDate(message.at, lang)}</div>
                  </div>
                );
              })}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                value={draft}
                onChange={(e) => setDrafts((prev) => ({ ...prev, [order.id]: e.target.value }))}
                placeholder={lang === "en" ? "Add a message for the designer" : "Напиши сообщение дизайнеру"}
                style={{
                  flex: 1,
                  height: 42,
                  borderRadius: 14,
                  border: `1px solid ${th.border}`,
                  background: "rgba(255,255,255,.04)",
                  color: th.text,
                  padding: "0 14px",
                  outline: "none",
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendDraft();
                }}
              />
              <button
                onClick={sendDraft}
                style={{
                  minWidth: 108,
                  height: 42,
                  borderRadius: 14,
                  border: `1px solid ${th.border}`,
                  background: `linear-gradient(135deg, ${th.accent} 0%, ${th.accentB} 100%)`,
                  color: th.btnTxt || "#fff",
                  fontSize: 12,
                  fontWeight: 900,
                  cursor: "pointer",
                }}
              >
                {lang === "en" ? "Send" : "Отправить"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ClientHub({
  th,
  lang,
  walletBalance,
  paymentHistory,
  orders,
  onRequestTopUp,
  onMarkPaymentSubmitted,
  onRefreshInvoiceStatus,
  onAddOrderMessage,
  onOpenCryptoBot,
  onOpenTelegram,
}) {
  const [section, setSection] = useState("balance");
  const [topupOpen, setTopupOpen] = useState(false);
  const [topupAmount, setTopupAmount] = useState("50");
  const [drafts, setDrafts] = useState({});

  const summary = useMemo(() => {
    const pendingOrders = orders.filter((order) => ["waiting_payment", "payment_review", "queued", "in_progress", "preview_sent", "revision"].includes(order.status)).length;
    const paidPayments = paymentHistory.filter((item) => item.status === "paid").length;
    return { pendingOrders, paidPayments };
  }, [orders, paymentHistory]);

  const recentPayments = paymentHistory.slice(0, 6);
  const recentOrders = orders.slice(0, 8);

  const submitTopUp = async () => {
    const payment = await onRequestTopUp?.(topupAmount);
    if (!payment) return;
    setTopupOpen(false);
    onOpenCryptoBot?.(payment);
  };

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div
        style={{
          borderRadius: 28,
          border: `1px solid ${th.border}`,
          background: `linear-gradient(180deg, ${th.card} 0%, ${th.surface} 100%)`,
          boxShadow: "0 16px 42px rgba(0,0,0,.18)",
          padding: 22,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", top: -60, right: -40, width: 180, height: 180, borderRadius: "50%", background: `radial-gradient(circle, ${th.glow} 0%, transparent 70%)`, pointerEvents: "none" }} />
        <div className="type-micro" style={{ color: th.sub, fontSize: 10 }}>
          {lang === "en" ? "Client desk" : "Клиентский кабинет"}
        </div>
        <div className="type-display" style={{ fontSize: 24, color: th.text, marginTop: 8 }}>
          {lang === "en" ? "Balance and orders" : "Баланс и заказы"}
        </div>
        <div style={{ fontSize: 12.5, lineHeight: 1.6, color: th.sub, marginTop: 8, maxWidth: 340 }}>
          {lang === "en"
            ? "Top up, keep payment drafts, follow progress and stay in touch inside the order card."
            : "Пополняй баланс, храни платежные черновики, отслеживай статус заказа и общайся прямо внутри карточки заказа."}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 10, marginTop: 18 }}>
          {[
            { label: lang === "en" ? "Balance" : "Баланс", value: moneyUsd(walletBalance) },
            { label: lang === "en" ? "Orders" : "Заказы", value: String(orders.length) },
            { label: lang === "en" ? "Paid" : "Платежи", value: String(summary.paidPayments) },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                borderRadius: 18,
                border: `1px solid ${th.border}`,
                background: "rgba(255,255,255,.04)",
                padding: "14px 12px",
              }}
            >
              <div className="type-micro" style={{ color: th.sub, fontSize: 9 }}>
                {item.label}
              </div>
              <div style={{ fontSize: 16, color: th.text, fontWeight: 900, marginTop: 8 }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {[
          { id: "balance", label: lang === "en" ? "Balance" : "Баланс" },
          { id: "orders", label: lang === "en" ? "Orders" : "Заказы" },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setSection(item.id)}
            style={{
              height: 46,
              borderRadius: 16,
              border: `1px solid ${section === item.id ? th.accent : th.border}`,
              background: section === item.id ? `${th.accent}16` : `linear-gradient(180deg, ${th.card} 0%, ${th.surface} 100%)`,
              color: section === item.id ? th.accent : th.text,
              fontSize: 13,
              fontWeight: 900,
              cursor: "pointer",
              boxShadow: section === item.id ? `0 10px 24px ${th.glow}` : "none",
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      {section === "balance" && (
        <>
          <div
            style={{
              borderRadius: 26,
              border: `1px solid ${th.border}`,
              background: `linear-gradient(180deg, ${th.card} 0%, ${th.surface} 100%)`,
              padding: 22,
              boxShadow: "0 12px 34px rgba(0,0,0,.18)",
            }}
          >
            <div className="type-micro" style={{ color: th.sub, fontSize: 10 }}>
              {lang === "en" ? "Wallet" : "Кошелек"}
            </div>
            <div className="type-display" style={{ fontSize: 34, color: th.text, marginTop: 10 }}>
              {moneyUsd(walletBalance)}
            </div>
            <div style={{ fontSize: 12.5, color: th.sub, lineHeight: 1.6, marginTop: 10 }}>
              {lang === "en"
                ? "Use the balance for instant payment inside the app or keep CryptoBot top-up drafts."
                : "Используй баланс для моментальной оплаты внутри приложения или храни черновики пополнения через CryptoBot."}
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
              <button
                onClick={() => setTopupOpen(true)}
                style={{
                  flex: 1,
                  minWidth: 180,
                  height: 46,
                  borderRadius: 16,
                  border: `1px solid ${th.border}`,
                  background: `linear-gradient(135deg, ${th.accent} 0%, ${th.accentB} 100%)`,
                  color: th.btnTxt || "#fff",
                  fontSize: 13,
                  fontWeight: 900,
                  cursor: "pointer",
                }}
              >
                {lang === "en" ? "Top up through CryptoBot" : "Пополнить через CryptoBot"}
              </button>
              <button
                onClick={() => onOpenTelegram?.(null, "balance")}
                style={{
                  flex: 1,
                  minWidth: 180,
                  height: 46,
                  borderRadius: 16,
                  border: `1px solid ${th.border}`,
                  background: "rgba(255,255,255,.05)",
                  color: th.text,
                  fontSize: 13,
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                {lang === "en" ? "Ask for manual details" : "Запросить реквизиты"}
              </button>
            </div>
          </div>

          {recentPayments.length ? (
            <div style={{ display: "grid", gap: 12 }}>
              {recentPayments.map((payment) => {
                const meta = PAYMENT_META[payment.status] || PAYMENT_META.pending;
                return (
                  <div
                    key={payment.id}
                    style={{
                      borderRadius: 22,
                      border: `1px solid ${th.border}`,
                      background: `linear-gradient(180deg, ${th.card} 0%, ${th.surface} 100%)`,
                      padding: 18,
                      boxShadow: "0 10px 28px rgba(0,0,0,.16)",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
                      <div>
                        <div className="type-micro" style={{ color: th.sub, fontSize: 10 }}>
                          {payment.type === "topup" ? (lang === "en" ? "Balance top-up" : "Пополнение баланса") : lang === "en" ? "Order payment" : "Оплата заказа"}
                        </div>
                        <div style={{ fontSize: 18, fontWeight: 900, color: th.text, marginTop: 6 }}>{moneyUsd(payment.amountUSD)}</div>
                        <div style={{ fontSize: 12, color: th.sub, marginTop: 4 }}>{fmtDate(payment.createdAt, lang)}</div>
                      </div>
                      <span
                        style={{
                          padding: "7px 12px",
                          borderRadius: 999,
                          background: `${meta.color}18`,
                          border: `1px solid ${meta.color}35`,
                          color: meta.color,
                          fontSize: 11,
                          fontWeight: 900,
                        }}
                      >
                        {paymentLabel(payment.status, lang)}
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
                      {payment.status !== "paid" && (
                        <button
                          onClick={() => onMarkPaymentSubmitted?.(payment.id, payment.orderId)}
                          style={{
                            minWidth: 140,
                            height: 40,
                            borderRadius: 14,
                            border: `1px solid ${th.border}`,
                            background: "rgba(255,255,255,.05)",
                            color: th.text,
                            fontSize: 12,
                            fontWeight: 800,
                            cursor: "pointer",
                          }}
                        >
                          {lang === "en" ? "I've paid" : "Я оплатил"}
                        </button>
                      )}
                      {payment.method === "cryptobot" && payment.cryptoInvoiceId && payment.status !== "paid" && (
                        <button
                          onClick={() => onRefreshInvoiceStatus?.(payment.id)}
                          style={{
                            minWidth: 150,
                            height: 40,
                            borderRadius: 14,
                            border: `1px solid ${th.border}`,
                            background: "rgba(255,255,255,.05)",
                            color: th.text,
                            fontSize: 12,
                            fontWeight: 800,
                            cursor: "pointer",
                          }}
                        >
                          {lang === "en" ? "Check payment" : "Проверить оплату"}
                        </button>
                      )}
                      {payment.method === "cryptobot" && (
                        <button
                          onClick={() => onOpenCryptoBot?.(payment)}
                          style={{
                            minWidth: 160,
                            height: 40,
                            borderRadius: 14,
                            border: `1px solid ${th.border}`,
                            background: "rgba(255,255,255,.05)",
                            color: th.text,
                            fontSize: 12,
                            fontWeight: 800,
                            cursor: "pointer",
                          }}
                        >
                          {lang === "en" ? "Open CryptoBot" : "Открыть CryptoBot"}
                        </button>
                      )}
                    </div>
                    {payment.invoiceError && (
                      <div
                        style={{
                          marginTop: 12,
                          borderRadius: 14,
                          border: "1px solid rgba(248,113,113,.28)",
                          background: "rgba(127,29,29,.18)",
                          color: "#fca5a5",
                          fontSize: 11.5,
                          lineHeight: 1.6,
                          padding: "10px 12px",
                        }}
                      >
                        {lang === "en" ? "Invoice error" : "Ошибка счета"}: {payment.invoiceError}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState
              th={th}
              title={lang === "en" ? "No payments yet" : "Платежей пока нет"}
              text={lang === "en" ? "Create your first balance top-up and it will appear here." : "Создай первое пополнение баланса, и оно появится здесь."}
            />
          )}
        </>
      )}

      {section === "orders" && (
        recentOrders.length ? (
          <div style={{ display: "grid", gap: 14 }}>
            {recentOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                th={th}
                lang={lang}
                drafts={drafts}
                setDrafts={setDrafts}
                onAddMessage={onAddOrderMessage}
                onOpenTelegram={onOpenTelegram}
                onOpenCryptoBot={onOpenCryptoBot}
                onMarkPaymentSubmitted={onMarkPaymentSubmitted}
                onRefreshInvoiceStatus={onRefreshInvoiceStatus}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            th={th}
            title={lang === "en" ? "No orders yet" : "Заказов пока нет"}
            text={lang === "en" ? "Create your first order in Pricing and tracking will appear here automatically." : "Оформи первый заказ во вкладке Прайс, и трекинг автоматически появится здесь."}
          />
        )
      )}

      {topupOpen && (
        <div
          onClick={() => setTopupOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9800,
            background: "rgba(2,3,7,.82)",
            backdropFilter: "blur(16px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "min(420px, calc(100vw - 28px))",
              borderRadius: 28,
              border: `1px solid ${th.border}`,
              background: `linear-gradient(180deg, ${th.card} 0%, ${th.surface} 100%)`,
              boxShadow: "0 24px 80px rgba(0,0,0,.45)",
              padding: 24,
            }}
          >
            <div className="type-display" style={{ fontSize: 22, color: th.text }}>
              {lang === "en" ? "Balance top-up" : "Пополнение баланса"}
            </div>
            <div style={{ fontSize: 12.5, color: th.sub, lineHeight: 1.6, marginTop: 8 }}>
              {lang === "en"
                ? "Enter the amount in USDT. We'll create a payment draft and open CryptoBot."
                : "Введи сумму в USDT. Мы создадим черновик пополнения и откроем CryptoBot."}
            </div>
            <div style={{ marginTop: 16 }}>
              <div className="type-micro" style={{ color: th.sub, fontSize: 10, marginBottom: 8 }}>
                {lang === "en" ? "Amount (USDT)" : "Сумма (USDT)"}
              </div>
              <input
                value={topupAmount}
                onChange={(e) => setTopupAmount(e.target.value.replace(/[^\d.]/g, ""))}
                style={{
                  width: "100%",
                  height: 48,
                  borderRadius: 16,
                  border: `1px solid ${th.border}`,
                  background: "rgba(255,255,255,.05)",
                  color: th.text,
                  padding: "0 16px",
                  fontSize: 18,
                  fontWeight: 900,
                  outline: "none",
                }}
              />
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
              <button
                onClick={() => setTopupOpen(false)}
                style={{
                  flex: 1,
                  height: 46,
                  borderRadius: 16,
                  border: `1px solid ${th.border}`,
                  background: "rgba(255,255,255,.05)",
                  color: th.text,
                  fontSize: 13,
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                {lang === "en" ? "Cancel" : "Отмена"}
              </button>
              <button
                onClick={submitTopUp}
                style={{
                  flex: 1.35,
                  height: 46,
                  borderRadius: 16,
                  border: `1px solid ${th.border}`,
                  background: `linear-gradient(135deg, ${th.accent} 0%, ${th.accentB} 100%)`,
                  color: th.btnTxt || "#fff",
                  fontSize: 13,
                  fontWeight: 900,
                  cursor: "pointer",
                }}
              >
                {lang === "en" ? "Create payment draft" : "Создать черновик платежа"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
