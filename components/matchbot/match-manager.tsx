"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { LoadingButton } from "@/components/ui/loading-button"
import { useToast } from "@/components/ui/use-toast"
import {
  Play,
  Pause,
  RefreshCw,
  Clock,
  Users,
  Shield,
  Swords,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageSquare,
  Download,
  Eye,
} from "lucide-react"
import { useMatchBotWebSocket } from "@/hooks/use-matchbot-websocket"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

interface MatchStatus {
  id: string
  server: string
  status: "waiting" | "knife" | "live" | "halftime" | "finished" | "paused" | "warmup"
  map: string
  scoreT: number
  scoreCT: number
  round: number
  maxRounds: number
  playersReady: number
  totalPlayers: number
  timeRemaining: number | null
  startTime: string
  endTime: string | null
  teamT: string
  teamCT: string
  demoUrl: string | null
  hltvUrl: string | null
}

interface MatchEvent {
  id: string
  matchId: string
  type:
  | "ready"
  | "notready"
  | "knife_start"
  | "knife_end"
  | "knife_stay"
  | "knife_swap"
  | "half_start"
  | "half_end"
  | "match_start"
  | "match_end"
  | "round_start"
  | "round_end"
  | "timeout"
  | "pause"
  | "unpause"
  | "restart"
  | "admin_action"
  | "player_connect"
  | "player_disconnect"
  player: string | null
  team: "T" | "CT" | null
  message: string
  timestamp: string
}

interface MatchPlayer {
  steamId: string
  name: string
  team: "T" | "CT" | "SPEC" | null
  isReady: boolean
  isAdmin: boolean
  isConnected: boolean
  ping: number
  score: number
  kills: number
  deaths: number
  assists: number
  headshots: number
}

interface MatchCommand {
  command: string
  description: string
  requiresAdmin: boolean
}

interface MatchManagerProps {
  matchId?: string
  serverId?: string
}

