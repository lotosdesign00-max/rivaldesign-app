import React, { useState } from "react";
import ClientHub from "./ClientHub";
import PaymentDetailsModal from "./PaymentDetailsModal";

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
  onOpenStarsInvoice,
  onOpenTelegram,
  onRequestPaymentDetails,
}) {
  const [paymentDetailsOpen, setPaymentDetailsOpen] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
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
        onOpenStarsInvoice={onOpenStarsInvoice}
        onOpenTelegram={onOpenTelegram}
        onOpenPaymentDetails={() => setPaymentDetailsOpen(true)}
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
