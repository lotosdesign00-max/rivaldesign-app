import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "../../lib/supabase/client"
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label, Textarea } from "../components/ui"
import { useForm } from "react-hook-form"

type SettingsData = {
  id: string
  site_name: string
  contact_email: string
  contact_phone: string
}

type HomepageContentData = {
  id: string
  hero_headline: string
  hero_subheadline: string
  about_text: string
}

export function Settings() {
  const queryClient = useQueryClient()

  const { data: settingsData, isLoading: isLoadingSettings } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const { data, error } = await supabase.from('settings').select('*').limit(1).maybeSingle()
      if (error && error.code !== 'PGRST116') throw error
      return (data || {}) as SettingsData
    }
  })

  const { data: homepageData, isLoading: isLoadingHome } = useQuery({
    queryKey: ['homepage_content'],
    queryFn: async () => {
      const { data, error } = await supabase.from('homepage_content').select('*').limit(1).maybeSingle()
      if (error && error.code !== 'PGRST116') throw error
      return (data || {}) as HomepageContentData
    }
  })

  const settingsForm = useForm<Partial<SettingsData>>({ values: settingsData })
  const homeForm = useForm<Partial<HomepageContentData>>({ values: homepageData })

  const saveSettings = useMutation({
    mutationFn: async (values: Partial<SettingsData>) => {
      if (settingsData?.id) {
        await supabase.from('settings').update(values).eq('id', settingsData.id)
      } else {
        await supabase.from('settings').insert([values])
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['settings'] })
  })

  const saveHomeContent = useMutation({
    mutationFn: async (values: Partial<HomepageContentData>) => {
      if (homepageData?.id) {
        await supabase.from('homepage_content').update(values).eq('id', homepageData.id)
      } else {
        await supabase.from('homepage_content').insert([values])
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['homepage_content'] })
  })

  if (isLoadingSettings || isLoadingHome) return <p>Loading settings...</p>

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Platform Settings</h2>
        <p className="text-muted-foreground">Manage global variables and homepage text here.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Global Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={settingsForm.handleSubmit((d) => saveSettings.mutate(d))} className="space-y-4">
              <div className="space-y-2">
                <Label>Site Name</Label>
                <Input {...settingsForm.register('site_name')} />
              </div>
              <div className="space-y-2">
                <Label>Contact Email</Label>
                <Input type="email" {...settingsForm.register('contact_email')} />
              </div>
              <div className="space-y-2">
                <Label>Contact Phone</Label>
                <Input {...settingsForm.register('contact_phone')} />
              </div>
              <Button type="submit" disabled={saveSettings.isPending}>
                {saveSettings.isPending ? "Saving..." : "Save Settings"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Homepage Content</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={homeForm.handleSubmit((d) => saveHomeContent.mutate(d))} className="space-y-4">
              <div className="space-y-2">
                <Label>Hero Headline</Label>
                <Input {...homeForm.register('hero_headline')} />
              </div>
              <div className="space-y-2">
                <Label>Hero Sub-headline</Label>
                <Textarea {...homeForm.register('hero_subheadline')} />
              </div>
              <div className="space-y-2">
                <Label>About Us Text</Label>
                <Textarea {...homeForm.register('about_text')} className="min-h-[150px]" />
              </div>
              <Button type="submit" disabled={saveHomeContent.isPending}>
                {saveHomeContent.isPending ? "Saving..." : "Save Homepage Content"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
