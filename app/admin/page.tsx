"use client"

import { useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Users, Trophy, Calendar, Shield, Settings, AlertTriangle, Database, Server } from "lucide-react"
import { formatDate } from "@/lib/format"
import { useDashboardStore } from "@/lib/store-dashboard"
import { useInfraStore } from "@/lib/store-infra"
import { useWebSocket } from "@/hooks/use-websocket"
import { SystemStatus } from "@/components/layout/system-status"

// Mock data para atividades recentes
const atividadesRecentes = [
  {
    id: "1",
    tipo: "login",
    usuario: "João Moderador",
    descricao: "Fez login no sistema",
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    ip: "192.168.1.100",
  },
  {
    id: "2",
    tipo: "torneio_criado",
    usuario: "Admin Sistema",
    descricao: "Criou o torneio 'Copa de Verão 2024'",
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
    ip: "192.168.1.50",
  },
  {
    id: "3",
    tipo: "partida_iniciada",
    usuario: "Sistema",
    descricao: "Partida Alpha Squad vs Beta Force iniciada automaticamente",
    timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
    ip: "127.0.0.1",
  },
  {
    id: "4",
    tipo: "usuario_criado",
    usuario: "Admin Sistema",
    descricao: "Criou novo usuário 'Carlos Organizador'",
    timestamp: new Date(Date.now() - 4 * 3600000).toISOString(),
    ip: "192.168.1.50",
  },
]

const alertasSeguranca = [
  {
    id: "1",
    tipo: "warning",
    titulo: "Tentativas de login falharam",
    descricao: "5 tentativas de login falharam para admin@cs16tournament.com",
    timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
  },
  {
    id: "2",
    tipo: "info",
    titulo: "Backup realizado",
    descricao: "Backup automático do banco de dados realizado com sucesso",
    timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
]

export default function AdminPage() {
  const { usuario } = useAuth()
  const { usuarios, stats, fetchUsuarios, fetchStats, isLoading } = useDashboardStore()
  const { servers = [], containers = [] } = useInfraStore()
  const { isConnected: wsConnected = false, containerEvents = [] } = useWebSocket()

  useEffect(() => {
    fetchUsuarios()
    fetchStats()
  }, [fetchUsuarios, fetchStats])

  if (isLoading) {
    return (
      <ProtectedRoute adminOnly>
        <div className="container py-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute adminOnly>
      <div className="container py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Painel Administrativo</h1>
            <p className="text-muted-foreground">Bem-vindo, {usuario?.nome}. Gerencie o sistema CS 1.6 Tournament.</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
              Sistema Online
            </Badge>
            {wsConnected && (
              <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                WebSocket Conectado
              </Badge>
            )}
          </div>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.usuariosAtivos}</div>
              <p className="text-xs text-muted-foreground">+{stats.novosUsuarios30Dias} novos este mês</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Torneios Ativos</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.torneiosAtivos}</div>
              <p className="text-xs text-muted-foreground">de {stats.totalTorneios} total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Partidas em Andamento</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.partidasEmAndamento}</div>
              <p className="text-xs text-muted-foreground">de {stats.totalPartidas} total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Servidores Online</CardTitle>
              <Server className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.servidoresOnline}</div>
              <p className="text-xs text-muted-foreground">{stats.containersAtivos} containers ativos</p>
            </CardContent>
          </Card>
        </div>

        {/* Status do Sistema */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Status do Sistema</h2>
          <SystemStatus />
        </div>

        <Tabs defaultValue="atividades" className="space-y-4">
          <TabsList>
            <TabsTrigger value="atividades">Atividades Recentes</TabsTrigger>
            <TabsTrigger value="usuarios">Gestão de Usuários</TabsTrigger>
            <TabsTrigger value="sistema">Sistema</TabsTrigger>
            <TabsTrigger value="seguranca">Segurança</TabsTrigger>
          </TabsList>

          <TabsContent value="atividades" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Atividades Recentes</CardTitle>
                <CardDescription>Últimas ações realizadas no sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuário</TableHead>
                      <TableHead>Ação</TableHead>
                      <TableHead>Data/Hora</TableHead>
                      <TableHead>IP</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {atividadesRecentes.map((atividade) => (
                      <TableRow key={atividade.id}>
                        <TableCell className="font-medium">{atividade.usuario}</TableCell>
                        <TableCell>{atividade.descricao}</TableCell>
                        <TableCell>{formatDate(atividade.timestamp)}</TableCell>
                        <TableCell className="text-muted-foreground">{atividade.ip}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Eventos de Containers */}
            {containerEvents.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Eventos de Containers</CardTitle>
                  <CardDescription>Últimos eventos do sistema de infraestrutura</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {containerEvents.slice(0, 5).map((event, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <span className="font-medium">{event.containerName}</span>
                          <span className="text-sm text-muted-foreground ml-2">
                            {event.action === "start"
                              ? "foi iniciado"
                              : event.action === "stop"
                                ? "foi parado"
                                : event.action}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">{formatDate(event.timestamp)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="usuarios" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Gestão de Usuários</h3>
              <Button>
                <Users className="mr-2 h-4 w-4" />
                Novo Usuário
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Administradores</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{usuarios.filter((u) => u.role === "admin").length}</div>
                  <p className="text-xs text-muted-foreground">Acesso total</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Moderadores</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{usuarios.filter((u) => u.role === "moderator").length}</div>
                  <p className="text-xs text-muted-foreground">Gestão de torneios</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Usuários Comuns</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{usuarios.filter((u) => u.role === "user").length}</div>
                  <p className="text-xs text-muted-foreground">Acesso limitado</p>
                </CardContent>
              </Card>
            </div>

            {/* Lista de Usuários */}
            <Card>
              <CardHeader>
                <CardTitle>Usuários Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Último Login</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usuarios.slice(0, 5).map((usuario) => (
                      <TableRow key={usuario.id}>
                        <TableCell className="font-medium">{usuario.nome}</TableCell>
                        <TableCell>{usuario.email}</TableCell>
                        <TableCell>
                          <Badge variant={usuario.role === "admin" ? "default" : "secondary"}>{usuario.role}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={usuario.status === "ativo" ? "default" : "secondary"}>{usuario.status}</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{formatDate(usuario.ultimoLogin)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sistema" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Banco de Dados
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Espaço Usado:</span>
                    <span className="font-medium">2.4 GB</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Último Backup:</span>
                    <span className="font-medium">{formatDate(new Date().toISOString())}</span>
                  </div>
                  <Button variant="outline" className="w-full">
                    Fazer Backup Agora
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Configurações
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Versão:</span>
                    <span className="font-medium">1.2.3</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Uptime:</span>
                    <span className="font-medium">99.8%</span>
                  </div>
                  <Button variant="outline" className="w-full">
                    Configurações Avançadas
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="seguranca" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Alertas de Segurança
                </CardTitle>
                <CardDescription>Monitoramento de atividades suspeitas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {alertasSeguranca.map((alerta) => (
                    <div key={alerta.id} className="flex items-start gap-3 p-3 border rounded-lg">
                      <AlertTriangle
                        className={`h-5 w-5 mt-0.5 ${alerta.tipo === "warning" ? "text-yellow-500" : "text-blue-500"}`}
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{alerta.titulo}</h4>
                        <p className="text-sm text-muted-foreground">{alerta.descricao}</p>
                        <p className="text-xs text-muted-foreground mt-1">{formatDate(alerta.timestamp)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  )
}
