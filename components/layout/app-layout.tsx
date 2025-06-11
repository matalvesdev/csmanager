"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Sidebar } from "@/components/layout/sidebar"
import { Navbar } from "@/components/layout/navbar"
import { Loader2 } from "lucide-react"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const { usuario, isLoading } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)

  // Verificar se estamos no cliente
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Verificar autenticação
  useEffect(() => {
    if (isClient && !isLoading && !usuario && !pathname?.startsWith("/login")) {
      router.push("/login")
    }
  }, [usuario, isLoading, pathname, router, isClient])

  // Páginas que não precisam de autenticação
  const publicRoutes = ["/login"]
  const isPublicRoute = pathname ? publicRoutes.includes(pathname) : false

  if (!isClient) {
    return <>{children}</>
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  // Se é uma rota pública, mostrar apenas o conteúdo
  if (isPublicRoute) {
    return <>{children}</>
  }

  // Layout completo para usuários autenticados
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto bg-background">{children}</main>
      </div>
    </div>
  )
}
