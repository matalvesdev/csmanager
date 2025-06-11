"use client"

import { useEffect } from "react"
import { useInfraStore } from "@/lib/store-infra"
import { useWebSocket } from "@/hooks/use-websocket"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react"

export function SystemStatus() {
  const { systemMetrics, fetchSystemMetrics } = useInfraStore()
  const { isConnected, latestMetrics } = useWebSocket()

  useEffect(() => {
    fetchSystemMetrics()
    const interval = setInterval(fetchSystemMetrics, 30000)
    return () => clearInterval(interval)
  }, [fetchSystemMetrics])

  const metrics = latestMetrics || systemMetrics
  const hasHighCpu = metrics && metrics.cpu > 80
  const hasHighMemory = metrics && metrics.memory > 90
  const hasLowDisk = metrics && metrics.disk > 95

  const hasAlerts = hasHighCpu || hasHighMemory || hasLowDisk || !isConnected

  if (!hasAlerts) return null

  return (
    <div className="border-b bg-muted/30 p-2">
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-4">
          {!isConnected && (
            <Alert className="border-red-200 bg-red-50 text-red-800">
              <XCircle className="h-4 w-4" />
              <AlertDescription>Sistema desconectado</AlertDescription>
            </Alert>
          )}

          {hasHighCpu && (
            <Badge variant="destructive" className="gap-1">
              <AlertTriangle className="h-3 w-3" />
              CPU Alta: {metrics?.cpu.toFixed(1)}%
            </Badge>
          )}

          {hasHighMemory && (
            <Badge variant="destructive" className="gap-1">
              <AlertTriangle className="h-3 w-3" />
              Memória Alta: {metrics?.memory.toFixed(1)}%
            </Badge>
          )}

          {hasLowDisk && (
            <Badge variant="destructive" className="gap-1">
              <AlertTriangle className="h-3 w-3" />
              Disco Cheio: {metrics?.disk.toFixed(1)}%
            </Badge>
          )}
        </div>

        <Badge variant={isConnected ? "default" : "destructive"} className="gap-1">
          {isConnected ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
          {isConnected ? "Online" : "Offline"}
        </Badge>
      </div>
    </div>
  )
}
