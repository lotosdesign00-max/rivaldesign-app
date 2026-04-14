import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "../../lib/supabase/client"
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label, Textarea } from "../components/ui"
import { useForm } from "react-hook-form"
import { Plus, Edit, Trash2 } from "lucide-react"

type CourseItem = {
  id: string
  title: string
  slug: string
  short_description: string
  price: number
  status: 'draft' | 'published' | 'archived'
}

export function Courses() {
  const queryClient = useQueryClient()
  const [editingId, setEditingId] = useState<string | null>(null)

  const { data: items, isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const { data, error } = await supabase.from('courses').select('*').order('created_at', { ascending: false })
      if (error) throw error
      return data as CourseItem[]
    }
  })

  const form = useForm<Partial<CourseItem>>({
    defaultValues: {
      title: "",
      slug: "",
      short_description: "",
      price: 0,
      status: "draft",
    }
  })

  const saveMutation = useMutation({
    mutationFn: async (values: Partial<CourseItem>) => {
      if (editingId) {
        const { error } = await supabase.from('courses').update(values).eq('id', editingId)
        if (error) throw error
      } else {
        const { error } = await supabase.from('courses').insert([values])
        if (error) throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] })
      setEditingId(null)
      form.reset()
    }
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('courses').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] })
    }
  })

  const onSubmit = (values: Partial<CourseItem>) => {
    saveMutation.mutate(values)
  }

  const handleEdit = (item: CourseItem) => {
    setEditingId(item.id)
    form.reset(item)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Courses Management</h2>
        <Button onClick={() => { setEditingId(null); form.reset() }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Course
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1 border-r pr-6 space-y-4">
          <h3 className="font-semibold text-lg">{editingId ? 'Edit Course' : 'New Course'}</h3>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label>Course Title</Label>
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
              <Label>Price (USD)</Label>
              <Input type="number" step="0.01" {...form.register('price', { valueAsNumber: true })} required />
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
              {saveMutation.isPending ? 'Saving...' : 'Save Course'}
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
            <p>Loading courses...</p>
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
                        if (confirm('Delete this course?')) deleteMutation.mutate(item.id)
                      }}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{item.short_description}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="font-bold text-accent-500">${item.price}</span>
                      <span className="text-xs font-mono bg-muted px-2 py-1 rounded">{item.status}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {items?.length === 0 && <p className="text-muted-foreground">No courses found.</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
