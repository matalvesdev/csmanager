"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Cpu, HardDrive, MemoryStick, Network } from "lucide-react"
import { formatBytes, formatUptime } from "@/lib/format"
import type { SystemMetrics as SystemMetricsType } from "@/types/infra"

interface SystemMetricsProps {
  metrics: SystemMetricsType
}

export function SystemMetrics({ metrics }: SystemMetricsProps) {
  // Verificar se memory é um objeto ou um número
  const memoryValue =
    typeof metrics.memory === "object" ? (metrics.memory.used / metrics.memory.total) * 100 : metrics.memory

  // Verificar se disk é um objeto ou um número
  const diskValue = typeof metrics.disk === "object" ? (metrics.disk.used / metrics.disk.total) * 100 : metrics.disk

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* CPU */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">CPU</CardTitle>
          <Cpu className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.cpu.toFixed(1)}%</div>
          <Progress value={metrics.cpu} className="mt-2" />
          <Badge
            variant={metrics.cpu > 80 ? "destructive" : metrics.cpu > 60 ? "secondary" : "default"}
            className="mt-2"
          >
            {metrics.cpu > 80 ? "Alto" : metrics.cpu > 60 ? "Médio" : "Normal"}
          </Badge>
        </CardContent>
      </Card>

      {/* Memória */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Memória</CardTitle>
          <MemoryStick className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{memoryValue.toFixed(1)}%</div>
          <Progress value={memoryValue} className="mt-2" />
          {typeof metrics.memory === "object" && (
            <p className="text-xs text-muted-foreground mt-2">
              {formatBytes(metrics.memory.used)} / {formatBytes(metrics.memory.total)}
            </p>
          )}
          <Badge
            variant={memoryValue > 90 ? "destructive" : memoryValue > 70 ? "secondary" : "default"}
            className="mt-2"
          >
            {memoryValue > 90 ? "Alto" : memoryValue > 70 ? "Médio" : "Normal"}
          </Badge>
        </CardContent>
      </Card>

      {/* Disco */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Disco</CardTitle>
          <HardDrive className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{diskValue.toFixed(1)}%</div>
          <Progress value={diskValue} className="mt-2" />
          {typeof metrics.disk === "object" && (
            <p className="text-xs text-muted-foreground mt-2">
              {formatBytes(metrics.disk.used)} / {formatBytes(metrics.disk.total)}
            </p>
          )}
          <Badge variant={diskValue > 95 ? "destructive" : diskValue > 80 ? "secondary" : "default"} className="mt-2">
            {diskValue > 95 ? "Cheio" : diskValue > 80 ? "Alto" : "Normal"}
          </Badge>
        </CardContent>
      </Card>

      {/* Rede */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Rede</CardTitle>
          <Network className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>↓ RX:</span>
              <span>{formatBytes(metrics.network.rx)}/s</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>↑ TX:</span>
              <span>{formatBytes(metrics.network.tx)}/s</span>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-muted-foreground">Uptime: {formatUptime(metrics.uptime)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Exportar também como SystemMetricsCard para compatibilidade
export const SystemMetricsCard = SystemMetrics
