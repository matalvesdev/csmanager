"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { BackupDashboard } from "@/components/backup/backup-dashboard"

export default function BackupPage() {
  return (
    <ProtectedRoute adminOnly>
      <div className="container py-6 space-y-6">
        <Breadcrumb items={[{ label: "Admin", href: "/admin" }, { label: "Backup & Restore" }]} />

        <div>
          <h1 className="text-3xl font-bold">Backup & Restore</h1>
          <p className="text-muted-foreground">Gerencie backups automáticos e restauração de dados</p>
        </div>

        <BackupDashboard />
      </div>
    </ProtectedRoute>
  )
}
