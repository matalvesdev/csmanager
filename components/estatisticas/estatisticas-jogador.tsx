"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import type { Jogador } from "@/types"

interface EstatisticasJogadorProps {
  jogador: Jogador
  estatisticas?: {
    kills: number
    deaths: number
    assists: number
    headshots: number
    accuracy: number
    partidasJogadas: number
    partidasVencidas: number
    kdr: number
    hsPercentage: number
  }
}

export function EstatisticasJogador({ jogador, estatisticas }: EstatisticasJogadorProps) {
  // Estatísticas padrão para demonstração
  const stats = estatisticas || {
    kills: Math.floor(Math.random() * 200) + 50,
    deaths: Math.floor(Math.random() * 100) + 20,
    assists: Math.floor(Math.random() * 50) + 10,
    headshots: Math.floor(Math.random() * 100) + 20,
    accuracy: Math.floor(Math.random() * 40) + 30,
    partidasJogadas: Math.floor(Math.random() * 20) + 5,
    partidasVencidas: Math.floor(Math.random() * 15) + 2,
    kdr: 0,
    hsPercentage: 0,
  }

  // Calcular KDR e HS%
  stats.kdr = stats.kills / (stats.deaths || 1)
  stats.hsPercentage = (stats.headshots / stats.kills) * 100

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={jogador.avatar || "/placeholder.svg"} />
            <AvatarFallback>{jogador.nome.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{jogador.nome}</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Badge variant={jogador.tipo === "bot" ? "secondary" : "default"}>{jogador.tipo}</Badge>
              {jogador.perfil && <Badge variant="outline">{jogador.perfil}</Badge>}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.kills}</div>
            <div className="text-sm text-muted-foreground">Kills</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.deaths}</div>
            <div className="text-sm text-muted-foreground">Deaths</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.kdr.toFixed(2)}</div>
            <div className="text-sm text-muted-foreground">K/D Ratio</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.hsPercentage.toFixed(1)}%</div>
            <div className="text-sm text-muted-foreground">Headshots</div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Precisão</span>
              <span>{stats.accuracy}%</span>
            </div>
            <Progress value={stats.accuracy} className="h-2" />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Taxa de Vitória</span>
              <span>{Math.round((stats.partidasVencidas / stats.partidasJogadas) * 100)}%</span>
            </div>
            <Progress value={(stats.partidasVencidas / stats.partidasJogadas) * 100} className="h-2" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-2 border rounded-md">
            <div className="text-sm text-muted-foreground">Partidas</div>
            <div className="text-xl font-medium">{stats.partidasJogadas}</div>
          </div>
          <div className="text-center p-2 border rounded-md">
            <div className="text-sm text-muted-foreground">Vitórias</div>
            <div className="text-xl font-medium">{stats.partidasVencidas}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
