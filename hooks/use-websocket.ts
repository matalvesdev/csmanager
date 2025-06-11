"use client"

import { useState, useEffect, useRef } from "react"

export interface ContainerEvent {
  id: string
  container: string
  action: string
  timestamp: string
}

export interface SystemMetrics {
  cpu: number
  memory: {
    used: number
    total: number
  }
  disk: {
    used: number
    total: number
  }
  network: {
    rx: number
    tx: number
  }
}

export function useWebSocket() {
  const [isConnected, setIsConnected] = useState(false)
  const [containerEvents, setContainerEvents] = useState<ContainerEvent[]>([])
  const [latestMetrics, setLatestMetrics] = useState<SystemMetrics | null>(null)
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    // Simular conexão WebSocket
    setIsConnected(true)

    // Simular eventos de containers
    const mockEvents: ContainerEvent[] = [
      {
        id: "1",
        container: "cs-server-1",
        action: "started",
        timestamp: new Date().toISOString(),
      },
      {
        id: "2",
        container: "hltv-recorder",
        action: "connected",
        timestamp: new Date().toISOString(),
      },
    ]

    // Simular métricas do sistema
    const mockMetrics: SystemMetrics = {
      cpu: 45.2,
      memory: {
        used: 8.5 * 1024 * 1024 * 1024, // 8.5GB
        total: 16 * 1024 * 1024 * 1024, // 16GB
      },
      disk: {
        used: 120 * 1024 * 1024 * 1024, // 120GB
        total: 500 * 1024 * 1024 * 1024, // 500GB
      },
      network: {
        rx: 1024 * 1024, // 1MB/s
        tx: 512 * 1024, // 512KB/s
      },
    }

    // Definir eventos e métricas iniciais
    setContainerEvents(mockEvents)
    setLatestMetrics(mockMetrics)

    // Simular atualizações periódicas
    const interval = setInterval(() => {
      // Atualizar métricas aleatoriamente
      setLatestMetrics((prev) =>
        prev
          ? {
              ...prev,
              cpu: Math.random() * 100,
              memory: {
                ...prev.memory,
                used: prev.memory.total * (0.3 + Math.random() * 0.4), // 30-70% usage
              },
            }
          : mockMetrics,
      )

      // Ocasionalmente adicionar novos eventos
      if (Math.random() > 0.8) {
        const newEvent: ContainerEvent = {
          id: Date.now().toString(),
          container: `container-${Math.floor(Math.random() * 10)}`,
          action: Math.random() > 0.5 ? "started" : "stopped",
          timestamp: new Date().toISOString(),
        }

        setContainerEvents((prev) => [newEvent, ...prev.slice(0, 9)]) // Keep only last 10 events
      }
    }, 5000)

    // Cleanup
    return () => {
      clearInterval(interval)
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [])

  return {
    isConnected,
    containerEvents: containerEvents || [], // Garantir que sempre seja um array
    latestMetrics,
    connect: () => setIsConnected(true),
    disconnect: () => setIsConnected(false),
  }
}
