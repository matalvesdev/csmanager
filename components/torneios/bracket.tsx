"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { formatDate } from "@/lib/format"
import type { Partida, Time, Torneio } from "@/types"
import { AgendarPartida } from "@/components/partidas/agendar-partida"

interface BracketProps {
  torneio: Torneio
}

interface MatchProps {
  partida?: Partida
  timeA?: Time
  timeB?: Time
  onSchedule?: () => void
  round: number
  position: number
}

function Match({ partida, timeA, timeB, onSchedule, round, position }: MatchProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <Card className="w-64 mb-4">
        <CardContent className="p-3">
          <div className="text-xs text-muted-foreground mb-2">
            {partida ? formatDate(partida.inicioPrevisto) : `Round ${round}, Match ${position}`}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {timeA?.logo && (
                  <div className="w-5 h-5 rounded-full overflow-hidden">
                    <img
                      src={timeA.logo || "/placeholder.svg"}
                      alt={timeA.nome}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <span className="font-medium">{timeA?.nome || "TBD"}</span>
              </div>
              <span>{partida?.placar?.timeA || "-"}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {timeB?.logo && (
                  <div className="w-5 h-5 rounded-full overflow-hidden">
                    <img
                      src={timeB.logo || "/placeholder.svg"}
                      alt={timeB.nome}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <span className="font-medium">{timeB?.nome || "TBD"}</span>
              </div>
              <span>{partida?.placar?.timeB || "-"}</span>
            </div>
          </div>

          {partida ? (
            <div className="mt-2 flex justify-between items-center">
              <Badge
                variant="outline"
                className={`
                  ${
                    partida.status === "em_andamento"
                      ? "bg-green-500/10 text-green-500 border-green-500/20"
                      : partida.status === "finalizada"
                        ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                        : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                  }
                `}
              >
                {partida.status === "em_andamento"
                  ? "Em andamento"
                  : partida.status === "finalizada"
                    ? "Finalizada"
                    : "Agendada"}
              </Badge>

              <Button size="sm" variant="ghost" asChild>
                <a href={`/partidas/${partida.id}`}>Ver</a>
              </Button>
            </div>
          ) : (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="w-full mt-2" variant="outline">
                  Agendar Partida
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Agendar Partida</DialogTitle>
                  <DialogDescription>Crie uma nova partida para o bracket</DialogDescription>
                </DialogHeader>
                <AgendarPartida torneioId={onSchedule ? undefined : undefined} onClose={() => setOpen(false)} />
              </DialogContent>
            </Dialog>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export function Bracket({ torneio }: BracketProps) {
  // Filtrar apenas partidas de eliminação (não de grupos)
  const eliminationMatches = torneio.partidas.filter((p) => p.fase === "eliminacao")

  // Organizar partidas por rodadas
  const rounds: Record<string, Partida[]> = {}
  eliminationMatches.forEach((match) => {
    if (!rounds[match.round]) {
      rounds[match.round] = []
    }
    rounds[match.round].push(match)
  })

  // Número de rodadas (quartas, semis, final)
  const numRounds = Object.keys(rounds).length || 3

  // Gerar estrutura de chaves
  const generateBracket = () => {
    const bracketRounds = []

    for (let i = 1; i <= numRounds; i++) {
      const roundMatches = rounds[i] || []
      const matchesInRound = Math.pow(2, numRounds - i)

      const roundElements = []
      for (let j = 0; j < matchesInRound; j++) {
        const match = roundMatches[j]
        roundElements.push(
          <Match
            key={`${i}-${j}`}
            partida={match}
            timeA={match?.timeA}
            timeB={match?.timeB}
            round={i}
            position={j + 1}
          />,
        )
      }

      bracketRounds.push(
        <div
          key={`round-${i}`}
          className="flex flex-col justify-around h-full"
          style={{ minHeight: matchesInRound * 120 }}
        >
          {roundElements}
        </div>,
      )
    }

    return bracketRounds
  }

  return (
    <Card className="overflow-x-auto">
      <CardHeader>
        <CardTitle>Chaves de Eliminação</CardTitle>
        <CardDescription>Visualize o progresso do torneio</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-16 p-4">{generateBracket()}</div>
      </CardContent>
    </Card>
  )
}
