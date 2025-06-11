"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import {
  Bell,
  Database,
  LayoutDashboard,
  Server,
  Settings,
  Shield,
  Trophy,
  Calendar,
  Users,
  UserCheck,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface NavItem {
  name: string
  href: string
  icon: any
  permission?: string
  adminOnly?: boolean
  badge?: string
}

const navItems: NavItem[] = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Torneios",
    href: "/torneios",
    icon: Trophy,
    permission: "torneios.visualizar",
  },
  {
    name: "Partidas",
    href: "/partidas",
    icon: Calendar,
    permission: "partidas.visualizar",
  },
  {
    name: "Jogadores",
    href: "/jogadores",
    icon: Users,
    permission: "jogadores.visualizar",
  },
]

const adminItems: NavItem[] = [
  {
    name: "Painel Admin",
    href: "/admin",
    icon: Shield,
    adminOnly: true,
    badge: "Admin",
  },
  {
    name: "Usuários",
    href: "/admin/usuarios",
    icon: UserCheck,
    adminOnly: true,
  },
  {
    name: "Infraestrutura",
    href: "/admin/infraestrutura",
    icon: Server,
    adminOnly: true,
  },
  {
    name: "Servidores",
    href: "/admin/servidores",
    icon: Settings,
    adminOnly: true,
  },
  {
    name: "Backup",
    href: "/admin/backup",
    icon: Database,
    adminOnly: true,
  },
  {
    name: "Alertas",
    href: "/admin/alertas",
    icon: Bell,
    adminOnly: true,
  },
]

const configItems: NavItem[] = [
  {
    name: "Integrações",
    href: "/configuracoes/integracoes",
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { usuario, hasPermission, isAdmin } = useAuth()

  const canAccessItem = (item: NavItem) => {
    if (item.adminOnly && !isAdmin()) return false
    if (item.permission && !hasPermission(item.permission)) return false
    return true
  }

  const isActiveRoute = (href: string) => {
    return pathname === href || pathname.startsWith(href + "/")
  }

  if (!usuario) return null

  return (
    <div className="flex flex-col w-64 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold">CS 1.6 Tournament</h1>
        <p className="text-xs text-muted-foreground">v1.2.3</p>
      </div>

      <nav className="flex-1 p-4 space-y-6">
        {/* Navegação Principal */}
        <div className="space-y-2">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Principal</h2>
          {navItems.filter(canAccessItem).map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActiveRoute(item.href) ? "secondary" : "ghost"}
                className={cn("w-full justify-start", isActiveRoute(item.href) && "bg-secondary")}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.name}
                {item.badge && (
                  <Badge variant="secondary" className="ml-auto">
                    {item.badge}
                  </Badge>
                )}
              </Button>
            </Link>
          ))}
        </div>

        {/* Administração */}
        {isAdmin() && (
          <>
            <Separator />
            <div className="space-y-2">
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Administração</h2>
              {adminItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActiveRoute(item.href) ? "secondary" : "ghost"}
                    className={cn("w-full justify-start", isActiveRoute(item.href) && "bg-secondary")}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                    {item.badge && (
                      <Badge variant="destructive" className="ml-auto text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </Button>
                </Link>
              ))}
            </div>
          </>
        )}

        {/* Configurações */}
        <Separator />
        <div className="space-y-2">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Configurações</h2>
          {configItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActiveRoute(item.href) ? "secondary" : "ghost"}
                className={cn("w-full justify-start", isActiveRoute(item.href) && "bg-secondary")}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.name}
              </Button>
            </Link>
          ))}
        </div>
      </nav>

      <div className="p-4 border-t">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500"></div>
          <span className="text-xs text-muted-foreground">Sistema Online</span>
        </div>
      </div>
    </div>
  )
}
