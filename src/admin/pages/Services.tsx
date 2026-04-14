import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "../../lib/supabase/client"
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label, Textarea } from "../components/ui"
import { useForm } from "react-hook-form"
import { Plus, Edit, Trash2 } from "lucide-react"

type ServiceItem = {
  id: string
  title: string
  slug: string
  short_description: string
  price_from: number
  delivery_time: string
  active: boolean
}

export function Services() {
  const queryClient = useQueryClient()
  const [editingId, setEditingId] = useState<string | null>(null)

  const { data: items, isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data, error } = await supabase.from('services').select('*').order('sort_order', { ascending: true })
      if (error) throw error
      return data as ServiceItem[]
    }
  })

  const form = useForm<Partial<ServiceItem>>({
    defaultValues: {
      title: "",
      slug: "",
      short_description: "",
      price_from: 0,
      delivery_time: "",
      active: true,
    }
  })

  const saveMutation = useMutation({
    mutationFn: async (values: Partial<ServiceItem>) => {
      if (editingId) {
        const { error } = await supabase.from('services').update(values).eq('id', editingId)
        if (error) throw error
      } else {
        const { error } = await supabase.from('services').insert([values])
        if (error) throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] })
      setEditingId(null)
      form.reset()
    }
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('services').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] })
    }
  })

  const onSubmit = (values: Partial<ServiceItem>) => {
    saveMutation.mutate(values)
  }

  const handleEdit = (item: ServiceItem) => {
    setEditingId(item.id)
    form.reset(item)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Services Management</h2>
        <Button onClick={() => { setEditingId(null); form.reset() }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Service
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1 border-r pr-6 space-y-4">
          <h3 className="font-semibold text-lg">{editingId ? 'Edit Service' : 'New Service'}</h3>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label>Service Title</Label>
              <Input {...form.register('title')} required />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input {...form.register('slug')} required />
            </div>
            <div className="space-y-2">
              <Label>Short Description</Label>
              <Textarea {...form.register('short_description')} />
            </div>
            <div className="space-y-2">
              <Label>Starting Price (USD)</Label>
              <Input type="number" step="0.01" {...form.register('price_from', { valueAsNumber: true })} required />
            </div>
            <div className="space-y-2">
              <Label>Delivery Time (e.g. 2-3 days)</Label>
              <Input {...form.register('delivery_time')} />
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="active" {...form.register('active')} />
              <Label htmlFor="active">Is Active?</Label>
            </div>
            <Button type="submit" disabled={saveMutation.isPending} className="w-full">
              {saveMutation.isPending ? 'Saving...' : 'Save Service'}
            </Button>
            {editingId && (
              <Button type="button" variant="outline" className="w-full" onClick={() => { setEditingId(null); form.reset() }}>
                Cancel Edit
              </Button>
            )}
          </form>
        </div>

        <div className="md:col-span-2 space-y-4">
          {isLoading ? (
            <p>Loading services...</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {items?.map(item => (
                <Card key={item.id} className={!item.active ? 'opacity-60' : ''}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => {
                        if (confirm('Delete this service?')) deleteMutation.mutate(item.id)
                      }}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{item.short_description}</p>
                    <div className="mt-4 flex items-center justify-between text-sm">
                      <span className="font-medium text-accent-500">From ${item.price_from}</span>
                      <span className="text-muted-foreground">{item.delivery_time}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {items?.length === 0 && <p className="text-muted-foreground">No services found.</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
