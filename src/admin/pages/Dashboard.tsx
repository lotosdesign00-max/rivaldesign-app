import { Card, CardContent, CardHeader, CardTitle } from "../components/ui"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "../../lib/supabase/client"
import { ShoppingCart, Image as ImageIcon, BookOpen, CreditCard } from "lucide-react"

export function Dashboard() {
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [
        { count: portfolioCount },
        { count: coursesCount },
        { count: ordersCount },
        { count: paymentsCount }
      ] = await Promise.all([
        supabase.from('portfolio_items').select('*', { count: 'exact', head: true }),
        supabase.from('courses').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'waiting_payment'),
        supabase.from('payments').select('*', { count: 'exact', head: true }).eq('status', 'paid')
      ])

      return {
        portfolio: portfolioCount || 0,
        courses: coursesCount || 0,
        newOrders: ordersCount || 0,
        paidPayments: paymentsCount || 0,
      }
    }
  })

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground mt-2">Here's an overview of your platform.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Items</CardTitle>
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.portfolio || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.courses || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.newOrders || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Payments</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.paidPayments || 0}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
