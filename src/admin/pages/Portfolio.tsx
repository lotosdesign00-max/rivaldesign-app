import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "../../lib/supabase/client"
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label, Textarea } from "../components/ui"
import { useForm } from "react-hook-form"
import { Plus, Edit, Trash2 } from "lucide-react"

type PortfolioItem = {
  id: string
  title: string
  slug: string
  short_description: string
  full_description: string
  status: 'draft' | 'published' | 'archived'
}

export function Portfolio() {
  const queryClient = useQueryClient()
  const [editingId, setEditingId] = useState<string | null>(null)

  const { data: items, isLoading } = useQuery({
    queryKey: ['portfolio'],
    queryFn: async () => {
      const { data, error } = await supabase.from('portfolio_items').select('*').order('created_at', { ascending: false })
      if (error) throw error
      return data as PortfolioItem[]
    }
  })

  const form = useForm<Partial<PortfolioItem>>({
    defaultValues: {
      title: "",
      slug: "",
      short_description: "",
      status: "draft",
    }
  })

  const saveMutation = useMutation({
    mutationFn: async (values: Partial<PortfolioItem>) => {
      if (editingId) {
        const { error } = await supabase.from('portfolio_items').update(values).eq('id', editingId)
        if (error) throw error
      } else {
        const { error } = await supabase.from('portfolio_items').insert([values])
        if (error) throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] })
      setEditingId(null)
      form.reset()
    }
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('portfolio_items').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] })
    }
  })

  const onSubmit = (values: Partial<PortfolioItem>) => {
    saveMutation.mutate(values)
  }

  const handleEdit = (item: PortfolioItem) => {
    setEditingId(item.id)
    form.reset(item)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Portfolio Management</h2>
        <Button onClick={() => { setEditingId(null); form.reset() }}>
          <Plus className="w-4 h-4 mr-2" />
          Add New
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1 border-r pr-6 space-y-4">
          <h3 className="font-semibold text-lg">{editingId ? 'Edit Item' : 'New Item'}</h3>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
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
              <Label>Status</Label>
              <select 
                {...form.register('status')} 
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <Button type="submit" disabled={saveMutation.isPending} className="w-full">
              {saveMutation.isPending ? 'Saving...' : 'Save Item'}
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
            <p>Loading items...</p>
          ) : (
            <div className="grid gap-4">
              {items?.map(item => (
                <Card key={item.id}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => {
                        if (confirm('Are you sure you want to delete this?')) {
                          deleteMutation.mutate(item.id)
                        }
                      }}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{item.short_description}</p>
                    <div className="mt-2 text-xs font-mono bg-muted inline-flex px-2 py-1 rounded">{item.status}</div>
                  </CardContent>
                </Card>
              ))}
              {items?.length === 0 && <p className="text-muted-foreground">No portfolio items found.</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
