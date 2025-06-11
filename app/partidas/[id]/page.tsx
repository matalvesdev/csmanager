"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useAppStore } from "@/lib/store"
import { formatDate, formatStatus } from "@/lib/format"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Play, Pause, RefreshCw, ExternalLink, Send } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { EstatisticasPartida } from "@/components/estatisticas/estatisticas-partida"

export default function PartidaDetailPage() {
  const params = useParams()
  const id = params.id as string
  const { currentPartida, isLoading, fetchPartidaById, startPartida, readyPartida, cancelPartida } = useAppStore()
  const [command, setCommand] = useState("")

  useEffect(() => {
    fetchPartidaById(id)
  }, [id, fetchPartidaById])

  const handleStartPartida = () => {
    startPartida(id)
  }

  const handleReadyPartida = () => {
    readyPartida(id)
  }

  const handleCancelPartida = () => {
    cancelPartida(id)
  }

  const handleSendCommand = (e: React.FormEvent) => {
    e.preventDefault()
    if (!command.trim()) return

    if (command === "!ready") {
      readyPartida(id)
    } else if (command === "!startadm") {
      startPartida(id)
    }

    setCommand("")
  }

  if (isLoading) {
    return (
      <div className="container py-6 space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!currentPartida) {
    return (
      <div className="container py-6 space-y-6">
        <h1 className="text-3xl font-bold">Partida não encontrada</h1>
        <p>A partida que você está procurando não existe ou foi removida.</p>
        <Button onClick={() => window.history.back()}>Voltar</Button>
      </div>
    )
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {currentPartida.timeA.nome} vs {currentPartida.timeB.nome}
          </h1>
          <p className="text-muted-foreground">
            {currentPartida.mapa} • {formatDate(currentPartida.inicioPrevisto)}
          </p>
        </div>
        <Badge
          variant="outline"
          className={`
            ${
              currentPartida.status === "em_andamento"
                ? "bg-green-500/10 text-green-500 border-green-500/20"
                : currentPartida.status === "finalizada"
                  ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                  : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
            }
          `}
        >
          {formatStatus(currentPartida.status)}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status da Partida</CardTitle>
              <CardDescription>
                {currentPartida.status === "em_andamento"
                  ? "Partida em andamento"
                  : currentPartida.status === "finalizada"
                    ? "Partida finalizada"
                    : "Partida agendada"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-center gap-8">
                <div className="text-center">
                  <div className="text-2xl font-bold">{currentPartida.timeA.nome}</div>
                  <div className="text-5xl font-bold mt-2">{currentPartida.placar?.timeA || 0}</div>
                </div>

                <div className="text-xl font-bold">vs</div>

                <div className="text-center">
                  <div className="text-2xl font-bold">{currentPartida.timeB.nome}</div>
                  <div className="text-5xl font-bold mt-2">{currentPartida.placar?.timeB || 0}</div>
                </div>
              </div>

              {currentPartida.status === "em_andamento" && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progresso da partida</span>
                    <span>{(currentPartida.placar?.timeA || 0) + (currentPartida.placar?.timeB || 0)} / 30 rounds</span>
                  </div>
                  <Progress
                    value={(((currentPartida.placar?.timeA || 0) + (currentPartida.placar?.timeB || 0)) / 30) * 100}
                    className="w-full"
                  />
                </div>
              )}

              {currentPartida.hltvDemoUrl && (
                <div className="flex justify-center">
                  <Button variant="outline" asChild>
                    <a href={currentPartida.hltvDemoUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Ver Demo HLTV
                    </a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Tabs defaultValue="times">
            <TabsList>
              <TabsTrigger value="times">Times</TabsTrigger>
              <TabsTrigger value="logs">Logs</TabsTrigger>
              <TabsTrigger value="estatisticas">Estatísticas</TabsTrigger>
            </TabsList>

            <TabsContent value="times" className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{currentPartida.timeA.nome}</CardTitle>
                    <CardDescription>{currentPartida.timeA.jogadores.length} jogadores</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {currentPartida.timeA.jogadores.map((jogador) => (
                        <div key={jogador.id} className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={jogador.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{jogador.nome.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="font-medium">{jogador.nome}</div>
                            <div className="text-sm text-muted-foreground">
                              {jogador.tipo} {jogador.perfil && `• ${jogador.perfil}`}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{currentPartida.timeB.nome}</CardTitle>
                    <CardDescription>{currentPartida.timeB.jogadores.length} jogadores</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {currentPartida.timeB.jogadores.map((jogador) => (
                        <div key={jogador.id} className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={jogador.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{jogador.nome.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="font-medium">{jogador.nome}</div>
                            <div className="text-sm text-muted-foreground">
                              {jogador.tipo} {jogador.perfil && `• ${jogador.perfil}`}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="logs" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Logs da Partida</CardTitle>
                  <CardDescription>Comandos e eventos da partida</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-64 w-full border rounded p-4">
                    {currentPartida.logs.length > 0 ? (
                      <div className="space-y-2">
                        {currentPartida.logs.map((log, index) => (
                          <div key={index} className="text-sm font-mono">
                            <span className="text-muted-foreground">[{new Date().toLocaleTimeString()}]</span> {log}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm">Nenhum log disponível</p>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="estatisticas" className="space-y-4 pt-4">
              <EstatisticasPartida partida={currentPartida} />
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Controles da Partida</CardTitle>
              <CardDescription>Gerenciar o estado da partida</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentPartida.status === "agendada" && (
                <Button onClick={handleStartPartida} className="w-full">
                  <Play className="mr-2 h-4 w-4" />
                  Iniciar Partida
                </Button>
              )}

              {currentPartida.status === "em_andamento" && (
                <>
                  <Button onClick={handleCancelPartida} variant="destructive" className="w-full">
                    <Pause className="mr-2 h-4 w-4" />
                    Pausar Partida
                  </Button>
                  <Button onClick={handleReadyPartida} variant="outline" className="w-full">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Reiniciar Round
                  </Button>
                </>
              )}

              {currentPartida.status === "finalizada" && (
                <div className="text-center text-muted-foreground">Partida finalizada</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Console de Comandos</CardTitle>
              <CardDescription>Enviar comandos para o servidor</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSendCommand} className="space-y-4">
                <Input
                  placeholder="Digite um comando (!ready, !startadm)"
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                />
                <Button type="submit" className="w-full">
                  <Send className="mr-2 h-4 w-4" />
                  Enviar Comando
                </Button>
              </form>

              <Separator className="my-4" />

              <div className="space-y-2">
                <div className="text-sm font-medium">Comandos rápidos:</div>
                <div className="grid grid-cols-2 gap-2">
                  <Button size="sm" variant="outline" onClick={() => setCommand("!ready")}>
                    !ready
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setCommand("!startadm")}>
                    !startadm
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
