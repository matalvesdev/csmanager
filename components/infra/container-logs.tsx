"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Download, Trash2 } from "lucide-react"
import type { DockerContainer } from "@/types/infra"

interface ContainerLogsProps {
  container: DockerContainer
  onRefresh: () => void
}

export function ContainerLogs({ container, onRefresh }: ContainerLogsProps) {
  const [logs, setLogs] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Simular logs do container
  useEffect(() => {
    const generateLogs = () => {
      const logTypes = ["INFO", "WARN", "ERROR", "DEBUG"]
      const messages = [
        "Container started successfully",
        "Processing request from client",
        "Database connection established",
        "Memory usage: 45%",
        "CPU usage: 23%",
        "Network interface up",
        "Service health check passed",
        "Backup completed successfully",
      ]

      const newLogs = Array.from({ length: 50 }, (_, i) => {
        const timestamp = new Date(Date.now() - i * 1000).toISOString()
        const type = logTypes[Math.floor(Math.random() * logTypes.length)]
        const message = messages[Math.floor(Math.random() * messages.length)]
        return `${timestamp} [${type}] ${message}`
      }).reverse()

      setLogs(newLogs)
    }

    generateLogs()
  }, [container.id])

  const handleRefresh = () => {
    setIsLoading(true)
    onRefresh()
    setTimeout(() => setIsLoading(false), 1000)
  }

  const getLogColor = (log: string) => {
    if (log.includes("[ERROR]")) return "text-red-500"
    if (log.includes("[WARN]")) return "text-yellow-500"
    if (log.includes("[INFO]")) return "text-blue-500"
    return "text-muted-foreground"
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Logs do Container</h3>
          <Badge variant="outline">{logs.length} linhas</Badge>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
          <Button size="sm" variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button size="sm" variant="outline">
            <Trash2 className="mr-2 h-4 w-4" />
            Limpar
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <ScrollArea className="h-[400px] w-full">
            <div className="p-4 font-mono text-sm space-y-1">
              {logs.map((log, index) => (
                <div key={index} className={`${getLogColor(log)} hover:bg-muted/50 px-2 py-1 rounded`}>
                  {log}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
