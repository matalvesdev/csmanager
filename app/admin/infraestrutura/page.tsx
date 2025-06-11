"use client"

import { useInfraStore } from "@/lib/store-infra"
import { useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ServerDetailsDialog } from "@/components/infra/server-details-dialog"
import { ServerStatusCard } from "@/components/infra/server-status-card"
import { SystemMetrics } from "@/components/infra/system-metrics"
import { ContainerLogs } from "@/components/infra/container-logs"
import { HltvDemoCard } from "@/components/infra/hltv-demo-card"
import { Plus, Search, Server, Database, Film, RefreshCw, Download } from "lucide-react"
import { useWebSocket } from "@/hooks/use-websocket"
import type { DockerContainer } from "@/types/infra"
import { CreateServerDialog } from "@/components/infra/create-server-dialog"
import { CreateContainerDialog } from "@/components/infra/create-container-dialog"
import { CreateDatabaseDialog } from "@/components/infra/create-database-dialog"
import { DialogHeader } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@radix-ui/react-dialog"

export default function InfraestruturaPage() {
  const {
    systemMetrics,
    containers = [],
    isLoading,
    fetchSystemMetrics,
    fetchContainers,
    startContainer,
    stopContainer,
    restartContainer,
  } = useInfraStore()

  const { toast } = useToast()
  const [serverFilter, setServerFilter] = useState("")
  const [containerFilter, setContainerFilter] = useState("")
  const [demoFilter, setDemoFilter] = useState("")
  const [selectedContainer, setSelectedContainer] = useState<DockerContainer | null>(null)
  const [selectedDemo, setSelectedDemo] = useState<any>(null)
  const [selectedServer, setSelectedServer] = useState<any>(null)
  const [servers, setServers] = useState<any[]>([])
  const [hltvDemos, setHltvDemos] = useState<any[]>([])
  const [createServerOpen, setCreateServerOpen] = useState(false)
  const [createContainerOpen, setCreateContainerOpen] = useState(false)
  const [createDatabaseOpen, setCreateDatabaseOpen] = useState(false)
  const { isConnected: wsConnected = false, latestMetrics } = useWebSocket()

  useEffect(() => {
    fetchSystemMetrics()
    fetchContainers()
    fetchServers()
    fetchDemos()
    const interval = setInterval(() => {
      fetchSystemMetrics()
      fetchContainers()
      fetchServers()
      fetchDemos()
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  async function fetchServers() {
    try {
      const res = await fetch("/api/docker/containers")
      const data = await res.json()
      setServers(data)
    } catch (e) {
      setServers([])
    }
  }

  async function fetchDemos() {
    try {
      const res = await fetch("/api/hltv/demos")
      const data = await res.json()
      setHltvDemos(data)
    } catch (e) {
      setHltvDemos([])
    }
  }

  // Atualize as métricas quando receber via WebSocket
  useEffect(() => {
    if (latestMetrics) {
      // Update system metrics from WebSocket
      // This would be handled by the store
    }
  }, [latestMetrics])

  // Filtros com verificação de segurança
  const filteredServers = serverFilter
    ? servers.filter(
      (server) =>
        server.name?.toLowerCase().includes(serverFilter.toLowerCase()) ||
        server.ip?.includes(serverFilter) ||
        server.status?.includes(serverFilter),
    )
    : servers

  const filteredContainers = containerFilter
    ? containers.filter(
      (container) =>
        container.name?.toLowerCase().includes(containerFilter.toLowerCase()) ||
        container.image?.toLowerCase().includes(containerFilter.toLowerCase()) ||
        container.status?.includes(containerFilter),
    )
    : containers

  const filteredDemos = demoFilter
    ? hltvDemos.filter(
      (demo) =>
        demo.name?.toLowerCase().includes(demoFilter.toLowerCase()) ||
        demo.partida?.toLowerCase().includes(demoFilter.toLowerCase()),
    )
    : hltvDemos

  const handleDownloadDemo = (demo: any) => {
    toast({
      title: "Download iniciado",
      description: `O download do demo ${demo.name} foi iniciado.`,
    })
  }

  const handleStartServer = async (id: string) => {
    try {
      await startContainer(id)
      toast({
        title: "Servidor iniciado",
        description: "O servidor foi iniciado com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao iniciar o servidor.",
        variant: "destructive",
      })
    }
  }

  const handleStopServer = async (id: string) => {
    try {
      await stopContainer(id)
      toast({
        title: "Servidor parado",
        description: "O servidor foi parado com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao parar o servidor.",
        variant: "destructive",
      })
    }
  }

  const handleRestartServer = async (id: string) => {
    try {
      await restartContainer(id)
      toast({
        title: "Servidor reiniciado",
        description: "O servidor foi reiniciado com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao reiniciar o servidor.",
        variant: "destructive",
      })
    }
  }

  return (
    <ProtectedRoute adminOnly>
      <div className="container py-6 space-y-6">
        <Breadcrumb items={[{ label: "Admin", href: "/admin" }, { label: "Infraestrutura" }]} />

        {/* Header com indicador de conexão WebSocket */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Infraestrutura</h1>
            <div className="flex items-center gap-2">
              <p className="text-muted-foreground">Gerencie servidores, containers e recursos do sistema</p>
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${wsConnected ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
                <span className="text-xs text-muted-foreground">{wsConnected ? "Conectado" : "Desconectado"}</span>
              </div>
            </div>
          </div>
          <Button onClick={() => fetchSystemMetrics()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Atualizar Métricas
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {isLoading && !systemMetrics ? (
              <Skeleton className="h-[300px] w-full" />
            ) : systemMetrics ? (
              <SystemMetrics metrics={systemMetrics} />
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center h-[300px]">
                  <p className="text-muted-foreground">Erro ao carregar métricas do sistema</p>
                </CardContent>
              </Card>
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
              <CardDescription>Operações comuns de infraestrutura</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full" variant="outline" onClick={() => setCreateServerOpen(true)}>
                <Server className="mr-2 h-4 w-4" />
                Criar Novo Servidor
              </Button>
              <Button className="w-full" variant="outline" onClick={() => setCreateDatabaseOpen(true)}>
                <Database className="mr-2 h-4 w-4" />
                Criar Novo Banco de Dados
              </Button>
              <Button className="w-full" variant="outline">
                <Film className="mr-2 h-4 w-4" />
                Gerenciar Demos HLTV
              </Button>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="servers" className="space-y-4">
          <TabsList>
            <TabsTrigger value="servers">Servidores</TabsTrigger>
            <TabsTrigger value="containers">Containers</TabsTrigger>
            <TabsTrigger value="demos">Demos HLTV</TabsTrigger>
          </TabsList>

          <TabsContent value="servers" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="relative max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar servidores..."
                  value={serverFilter}
                  onChange={(e) => setServerFilter(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Button onClick={() => setCreateServerOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Novo Servidor
              </Button>
            </div>

            {isLoading && servers.length === 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-[300px] w-full" />
                ))}
              </div>
            ) : filteredServers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredServers.map((server) => (
                  <ServerStatusCard
                    key={server.id}
                    server={server}
                    onStart={handleStartServer}
                    onStop={handleStopServer}
                    onRestart={handleRestartServer}
                    onViewDetails={(id) => {
                      const found = servers.find((s) => s.id === id)
                      setSelectedServer(found)
                    }}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Server className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">Nenhum servidor encontrado</p>
                  <p className="text-muted-foreground text-center mb-4">
                    Não há servidores disponíveis ou correspondentes ao filtro aplicado.
                  </p>
                  <Button>Criar Novo Servidor</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="containers" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="relative max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar containers..."
                  value={containerFilter}
                  onChange={(e) => setContainerFilter(e.target.value)}
                  className="pl-8"
                />
              </div>
              <div className="flex gap-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os status</SelectItem>
                    <SelectItem value="running">Em execução</SelectItem>
                    <SelectItem value="stopped">Parados</SelectItem>
                    <SelectItem value="exited">Encerrados</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={() => setCreateContainerOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Container
                </Button>
              </div>
            </div>

            {isLoading && containers.length === 0 ? (
              <Skeleton className="h-[400px] w-full" />
            ) : filteredContainers.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>Containers Docker</CardTitle>
                  <CardDescription>Gerencie os containers da aplicação</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredContainers.map((container) => (
                      <div
                        key={container.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
                        onClick={() => setSelectedContainer(container)}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-3 h-3 rounded-full ${container.status === "running"
                              ? "bg-green-500 animate-pulse"
                              : container.status === "stopped"
                                ? "bg-gray-500"
                                : "bg-red-500"
                              }`}
                          />
                          <div>
                            <div className="font-medium">{container.name}</div>
                            <div className="text-sm text-muted-foreground">{container.image}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-sm">Status: {container.status}</div>
                            <div className="text-sm text-muted-foreground">
                              Criado: {new Date(container.created).toLocaleDateString("pt-BR")}
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Ver Logs
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Database className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">Nenhum container encontrado</p>
                  <p className="text-muted-foreground text-center mb-4">
                    Não há containers disponíveis ou correspondentes ao filtro aplicado.
                  </p>
                  <Button>Criar Novo Container</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="demos" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="relative max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar demos..."
                  value={demoFilter}
                  onChange={(e) => setDemoFilter(e.target.value)}
                  className="pl-8"
                />
              </div>
              <div className="flex gap-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os status</SelectItem>
                    <SelectItem value="disponivel">Disponível</SelectItem>
                    <SelectItem value="processando">Processando</SelectItem>
                    <SelectItem value="erro">Erro</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={fetchDemos}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Atualizar
                </Button>
              </div>
            </div>

            {isLoading && hltvDemos.length === 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-[250px] w-full" />
                ))}
              </div>
            ) : filteredDemos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDemos.map((demo) => (
                  <HltvDemoCard
                    key={demo.id}
                    demo={demo}
                    onDownload={handleDownloadDemo}
                    onView={(demo) => setSelectedDemo(demo)}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Film className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">Nenhum demo encontrado</p>
                  <p className="text-muted-foreground text-center mb-4">
                    Não há demos HLTV disponíveis ou correspondentes ao filtro aplicado.
                  </p>
                  <Button onClick={fetchDemos}>Atualizar Lista</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Dialog para logs do container */}
        <Dialog open={!!selectedContainer} onOpenChange={() => setSelectedContainer(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>Logs do Container</DialogTitle>
              <DialogDescription>
                {selectedContainer?.name} • {selectedContainer?.image}
              </DialogDescription>
            </DialogHeader>
            {selectedContainer && (
              <ContainerLogs
                container={selectedContainer}
                onRefresh={() => {
                  // Refresh logs do container
                  setSelectedContainer({ ...selectedContainer })
                }}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Dialog para detalhes do demo */}
        <Dialog open={!!selectedDemo} onOpenChange={() => setSelectedDemo(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Detalhes do Demo</DialogTitle>
              <DialogDescription>{selectedDemo?.name}</DialogDescription>
            </DialogHeader>
            {selectedDemo && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Partida</label>
                    <p className="text-sm">{selectedDemo.partida}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Data</label>
                    <p className="text-sm">{new Date(selectedDemo.data).toLocaleString("pt-BR")}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Duração</label>
                    <p className="text-sm">
                      {Math.floor(selectedDemo.duracao / 60)}:{(selectedDemo.duracao % 60).toString().padStart(2, "0")}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Tamanho</label>
                    <p className="text-sm">{(selectedDemo.tamanho / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleDownloadDemo(selectedDemo)}
                    disabled={selectedDemo.status !== "disponivel"}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  <Button variant="outline" onClick={() => setSelectedDemo(null)}>
                    Fechar
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Dialog para detalhes do servidor */}
        <Dialog open={!!selectedServer} onOpenChange={() => setSelectedServer(null)}>
          <DialogContent className="max-w-2xl">
            {selectedServer && (
              <ServerDetailsDialog server={selectedServer} onClose={() => setSelectedServer(null)} />
            )}
          </DialogContent>
        </Dialog>

        {/* Dialog para criação de servidor */}
        <CreateServerDialog
          open={createServerOpen}
          onOpenChange={open => {
            setCreateServerOpen(open)
            if (!open) fetchServers()
          }}
        />

        {/* Dialog para criação de container */}
        <CreateContainerDialog
          open={createContainerOpen}
          onOpenChange={open => {
            setCreateContainerOpen(open)
            if (!open) fetchContainers()
          }}
        />

        {/* Dialog para criação de banco de dados */}
        <CreateDatabaseDialog
          open={createDatabaseOpen}
          onOpenChange={open => {
            setCreateDatabaseOpen(open)
            if (!open) fetchContainers()
          }}
        />
      </div>
    </ProtectedRoute>
  )
}
