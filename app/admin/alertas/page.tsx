"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { AlertCenter } from "@/components/alerts/alert-center"

export default function AlertasPage() {
  return (
    <ProtectedRoute adminOnly>
      <div className="container py-6 space-y-6">
        <Breadcrumb items={[{ label: "Admin", href: "/admin" }, { label: "Central de Alertas" }]} />

        <div>
          <h1 className="text-3xl font-bold">Central de Alertas</h1>
          <p className="text-muted-foreground">Monitore alertas do sistema e configure notificações</p>
        </div>

        <AlertCenter />
      </div>
    </ProtectedRoute>
  )
}
