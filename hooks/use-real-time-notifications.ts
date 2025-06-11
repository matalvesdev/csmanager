"use client"

import { useEffect } from "react"
import { useWebSocket } from "./use-websocket"
import { useToast } from "@/components/ui/use-toast"
import { useInfraStore } from "@/lib/store-infra"

export function useRealTimeNotifications() {
  const { toast } = useToast()
  const { containerEvents, latestMetrics, isConnected } = useWebSocket()
  const { fetchServers, fetchContainers } = useInfraStore()

  // Notificações de eventos de containers
  useEffect(() => {
    if (containerEvents.length > 0) {
      const latestEvent = containerEvents[0]

      switch (latestEvent.action) {
        case "start":
          toast({
            title: "Container iniciado",
            description: `${latestEvent.containerName} está online`,
          })
          break
        case "stop":
          toast({
            title: "Container parado",
            description: `${latestEvent.containerName} foi desligado`,
            variant: "destructive",
          })
          break
        case "die":
          toast({
            title: "Container falhou",
            description: `${latestEvent.containerName} parou inesperadamente`,
            variant: "destructive",
          })
          break
      }

      // Refresh data when containers change
      fetchServers()
      fetchContainers()
    }
  }, [containerEvents, toast, fetchServers, fetchContainers])

  // Alertas de métricas críticas
  useEffect(() => {
    if (latestMetrics) {
      if (latestMetrics.cpu > 90) {
        toast({
          title: "CPU crítica",
          description: `Uso de CPU em ${latestMetrics.cpu.toFixed(1)}%`,
          variant: "destructive",
        })
      }

      if (latestMetrics.memory.used / latestMetrics.memory.total > 0.95) {
        toast({
          title: "Memória crítica",
          description: "Uso de memória acima de 95%",
          variant: "destructive",
        })
      }

      if (latestMetrics.disk.used / latestMetrics.disk.total > 0.95) {
        toast({
          title: "Disco crítico",
          description: "Espaço em disco quase esgotado",
          variant: "destructive",
        })
      }
    }
  }, [latestMetrics, toast])

  // Notificação de conexão
  useEffect(() => {
    if (isConnected) {
      toast({
        title: "Sistema conectado",
        description: "Monitoramento em tempo real ativo",
      })
    } else {
      toast({
        title: "Sistema desconectado",
        description: "Reconectando...",
        variant: "destructive",
      })
    }
  }, [isConnected, toast])

  return {
    isConnected,
    containerEvents,
    latestMetrics,
  }
}
