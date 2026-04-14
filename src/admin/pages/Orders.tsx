import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "../../lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Label, Textarea } from "../components/ui"
import { ExternalLink, Edit } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"

export function Orders() {
  const queryClient = useQueryClient()
  const [editingOrder, setEditingOrder] = useState<any | null>(null)
  
  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data, error } = await supabase.from('orders').select('*, users(telegram_id, first_name), payments(status, amount)').order('created_at', { ascending: false })
      if (error) throw error
      return data
    }
  })

  const form = useForm({
    defaultValues: { status: "", designer_notes: "", delivery_url: "" }
  })

  const updateMutation = useMutation({
    mutationFn: async (values: any) => {
      const { error } = await supabase.from('orders').update(values).eq('id', editingOrder.id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      setEditingOrder(null)
      form.reset()
    }
  })

  const handleEdit = (order: any) => {
    setEditingOrder(order)
    form.reset({
      status: order.status,
      designer_notes: order.designer_notes || "",
      delivery_url: order.delivery_url || ""
    })
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Orders</h2>

      {editingOrder ? (
        <Card>
          <CardHeader>
            <CardTitle>Edit Order {editingOrder.id.split('-')[0]}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit((d) => updateMutation.mutate(d))} className="space-y-4 max-w-lg">
              <div className="space-y-2">
                <Label>Status</Label>
                <select 
                  {...form.register('status')} 
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                >
                  <option value="waiting_payment">Waiting Payment</option>
                  <option value="queued">Queued</option>
                  <option value="in_progress">In Progress</option>
                  <option value="preview_sent">Preview Sent</option>
                  <option value="revision">Revision</option>
                  <option value="delivered">Delivered</option>
                  <option value="closed">Closed / Cancelled</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Designer Notes</Label>
                <Textarea {...form.register('designer_notes')} />
              </div>
              <div className="space-y-2">
                <Label>Delivery URL (Figma, Drive etc)</Label>
                <Input {...form.register('delivery_url')} />
              </div>
              <div className="flex space-x-2 pt-2">
                <Button type="submit" disabled={updateMutation.isPending}>Save Changes</Button>
                <Button type="button" variant="outline" onClick={() => setEditingOrder(null)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {isLoading ? <p>Loading orders...</p> : orders?.map((order: any) => (
            <Card key={order.id}>
              <CardContent className="p-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-lg">{order.service_name}</span>
                    <span className="text-xs bg-muted px-2 py-0.5 rounded uppercase">{order.status}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Order ID: {order.id}</p>
                  <div className="text-sm">Client: {order.users?.first_name || 'Client'} (ID: {order.users?.telegram_id})</div>
                  <p className="text-sm mt-2"><span className="font-semibold">Brief:</span> {order.brief || "No brief provided"}</p>
                </div>
                <div className="flex flex-col items-end space-y-2 min-w-[200px]">
                  <div className="text-xl font-bold">${order.total_amount}</div>
                  <div className="text-xs text-muted-foreground flex items-center">
                    Payment Status: <span className="ml-1 uppercase font-semibold text-foreground">{order.payments?.status || 'N/A'}</span>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => handleEdit(order)}>
                    <Edit className="w-4 h-4 mr-2" /> Edit Order
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {orders?.length === 0 && <p className="text-muted-foreground">No orders yet.</p>}
        </div>
      )}
    </div>
  )
}
