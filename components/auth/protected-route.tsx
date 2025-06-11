"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredPermission?: string
  adminOnly?: boolean
}

export function ProtectedRoute({ children, requiredPermission, adminOnly = false }: ProtectedRouteProps) {
  const { usuario, isLoading, hasPermission, isAdmin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !usuario) {
      router.push("/login")
      return
    }

    if (!isLoading && usuario) {
      if (adminOnly && !isAdmin()) {
        router.push("/")
        return
      }

      if (requiredPermission && !hasPermission(requiredPermission)) {
        router.push("/")
        return
      }
    }
  }, [usuario, isLoading, router, requiredPermission, adminOnly, hasPermission, isAdmin])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Verificando permissões...</p>
        </div>
      </div>
    )
  }

  if (!usuario) {
    return null
  }

  if (adminOnly && !isAdmin()) {
    return null
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return null
  }

  return <>{children}</>
}
