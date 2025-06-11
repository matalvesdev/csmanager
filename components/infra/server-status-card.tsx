"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Square, RotateCcw, Eye, Users, Cpu, MemoryStick } from "lucide-react"
import type { Server } from "@/types/infra"

interface ServerStatusCardProps {
  server: Server
  onStart: (id: string) => void
  onStop: (id: string) => void
  onRestart: (id: string) => void
  onViewDetails: (id: string) => void
}

export function ServerStatusCard({ server, onStart, onStop, onRestart, onViewDetails }: ServerStatusCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "default"
      case "offline":
        return "destructive"
      case "starting":
        return "secondary"
      case "stopping":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
      case "offline":
        return <div className="w-2 h-2 bg-red-500 rounded-full" />
      case "starting":
        return <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
      case "stopping":
        return <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
      default:
        return <div className="w-2 h-2 bg-gray-500 rounded-full" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{server.name}</CardTitle>
          <div className="flex items-center gap-2">
            {getStatusIcon(server.status)}
            <Badge variant={getStatusColor(server.status)}>{server.status}</Badge>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          {server.ip}:{server.port} • {server.type}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Métricas do Servidor */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{server.players}/32</span>
          </div>
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{server.cpu.toFixed(1)}%</span>
          </div>
          <div className="flex items-center gap-2">
            <MemoryStick className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{server.memory}MB</span>
          </div>
          <div className="text-sm text-muted-foreground">Uptime: {Math.floor(server.uptime / 3600)}h</div>
        </div>

        {/* Ações */}
        <div className="flex gap-2">
          {server.status === "offline" && (
            <Button size="sm" onClick={() => onStart(server.id)} className="flex-1">
              <Play className="mr-2 h-4 w-4" />
              Iniciar
            </Button>
          )}
          {server.status === "online" && (
            <Button size="sm" variant="destructive" onClick={() => onStop(server.id)} className="flex-1">
              <Square className="mr-2 h-4 w-4" />
              Parar
            </Button>
          )}
          <Button size="sm" variant="outline" onClick={() => onRestart(server.id)}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reiniciar
          </Button>
          <Button size="sm" variant="outline" onClick={() => onViewDetails(server.id)}>
            <Eye className="mr-2 h-4 w-4" />
            Detalhes
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
