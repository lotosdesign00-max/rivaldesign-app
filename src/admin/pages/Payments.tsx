import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "../../lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle, Button, Label } from "../components/ui"
import { ExternalLink, CheckCircle } from "lucide-react"

export function Payments() {
  const queryClient = useQueryClient()
  
  const { data: payments, isLoading } = useQuery({
    queryKey: ['payments'],
    queryFn: async () => {
      const { data, error } = await supabase.from('payments').select('*, users(telegram_id, first_name)').order('created_at', { ascending: false })
      if (error) throw error
      return data
    }
  })

  // To manually mark payment as paid if webhook missed it
  const markAsPaidMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('payments').update({ status: 'paid', paid_at: new Date().toISOString() }).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['payments'] })
  })

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Payments</h2>

      <div className="grid gap-4">
        {isLoading ? <p>Loading payments...</p> : payments?.map((payment: any) => (
          <Card key={payment.id}>
            <CardContent className="p-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-lg">${payment.amount} {payment.currency}</span>
                  <span className={`text-xs px-2 py-0.5 rounded uppercase font-semibold ${payment.status === 'paid' ? 'bg-green-500/20 text-green-500' : 'bg-muted'}`}>
                    {payment.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">Payment ID: {payment.id}</p>
                <div className="text-sm">Client: {payment.users?.first_name || 'Client'} (ID: {payment.users?.telegram_id})</div>
                <p className="text-xs text-muted-foreground whitespace-nowrap mt-2">
                  Created: {new Date(payment.created_at).toLocaleString()}
                </p>
                {payment.status === 'paid' && payment.paid_at && (
                  <p className="text-xs text-green-500 whitespace-nowrap">
                    Paid at: {new Date(payment.paid_at).toLocaleString()}
                  </p>
                )}
              </div>
              <div className="flex flex-col items-end space-y-2 min-w-[150px]">
                <div className="text-sm">{payment.payment_method === 'cryptobot' ? 'CryptoBot' : payment.payment_method}</div>
                {payment.crypto_invoice_id && (
                  <div className="text-xs text-muted-foreground">Inv: {payment.crypto_invoice_id}</div>
                )}
                {payment.crypto_pay_url && (
                  <Button variant="link" size="sm" className="h-6 p-0" asChild>
                    <a href={payment.crypto_pay_url} target="_blank" rel="noreferrer">
                      View Invoice <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </Button>
                )}
                {payment.status !== 'paid' && (
                  <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => {
                    if (confirm('Manually mark this payment as paid?')) {
                      markAsPaidMutation.mutate(payment.id)
                    }
                  }}>
                    <CheckCircle className="w-4 h-4 mr-2" /> Mark Paid
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {payments?.length === 0 && <p className="text-muted-foreground">No payments yet.</p>}
      </div>
    </div>
  )
}
