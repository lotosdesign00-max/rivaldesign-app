import { Outlet, NavLink, useNavigate } from "react-router-dom"
import { supabase } from "../../lib/supabase/client"
import { Button } from "../components/ui"
import { LayoutDashboard, Image as ImageIcon, BookOpen, Briefcase, MessageSquare, Settings, CreditCard, ShoppingCart, LogOut } from "lucide-react"

export function AdminLayout() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate("/auth")
  }

  const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Portfolio", href: "/portfolio", icon: ImageIcon },
    { name: "Courses", href: "/courses", icon: BookOpen },
    { name: "Services", href: "/services", icon: Briefcase },
    { name: "Orders", href: "/orders", icon: ShoppingCart },
    { name: "Payments", href: "/payments", icon: CreditCard },
    { name: "Testimonials", href: "/testimonials", icon: MessageSquare },
    { name: "Settings", href: "/settings", icon: Settings },
  ]

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card flex flex-col">
        <div className="p-6 border-b border-border">
          <h1 className="text-xl font-bold tracking-tight">Rival Admin</h1>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-border">
          <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground" onClick={handleLogout}>
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border flex items-center justify-between px-8 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center space-x-4">
            {/* Header left */}
          </div>
          <div className="flex items-center space-x-4">
            {/* Header right */}
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
              A
            </div>
          </div>
        </header>
        <div className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
