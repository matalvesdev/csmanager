"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { useToast } from "@/components/ui/use-toast"
import { CSServerConfig } from "@/components/infra/cs-server-config"
import { MatchManager } from "@/components/matchbot/match-manager"
import { Plus, Play, Pause, RefreshCw, Settings, Trash2, Eye, Download, Upload } from "lucide-react"

interface CSServer {
  id: string
  name: string
  ip: string
  port: number
  status: "online" | "offline" | "starting" | "stopping"
  players: number
  maxPlayers: number
  map: string
  version: string
  rehlds: boolean
  regamedll: boolean
  matchbot: boolean
  metamod: boolean
  uptime: number
  lastUpdate: string
}

export default function ServidoresPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("servers")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showConfigDialog, setShowConfigDialog] = useState(false)
  const [showMatchDialog, setShowMatchDialog] = useState(false)
  const [selectedServer, setSelectedServer] = useState<CSServer | null>(null)
  const [servers, setServers] = useState<CSServer[]>([
    {
      id: "server-1",
      name: "CS 1.6 Tournament Server #1",
      ip: "192.168.1.100",
      port: 27015,
      status: "online",
      players: 10,
      maxPlayers: 32,
      map: "de_dust2",
      version: "1.6",
      rehlds: true,
      regamedll: true,
      matchbot: true,
      metamod: true,
      uptime: 86400,
      lastUpdate: new Date().toISOString(),
    },
    {
      id: "server-2",
      name: "CS 1.6 Tournament Server #2",
      ip: "192.168.1.101",
      port: 27015,
      status: "offline",
      players: 0,
      maxPlayers: 32,
      map: "de_inferno",
      version: "1.6",
      rehlds: true,
      regamedll: true,
      matchbot: false,
      metamod: true,
      uptime: 0,
      lastUpdate: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: "server-3",
      name: "CS 1.6 Tournament Server #3",
      ip: "192.168.1.102",
      port: 27015,
      status: "starting",
      players: 0,
      maxPlayers: 32,
      map: "de_mirage",
      version: "1.6",
      rehlds: true,
      regamedll: false,
      matchbot: true,
      metamod: true,
      uptime: 0,
      lastUpdate: new Date(Date.now() - 300000).toISOString(),
    },
  ])

  const handleServerAction = async (serverId: string, action: "start" | "stop" | "restart") => {
    setIsLoading(true)
    try {
      // Simulação de ação no servidor
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setServers((prev) =>
        prev.map((server) =>
          server.id === serverId
            ? {
                ...server,
                status: action === "start" ? "starting" : action === "stop" ? "stopping" : "starting",
                lastUpdate: new Date().toISOString(),
              }
            : server,
        ),
      )

      // Simular mudança de status após um tempo
      setTimeout(() => {
        setServers((prev) =>
          prev.map((server) =>
            server.id === serverId
              ? {
                  ...server,
                  status: action === "stop" ? "offline" : "online",
                  players: action === "stop" ? 0 : server.players,
                  uptime: action === "stop" ? 0 : Date.now(),
                }
              : server,
          ),
        )
      }, 3000)

      toast({
        title: "Ação executada",
        description: `O servidor foi ${action === "start" ? "iniciado" : action === "stop" ? "parado" : "reiniciado"} com sucesso.`,
      })
    } catch (error) {
      toast({
        title: "Erro na ação",
        description: "Não foi possível executar a ação no servidor.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteServer = async (serverId: string) => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setServers((prev) => prev.filter((server) => server.id !== serverId))
      toast({
        title: "Servidor removido",
        description: "O servidor foi removido com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro ao remover",
        description: "Não foi possível remover o servidor.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: CSServer["status"]) => {
    const variants = {
      online: "success",
      offline: "destructive",
      starting: "warning",
      stopping: "warning",
    } as const

    const labels = {
      online: "Online",
      offline: "Offline",
      starting: "Iniciando",
      stopping: "Parando",
    }

    return (
      <Badge
        variant={variants[status]}
        className={status === "online" ? "bg-green-100 text-green-800 border-green-300" : ""}
      >
        {labels[status]}
      </Badge>
    )
  }

  const formatUptime = (uptime: number) => {
    if (uptime === 0) return "0s"
    const hours = Math.floor(uptime / 3600)
    const minutes = Math.floor((uptime % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Servidores CS 1.6</h1>
          <Breadcrumb
            items={[
              { label: "Admin", href: "/admin" },
              { label: "Servidores", href: "/admin/servidores" },
            ]}
          />
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Servidor
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="servers">Servidores</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoramento</TabsTrigger>
        </TabsList>

        <TabsContent value="servers">
          <Card>
            <CardHeader>
              <CardTitle>Lista de Servidores</CardTitle>
              <CardDescription>Gerencie seus servidores CS 1.6 com ReHLDS, ReGameDLL e MatchBot</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Endereço</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Jogadores</TableHead>
                      <TableHead>Mapa</TableHead>
                      <TableHead>Componentes</TableHead>
                      <TableHead>Uptime</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {servers.map((server) => (
                      <TableRow key={server.id}>
                        <TableCell className="font-medium">{server.name}</TableCell>
                        <TableCell>
                          {server.ip}:{server.port}
                        </TableCell>
                        <TableCell>{getStatusBadge(server.status)}</TableCell>
                        <TableCell>
                          {server.players}/{server.maxPlayers}
                        </TableCell>
                        <TableCell>{server.map}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {server.rehlds && (
                              <Badge variant="outline" className="text-xs">
                                ReHLDS
                              </Badge>
                            )}
                            {server.regamedll && (
                              <Badge variant="outline" className="text-xs">
                                ReGameDLL
                              </Badge>
                            )}
                            {server.matchbot && (
                              <Badge variant="outline" className="text-xs">
                                MatchBot
                              </Badge>
                            )}
                            {server.metamod && (
                              <Badge variant="outline" className="text-xs">
                                Metamod
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{formatUptime(server.uptime)}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {server.status === "online" ? (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleServerAction(server.id, "stop")}
                                  disabled={isLoading}
                                >
                                  <Pause className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => {
                                    setSelectedServer(server)
                                    setShowMatchDialog(true)
                                  }}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </>
                            ) : (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleServerAction(server.id, "start")}
                                disabled={isLoading || server.status === "starting"}
                              >
                                <Play className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleServerAction(server.id, "restart")}
                              disabled={isLoading}
                            >
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => {
                                setSelectedServer(server)
                                setShowConfigDialog(true)
                              }}
                            >
                              <Settings className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-600"
                              onClick={() => handleDeleteServer(server.id)}
                              disabled={isLoading}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Templates de Configuração</CardTitle>
              <CardDescription>Templates pré-configurados para diferentes tipos de servidor</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">Servidor de Torneio</CardTitle>
                    <CardDescription>Configuração completa para torneios competitivos</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>ReHLDS:</span>
                        <Badge variant="outline">✓ Ativado</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>ReGameDLL:</span>
                        <Badge variant="outline">✓ Ativado</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>MatchBot:</span>
                        <Badge variant="outline">✓ Ativado</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Tickrate:</span>
                        <span>100</span>
                      </div>
                    </div>
                    <Button className="w-full mt-4" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Usar Template
                    </Button>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">Servidor Público</CardTitle>
                    <CardDescription>Configuração para servidores públicos casuais</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>ReHLDS:</span>
                        <Badge variant="outline">✓ Ativado</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>ReGameDLL:</span>
                        <Badge variant="outline">✗ Desativado</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>MatchBot:</span>
                        <Badge variant="outline">✗ Desativado</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Tickrate:</span>
                        <span>66</span>
                      </div>
                    </div>
                    <Button className="w-full mt-4" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Usar Template
                    </Button>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">Servidor de Treino</CardTitle>
                    <CardDescription>Configuração para treinos e scrimmages</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>ReHLDS:</span>
                        <Badge variant="outline">✓ Ativado</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>ReGameDLL:</span>
                        <Badge variant="outline">✓ Ativado</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>MatchBot:</span>
                        <Badge variant="outline">✓ Ativado</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Tickrate:</span>
                        <span>128</span>
                      </div>
                    </div>
                    <Button className="w-full mt-4" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Usar Template
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6">
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Importar Template
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Status dos Servidores</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {servers.map((server) => (
                    <div key={server.id} className="flex items-center justify-between p-3 border rounded-md">
                      <div>
                        <div className="font-medium">{server.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {server.ip}:{server.port}
                        </div>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(server.status)}
                        <div className="text-sm text-muted-foreground mt-1">
                          {server.players}/{server.maxPlayers} jogadores
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Estatísticas Gerais</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total de Servidores:</span>
                    <span className="font-medium">{servers.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Servidores Online:</span>
                    <span className="font-medium text-green-600">
                      {servers.filter((s) => s.status === "online").length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Servidores Offline:</span>
                    <span className="font-medium text-red-600">
                      {servers.filter((s) => s.status === "offline").length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total de Jogadores:</span>
                    <span className="font-medium">{servers.reduce((acc, server) => acc + server.players, 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Capacidade Total:</span>
                    <span className="font-medium">{servers.reduce((acc, server) => acc + server.maxPlayers, 0)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialog para criar servidor */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Criar Novo Servidor CS 1.6</DialogTitle>
            <DialogDescription>Configure um novo servidor com ReHLDS, ReGameDLL e MatchBot</DialogDescription>
          </DialogHeader>
          <CSServerConfig
            onSave={async (config) => {
              // Simular criação do servidor
              await new Promise((resolve) => setTimeout(resolve, 2000))
              setShowCreateDialog(false)
              toast({
                title: "Servidor criado",
                description: "O novo servidor foi criado com sucesso.",
              })
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog para configurar servidor */}
      <Dialog open={showConfigDialog} onOpenChange={setShowConfigDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Configurar Servidor</DialogTitle>
            <DialogDescription>
              {selectedServer ? `Configurações do servidor: ${selectedServer.name}` : ""}
            </DialogDescription>
          </DialogHeader>
          {selectedServer && (
            <CSServerConfig
              serverId={selectedServer.id}
              onSave={async (config) => {
                await new Promise((resolve) => setTimeout(resolve, 1000))
                setShowConfigDialog(false)
                toast({
                  title: "Configuração salva",
                  description: "As configurações do servidor foram atualizadas.",
                })
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog para gerenciar partida */}
      <Dialog open={showMatchDialog} onOpenChange={setShowMatchDialog}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Gerenciar Partida</DialogTitle>
            <DialogDescription>
              {selectedServer ? `Partida em andamento no servidor: ${selectedServer.name}` : ""}
            </DialogDescription>
          </DialogHeader>
          {selectedServer && <MatchManager serverId={selectedServer.id} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}
