"use client"

import { useTheme } from "next-themes"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Moon, Sun, User, Settings, LogOut, Shield, Bell } from "lucide-react"
import { Notificacoes } from "@/components/layout/notificacoes"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { useWebSocket } from "@/hooks/use-websocket"

export function Navbar() {
  const { theme, setTheme } = useTheme()
  const { usuario, logout, isAdmin } = useAuth()
  const { containerEvents = [], isConnected = false } = useWebSocket() // Valores padrão seguros

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      case "moderador":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "organizador":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  if (!usuario) return null

  // Verificações de segurança
  const eventsCount = Array.isArray(containerEvents) ? containerEvents.length : 0
  const hasEvents = eventsCount > 0

  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4">
        {/* Status de Conexão */}
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
          <span className="text-xs text-muted-foreground hidden sm:inline">{isConnected ? "Online" : "Offline"}</span>

          {/* Eventos em tempo real */}
          {hasEvents && (
            <Badge variant="outline" className="text-xs">
              {eventsCount} eventos
            </Badge>
          )}
        </div>

        <div className="ml-auto flex items-center space-x-2">
          {/* Notificações */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {hasEvents && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                    {eventsCount > 9 ? "9+" : eventsCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="end">
              <DropdownMenuLabel>Notificações do Sistema</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {hasEvents ? (
                containerEvents.slice(0, 5).map((event, index) => (
                  <DropdownMenuItem key={event.id || index} className="flex flex-col items-start">
                    <span className="font-medium capitalize">{event.action}</span>
                    <span className="text-sm text-muted-foreground">{event.container}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </span>
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem disabled>Nenhuma notificação recente</DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Notificacoes />

          {/* Toggle de Tema */}
          <Button variant="outline" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          <Separator orientation="vertical" className="h-6" />

          {/* Menu do Usuário */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={usuario.avatar || "/placeholder.svg"} alt={usuario.nome} />
                  <AvatarFallback>{usuario.nome.charAt(0)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-2">
                  <p className="text-sm font-medium leading-none">{usuario.nome}</p>
                  <p className="text-xs leading-none text-muted-foreground">{usuario.email}</p>
                  <Badge variant="outline" className={`w-fit ${getRoleBadgeColor(usuario.role)}`}>
                    {usuario.role === "admin" && <Shield className="mr-1 h-3 w-3" />}
                    <span className="capitalize">{usuario.role}</span>
                  </Badge>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              {isAdmin() && (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/admin">
                      <Shield className="mr-2 h-4 w-4" />
                      Painel Admin
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/admin/usuarios">
                      <User className="mr-2 h-4 w-4" />
                      Gestão de Usuários
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}

              <DropdownMenuItem asChild>
                <Link href="/configuracoes/integracoes">
                  <Settings className="mr-2 h-4 w-4" />
                  Configurações
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={logout} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
