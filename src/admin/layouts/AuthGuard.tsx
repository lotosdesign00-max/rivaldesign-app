import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../../lib/supabase/client"
import { Button, Input, Label, Card, CardContent, CardHeader, CardTitle } from "../components/ui"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        checkAdminRole(session.user.id)
      } else {
        setLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        checkAdminRole(session.user.id)
      } else {
        setAuthenticated(false)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const checkAdminRole = async (userId: string) => {
    // Rely on simple check: Admin Auth on web should have records in DB.
    // If not, at least they are logged in. 
    // In strict production, check `users.is_admin` or JWT claims.
    const { data } = await supabase.from('users').select('is_admin').eq('id', userId).single()
    if (data?.is_admin) {
      setAuthenticated(true)
    } else {
      // Not admin - kick out
      await supabase.auth.signOut()
      setAuthenticated(false)
    }
    setLoading(false)
  }

  if (loading) return <div className="p-8">Checking auth...</div>

  if (!authenticated) {
    return <AdminLogin />
  }

  return <>{children}</>
}

function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError) {
      setError(authError.message)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Admin Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
