"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Eye, Calendar, Clock, HardDrive } from "lucide-react"
import type { HltvDemo } from "@/types/infra"

interface HltvDemoCardProps {
  demo: HltvDemo
  onDownload: (demo: HltvDemo) => void
  onView: (demo: HltvDemo) => void
}

export function HltvDemoCard({ demo, onDownload, onView }: HltvDemoCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "disponivel":
        return "default"
      case "processando":
        return "secondary"
      case "erro":
        return "destructive"
      default:
        return "outline"
    }
  }

  const formatFileSize = (bytes: number) => {
    const sizes = ["Bytes", "KB", "MB", "GB"]
    if (bytes === 0) return "0 Bytes"
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i]
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg truncate">{demo.name}</CardTitle>
          <Badge variant={getStatusColor(demo.status)}>{demo.status}</Badge>
        </div>
        <div className="text-sm text-muted-foreground">{demo.partida}</div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Informações do Demo */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{new Date(demo.data).toLocaleDateString("pt-BR")}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{formatDuration(demo.duracao)}</span>
          </div>
          <div className="flex items-center gap-2">
            <HardDrive className="h-4 w-4 text-muted-foreground" />
            <span>{formatFileSize(demo.tamanho)}</span>
          </div>
          <div className="text-muted-foreground">
            {new Date(demo.data).toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>

        {/* Ações */}
        <div className="flex gap-2">
          <Button size="sm" onClick={() => onDownload(demo)} disabled={demo.status !== "disponivel"} className="flex-1">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button size="sm" variant="outline" onClick={() => onView(demo)}>
            <Eye className="mr-2 h-4 w-4" />
            Detalhes
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