export function MatchManager({ matchId, serverId }: MatchManagerProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("status")
  const [showCommandDialog, setShowCommandDialog] = useState(false)
  const [commandInput, setCommandInput] = useState("")
  const [matchStatus, setMatchStatus] = useState<MatchStatus | null>(null)
  const [matchEvents, setMatchEvents] = useState<MatchEvent[]>([])
  const [matchPlayers, setMatchPlayers] = useState<MatchPlayer[]>([])
  const [availableCommands, setAvailableCommands] = useState<MatchCommand[]>([])
  const [criticalError, setCriticalError] = useState<string | null>(null)

  // Carregamento real dos dados do MatchBot com polling
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined
    const loadMatchData = async () => {
      setIsLoading(true)
      try {
        // Buscar status da partida do MatchBot (exemplo de endpoint)
        const statusRes = await fetch(`/api/matchbot/status?matchId=${matchId || ""}&serverId=${serverId || ""}`)
        const statusData = await statusRes.json()
        if (statusData.error) throw new Error(statusData.error)
        setMatchStatus(statusData)
        setCriticalError(null)

        // Buscar eventos da partida
        const eventsRes = await fetch(`/api/matchbot/events?matchId=${matchId || ""}`)
        const eventsData = await eventsRes.json()
        if (eventsData.error) throw new Error(eventsData.error)
        setMatchEvents(eventsData)

        // Buscar jogadores da partida
        const playersRes = await fetch(`/api/matchbot/players?matchId=${matchId || ""}`)
        const playersData = await playersRes.json()
        if (playersData.error) throw new Error(playersData.error)
        setMatchPlayers(playersData)

        // Buscar comandos disponíveis
        const commandsRes = await fetch(`/api/matchbot/commands?matchId=${matchId || ""}`)
        const commandsData = await commandsRes.json()
        if (commandsData.error) throw new Error(commandsData.error)
        setAvailableCommands(commandsData)
      } catch (error: any) {
        setCriticalError(error.message)
        toast({
          title: "Erro ao carregar dados do MatchBot",
          description: error.message || "Não foi possível carregar os dados da partida.",
          variant: "destructive",
          duration: 10000,
        })
      } finally {
        setIsLoading(false)
      }
    }
    loadMatchData()
    interval = setInterval(loadMatchData, 5000)
    return () => interval && clearInterval(interval)
  }, [matchId, serverId, toast])

  // Envio real de comandos para o MatchBot
  const handleSendCommand = async () => {
    if (!commandInput.trim()) return
    setIsLoading(true)
    try {
      const res = await fetch(`/api/matchbot/command`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matchId, serverId, command: commandInput })
      })
      const data = await res.json()
      if (!res.ok || data.error) throw new Error(data.error || "Erro desconhecido")
      setCommandInput("")
      setShowCommandDialog(false)
      toast({
        title: "Comando enviado",
        description: `O comando "${commandInput}" foi enviado com sucesso.`,
      })
    } catch (error: any) {
      toast({
        title: "Erro ao enviar comando",
        description: error.message || "Não foi possível enviar o comando para o servidor.",
        variant: "destructive",
        duration: 10000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  // WebSocket MatchBot: atualização instantânea
  useMatchBotWebSocket({
    matchId,
    serverId,
    onStatus: (status) => setMatchStatus(status),
    onEvents: (events) => setMatchEvents(events),
    onPlayers: (players) => setMatchPlayers(players),
  })

  const getStatusBadge = (status: MatchStatus["status"]) => {
    const variants = {
      waiting: "secondary",
      knife: "outline",
      live: "default",
      halftime: "secondary",
      finished: "default",
      paused: "destructive",
      warmup: "outline",
    } as const

    const icons = {
      waiting: <Clock className="h-4 w-4 mr-1" />,
      knife: <Swords className="h-4 w-4 mr-1" />,
      live: <Play className="h-4 w-4 mr-1" />,
      halftime: <RefreshCw className="h-4 w-4 mr-1" />,
      finished: <CheckCircle className="h-4 w-4 mr-1" />,
      paused: <Pause className="h-4 w-4 mr-1" />,
      warmup: <Users className="h-4 w-4 mr-1" />,
    }

    const labels = {
      waiting: "Aguardando",
      knife: "Round de Faca",
      live: "Em Andamento",
      halftime: "Intervalo",
      finished: "Finalizada",
      paused: "Pausada",
      warmup: "Aquecimento",
    }

    return (
      <Badge variant={variants[status]} className="flex items-center">
        {icons[status]}
        {labels[status]}
      </Badge>
    )
  }

  const getEventIcon = (type: MatchEvent["type"]) => {
    switch (type) {
      case "ready":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "notready":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "knife_start":
      case "knife_end":
      case "knife_stay":
      case "knife_swap":
        return <Swords className="h-4 w-4 text-yellow-500" />
      case "match_start":
      case "half_start":
      case "round_start":
        return <Play className="h-4 w-4 text-green-500" />
      case "match_end":
      case "half_end":
      case "round_end":
        return <Pause className="h-4 w-4 text-blue-500" />
      case "timeout":
        return <Clock className="h-4 w-4 text-orange-500" />
      case "pause":
        return <Pause className="h-4 w-4 text-red-500" />
      case "unpause":
        return <Play className="h-4 w-4 text-green-500" />
      case "restart":
        return <RefreshCw className="h-4 w-4 text-purple-500" />
      case "admin_action":
        return <Shield className="h-4 w-4 text-blue-500" />
      case "player_connect":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "player_disconnect":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getReadyStatus = () => {
    if (!matchStatus) return null
    const { playersReady, totalPlayers } = matchStatus
    const percentage = Math.round((playersReady / totalPlayers) * 100)

    return (
      <div className="flex items-center">
        <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
          <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
        </div>
        <span className="text-sm font-medium">
          {playersReady}/{totalPlayers} ({percentage}%)
        </span>
      </div>
    )
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString()
  }

  if (!matchStatus) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center py-10">
          <div className="text-center">
            <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium">Carregando dados da partida...</h3>
            <p className="text-muted-foreground mt-2">Aguarde enquanto buscamos as informações.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (criticalError) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertTitle>Erro crítico na comunicação com o MatchBot</AlertTitle>
        <AlertDescription>{criticalError}</AlertDescription>
      </Alert>
    )
  }

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Gerenciador de Partida</CardTitle>
              <CardDescription>
                Servidor: {matchStatus.server} • Mapa: {matchStatus.map}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(matchStatus.status)}
              <Button variant="outline" size="sm" onClick={() => setShowCommandDialog(true)}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Enviar Comando
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="status">Status</TabsTrigger>
              <TabsTrigger value="players">Jogadores</TabsTrigger>
              <TabsTrigger value="events">Eventos</TabsTrigger>
              <TabsTrigger value="logs">Logs</TabsTrigger>
            </TabsList>

            <TabsContent value="status" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="p-4 border rounded-md">
                    <h3 className="font-medium mb-2">Placar</h3>
                    <div className="flex items-center justify-center text-2xl font-bold">
                      <div className="text-center">
                        <Badge variant="outline" className="mb-2">
                          {matchStatus.teamT}
                        </Badge>
                        <div>{matchStatus.scoreT}</div>
                      </div>
                      <div className="mx-4">vs</div>
                      <div className="text-center">
                        <Badge variant="outline" className="mb-2">
                          {matchStatus.teamCT}
                        </Badge>
                        <div>{matchStatus.scoreCT}</div>
                      </div>
                    </div>
                    <div className="text-center mt-2 text-sm text-muted-foreground">
                      Round: {matchStatus.round}/{matchStatus.maxRounds}
                    </div>
                  </div>

                  <div className="p-4 border rounded-md">
                    <h3 className="font-medium mb-2">Status de Ready</h3>
                    {getReadyStatus()}
                    <div className="text-sm text-muted-foreground mt-2">
                      {matchStatus.playersReady} de {matchStatus.totalPlayers} jogadores prontos
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 border rounded-md">
                    <h3 className="font-medium mb-2">Informações da Partida</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">ID da Partida:</span>
                        <span>{matchStatus.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Mapa:</span>
                        <span>{matchStatus.map}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Início:</span>
                        <span>{new Date(matchStatus.startTime).toLocaleString()}</span>
                      </div>
                      {matchStatus.timeRemaining !== null && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Tempo Restante:</span>
                          <span>
                            {Math.floor(matchStatus.timeRemaining / 60)}:
                            {(matchStatus.timeRemaining % 60).toString().padStart(2, "0")}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-4 border rounded-md">
                    <h3 className="font-medium mb-2">Demos e Gravações</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Demo do Servidor</span>
                        {matchStatus.demoUrl ? (
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        ) : (
                          <Badge variant="outline">Indisponível</Badge>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Demo HLTV</span>
                        {matchStatus.hltvUrl ? (
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        ) : (
                          <Badge variant="outline">Indisponível</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-md">
                <h3 className="font-medium mb-2">Comandos Rápidos</h3>
                <div className="flex flex-wrap gap-2">
                  {availableCommands.length > 0 ? (
                    availableCommands.map((cmd) => (
                      <Button key={cmd.command} variant="outline" size="sm" onClick={() => setCommandInput(cmd.command)}>
                        {cmd.command.replace("!", "").toUpperCase()}
                      </Button>
                    ))
                  ) : (
                    <span className="text-muted-foreground text-sm">Nenhum comando disponível no momento.</span>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="players">
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ping</TableHead>
                      <TableHead>K/D/A</TableHead>
                      <TableHead>HS</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {matchPlayers.map((player) => (
                      <TableRow key={player.steamId}>
                        <TableCell className="font-medium flex items-center">
                          {player.isAdmin && <Shield className="h-3 w-3 mr-1 text-blue-500" />}
                          {player.name}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              player.team === "T"
                                ? "bg-orange-100 text-orange-800 border-orange-300"
                                : player.team === "CT"
                                  ? "bg-blue-100 text-blue-800 border-blue-300"
                                  : ""
                            }
                          >
                            {player.team || "SPEC"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {player.isConnected ? (
                            player.isReady ? (
                              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                                Pronto
                              </Badge>
                            ) : (
                              <Badge variant="outline">Não Pronto</Badge>
                            )
                          ) : (
                            <Badge variant="destructive">Desconectado</Badge>
                          )}
                        </TableCell>
                        <TableCell>{player.ping} ms</TableCell>
                        <TableCell>
                          {player.kills}/{player.deaths}/{player.assists}
                        </TableCell>
                        <TableCell>{player.headshots}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="events">
              <div className="border rounded-md">
                <ScrollArea className="h-[400px]">
                  <div className="p-4 space-y-2">
                    {matchEvents.map((event) => (
                      <div key={event.id} className="flex items-start gap-2 pb-2 border-b">
                        <div className="mt-0.5">{getEventIcon(event.type)}</div>
                        <div className="flex-1">
                          <div className="text-sm">{event.message}</div>
                          <div className="text-xs text-muted-foreground">
                            {formatTimestamp(event.timestamp)}
                            {event.player && ` • ${event.player}`}
                            {event.team && ` • Time ${event.team}`}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>

            <TabsContent value="logs">
              <div className="border rounded-md">
                <ScrollArea className="h-[400px]">
                  <div className="p-4 space-y-2 font-mono text-xs bg-black text-green-400">
                    {matchEvents.length > 0 ? (
                      matchEvents.map((event) => (
                        <div key={event.id}>
                          [{formatTimestamp(event.timestamp)}] {event.type.toUpperCase()} {event.player ? `(${event.player})` : ""} {event.message}
                        </div>
                      ))
                    ) : (
                      <div className="text-muted-foreground">Nenhum log disponível.</div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">Última atualização: {new Date().toLocaleTimeString()}</div>
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={showCommandDialog} onOpenChange={setShowCommandDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enviar Comando</DialogTitle>
            <DialogDescription>Envie um comando para o servidor CS 1.6. Os comandos começam com "!".</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="command">Comando</Label>
              <Input
                id="command"
                placeholder="!ready"
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSendCommand()
                  }
                }}
              />
            </div>
            <div className="space-y-2">
              <Label>Comandos Disponíveis</Label>
              <ScrollArea className="h-32 border rounded-md p-2">
                <div className="space-y-1">
                  {availableCommands.map((cmd) => (
                    <div
                      key={cmd.command}
                      className="flex items-center justify-between text-sm cursor-pointer hover:bg-muted p-1 rounded"
                      onClick={() => setCommandInput(cmd.command)}
                    >
                      <span className="font-mono">{cmd.command}</span>
                      <span className="text-muted-foreground">{cmd.description}</span>
                      {cmd.requiresAdmin && (
                        <Badge variant="outline" className="text-xs">
                          Admin
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCommandDialog(false)}>
              Cancelar
            </Button>
            <LoadingButton onClick={handleSendCommand} loading={isLoading}>
              Enviar
            </LoadingButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
