import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "../../lib/supabase/client"
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label, Textarea } from "../components/ui"
import { useForm } from "react-hook-form"
import { Plus, Edit, Trash2 } from "lucide-react"

type TestimonialItem = {
  id: string
  client_name: string
  client_role: string
  company: string
  avatar: string
  content: string
  rating: number
  visible: boolean
}

export function Testimonials() {
  const queryClient = useQueryClient()
  const [editingId, setEditingId] = useState<string | null>(null)

  const { data: items, isLoading } = useQuery({
    queryKey: ['testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false })
      if (error) throw error
      return data as TestimonialItem[]
    }
  })

  const form = useForm<Partial<TestimonialItem>>({
    defaultValues: {
      client_name: "",
      client_role: "",
      company: "",
      content: "",
      rating: 5,
      visible: true,
    }
  })

  const saveMutation = useMutation({
    mutationFn: async (values: Partial<TestimonialItem>) => {
      if (editingId) {
        const { error } = await supabase.from('testimonials').update(values).eq('id', editingId)
        if (error) throw error
      } else {
        const { error } = await supabase.from('testimonials').insert([values])
        if (error) throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] })
      setEditingId(null)
      form.reset()
    }
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('testimonials').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] })
    }
  })

  const onSubmit = (values: Partial<TestimonialItem>) => {
    saveMutation.mutate(values)
  }

  const handleEdit = (item: TestimonialItem) => {
    setEditingId(item.id)
    form.reset(item)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Testimonials</h2>
        <Button onClick={() => { setEditingId(null); form.reset() }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Testimonial
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1 border-r pr-6 space-y-4">
          <h3 className="font-semibold text-lg">{editingId ? 'Edit Testimonial' : 'New Testimonial'}</h3>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label>Client Name</Label>
              <Input {...form.register('client_name')} required />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Input {...form.register('client_role')} />
            </div>
            <div className="space-y-2">
              <Label>Company</Label>
              <Input {...form.register('company')} />
            </div>
            <div className="space-y-2">
              <Label>Content / Quote</Label>
              <Textarea {...form.register('content')} required />
            </div>
            <div className="space-y-2">
              <Label>Rating (1-5)</Label>
              <Input type="number" min="1" max="5" {...form.register('rating', { valueAsNumber: true })} />
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="visible" {...form.register('visible')} />
              <Label htmlFor="visible">Is Visible?</Label>
            </div>
            <Button type="submit" disabled={saveMutation.isPending} className="w-full">
              {saveMutation.isPending ? 'Saving...' : 'Save Testimonial'}
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
            <p>Loading testimonials...</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {items?.map(item => (
                <Card key={item.id} className={!item.visible ? 'opacity-60' : ''}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg">{item.client_name}</CardTitle>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => {
                        if (confirm('Delete this testimonial?')) deleteMutation.mutate(item.id)
                      }}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground mb-2">{item.client_role} | {item.company}</p>
                    <p className="text-sm italic">"{item.content}"</p>
                    <div className="mt-4 text-xs font-mono bg-muted inline-flex px-2 py-1 rounded">Rating: {item.rating}/5</div>
                  </CardContent>
                </Card>
              ))}
              {items?.length === 0 && <p className="text-muted-foreground">No testimonials found.</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
