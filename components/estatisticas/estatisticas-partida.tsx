"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import type { Partida } from "@/types"

interface EstatisticasPartidaProps {
  partida: Partida
  estatisticas?: {
    jogadores: {
      id: string
      nome: string
      avatar?: string
      time: "A" | "B"
      kills: number
      deaths: number
      assists: number
      headshots: number
      score: number
    }[]
    rounds: {
      numero: number
      vencedor: "A" | "B"
      tipo: "normal" | "bomb" | "eliminacao"
      duracao: number
    }[]
  }
}

export function EstatisticasPartida({ partida, estatisticas }: EstatisticasPartidaProps) {
  // Estatísticas padrão para demonstração
  const stats = estatisticas || {
    jogadores: [
      ...partida.timeA.jogadores.map((j) => ({
        id: j.id,
        nome: j.nome,
        avatar: j.avatar,
        time: "A" as const,
        kills: Math.floor(Math.random() * 30) + 5,
        deaths: Math.floor(Math.random() * 20) + 5,
        assists: Math.floor(Math.random() * 10),
        headshots: Math.floor(Math.random() * 15),
        score: Math.floor(Math.random() * 100) + 50,
      })),
      ...partida.timeB.jogadores.map((j) => ({
        id: j.id,
        nome: j.nome,
        avatar: j.avatar,
        time: "B" as const,
        kills: Math.floor(Math.random() * 30) + 5,
        deaths: Math.floor(Math.random() * 20) + 5,
        assists: Math.floor(Math.random() * 10),
        headshots: Math.floor(Math.random() * 15),
        score: Math.floor(Math.random() * 100) + 50,
      })),
    ],
    rounds: Array.from({ length: (partida.placar?.timeA || 0) + (partida.placar?.timeB || 0) }).map((_, i) => ({
      numero: i + 1,
      vencedor: Math.random() > 0.5 ? "A" : ("B" as const),
      tipo: ["normal", "bomb", "eliminacao"][Math.floor(Math.random() * 3)] as "normal" | "bomb" | "eliminacao",
      duracao: Math.floor(Math.random() * 90) + 30,
    })),
  }

  // Ordenar jogadores por score
  const sortedPlayers = [...stats.jogadores].sort((a, b) => b.score - a.score)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Estatísticas da Partida</CardTitle>
          <CardDescription>
            {partida.timeA.nome} vs {partida.timeB.nome} • {partida.mapa}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Placar por Round</h3>
              <div className="flex flex-wrap gap-2">
                {stats.rounds.map((round, index) => (
                  <div
                    key={index}
                    className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium ${
                      round.vencedor === "A"
                        ? "bg-blue-500/20 text-blue-500 border border-blue-500/30"
                        : "bg-red-500/20 text-red-500 border border-red-500/30"
                    }`}
                    title={`Round ${round.numero}: ${round.tipo}, ${round.duracao}s`}
                  >
                    {round.numero}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Resumo</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total de rounds:</span>
                  <span>{stats.rounds.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Rounds {partida.timeA.nome}:</span>
                  <span>{stats.rounds.filter((r) => r.vencedor === "A").length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Rounds {partida.timeB.nome}:</span>
                  <span>{stats.rounds.filter((r) => r.vencedor === "B").length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Duração média:</span>
                  <span>{Math.round(stats.rounds.reduce((acc, r) => acc + r.duracao, 0) / stats.rounds.length)}s</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Scoreboard</CardTitle>
          <CardDescription>Desempenho dos jogadores</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Jogador</TableHead>
                <TableHead>Time</TableHead>
                <TableHead className="text-right">K</TableHead>
                <TableHead className="text-right">D</TableHead>
                <TableHead className="text-right">A</TableHead>
                <TableHead className="text-right">HS</TableHead>
                <TableHead className="text-right">Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedPlayers.map((player) => (
                <TableRow key={player.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={player.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{player.nome.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>{player.nome}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={player.time === "A" ? "default" : "destructive"}>
                      {player.time === "A" ? partida.timeA.nome : partida.timeB.nome}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{player.kills}</TableCell>
                  <TableCell className="text-right">{player.deaths}</TableCell>
                  <TableCell className="text-right">{player.assists}</TableCell>
                  <TableCell className="text-right">{player.headshots}</TableCell>
                  <TableCell className="text-right font-medium">{player.score}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
