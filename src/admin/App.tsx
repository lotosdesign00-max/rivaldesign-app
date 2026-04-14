import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { AdminLayout } from "./layouts/AdminLayout"
import { Dashboard } from "./pages/Dashboard"
import { Portfolio } from "./pages/Portfolio"
import { Courses } from "./pages/Courses"
import { Services } from "./pages/Services"
import { Orders } from "./pages/Orders"
import { Payments } from "./pages/Payments"
import { Testimonials } from "./pages/Testimonials"
import { Settings } from "./pages/Settings"

import { AuthGuard } from "./layouts/AuthGuard"
import { TmaProvider } from "./tma/TmaProvider"

const queryClient = new QueryClient()

export function AdminApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <TmaProvider>
        <AuthGuard>
          <BrowserRouter basename="/admin">
            <Routes>
              <Route path="/" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="portfolio" element={<Portfolio />} />
            <Route path="courses" element={<Courses />} />
            <Route path="services" element={<Services />} />
            <Route path="orders" element={<Orders />} />
            <Route path="payments" element={<Payments />} />
            <Route path="testimonials" element={<Testimonials />} />
            <Route path="settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthGuard>
      </TmaProvider>
    </QueryClientProvider>
  )
}
