"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useAppStore } from "@/lib/store"
import { formatDate, formatStatus } from "@/lib/format"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle, Calendar, Users } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Bracket } from "@/components/torneios/bracket"

export default function TorneioDetailPage() {
  const params = useParams()
  const id = params.id as string
  const { currentTorneio, isLoading, fetchTorneioById } = useAppStore()

  useEffect(() => {
    fetchTorneioById(id)
  }, [id, fetchTorneioById])

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

  if (!currentTorneio) {
    return (
      <div className="container py-6 space-y-6">
        <h1 className="text-3xl font-bold">Torneio não encontrado</h1>
        <p>O torneio que você está procurando não existe ou foi removido.</p>
        <Link href="/torneios">
          <Button>Voltar para Torneios</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{currentTorneio.nome}</h1>
          <p className="text-muted-foreground">
            {formatDate(currentTorneio.dataInicio)} - {formatDate(currentTorneio.dataFim)}
          </p>
        </div>
        <Badge
          variant="outline"
          className={`
            ${
              currentTorneio.status === "em_andamento"
                ? "bg-green-500/10 text-green-500 border-green-500/20"
                : currentTorneio.status === "finalizado"
                  ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                  : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
            }
          `}
        >
          {formatStatus(currentTorneio.status)}
        </Badge>
      </div>

      <Tabs defaultValue="grupos">
        <TabsList>
          <TabsTrigger value="grupos">Grupos</TabsTrigger>
          <TabsTrigger value="partidas">Partidas</TabsTrigger>
          <TabsTrigger value="brackets">Brackets</TabsTrigger>
          <TabsTrigger value="times">Times</TabsTrigger>
          <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="grupos" className="space-y-4 pt-4">
          {currentTorneio.grupos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentTorneio.grupos.map((grupo) => (
                <Card key={grupo.id}>
                  <CardHeader>
                    <CardTitle>{grupo.nome}</CardTitle>
                    <CardDescription>{grupo.times.length} times</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Time</TableHead>
                          <TableHead className="text-right">J</TableHead>
                          <TableHead className="text-right">V</TableHead>
                          <TableHead className="text-right">D</TableHead>
                          <TableHead className="text-right">Pontos</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {grupo.times.map((time) => (
                          <TableRow key={time.id}>
                            <TableCell className="font-medium">{time.nome}</TableCell>
                            <TableCell className="text-right">0</TableCell>
                            <TableCell className="text-right">0</TableCell>
                            <TableCell className="text-right">0</TableCell>
                            <TableCell className="text-right">0</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground mb-4">Nenhum grupo criado para este torneio</p>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Criar Grupos
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="partidas" className="space-y-4 pt-4">
          {currentTorneio.partidas.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Partidas do Torneio</CardTitle>
                <CardDescription>{currentTorneio.partidas.length} partidas no total</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Times</TableHead>
                      <TableHead>Mapa</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Placar</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentTorneio.partidas.map((partida) => (
                      <TableRow key={partida.id}>
                        <TableCell className="font-medium">
                          {partida.timeA.nome} vs {partida.timeB.nome}
                        </TableCell>
                        <TableCell>{partida.mapa || "N/A"}</TableCell>
                        <TableCell>{formatDate(partida.inicioPrevisto)}</TableCell>
                        <TableCell>
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
                            {formatStatus(partida.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {partida.placar ? `${partida.placar.timeA} - ${partida.placar.timeB}` : "N/A"}
                        </TableCell>
                        <TableCell className="text-right">
                          <Link href={`/partidas/${partida.id}`}>
                            <Button size="sm">Ver</Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground mb-4">Nenhuma partida criada para este torneio</p>
                <Button>
                  <Calendar className="mr-2 h-4 w-4" />
                  Agendar Partida
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="brackets" className="space-y-4 pt-4">
          <Bracket torneio={currentTorneio} />
        </TabsContent>

        <TabsContent value="times" className="space-y-4 pt-4">
          {currentTorneio.grupos.flatMap((g) => g.times).length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Times Participantes</CardTitle>
                <CardDescription>
                  {currentTorneio.grupos.flatMap((g) => g.times).length} times participando do torneio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Jogadores</TableHead>
                      <TableHead>Grupo</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentTorneio.grupos.flatMap((grupo) =>
                      grupo.times.map((time) => (
                        <TableRow key={time.id}>
                          <TableCell className="font-medium">{time.nome}</TableCell>
                          <TableCell>{time.jogadores.length} jogadores</TableCell>
                          <TableCell>
                            {currentTorneio.grupos.find((g) => g.times.some((t) => t.id === time.id))?.nome || "N/A"}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button size="sm" variant="outline">
                              Ver Detalhes
                            </Button>
                          </TableCell>
                        </TableRow>
                      )),
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground mb-4">Nenhum time adicionado a este torneio</p>
                <Button>
                  <Users className="mr-2 h-4 w-4" />
                  Adicionar Times
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="configuracoes" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Gameplay</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Modo:</span>
                    <p className="text-muted-foreground">{currentTorneio.configuracao.modoPartida}</p>
                  </div>
                  <div>
                    <span className="font-medium">Formato:</span>
                    <p className="text-muted-foreground">{currentTorneio.configuracao.formatoMapas.toUpperCase()}</p>
                  </div>
                  <div>
                    <span className="font-medium">Tempo Round:</span>
                    <p className="text-muted-foreground">{currentTorneio.configuracao.tempoRound}s</p>
                  </div>
                  <div>
                    <span className="font-medium">Tempo Bomba:</span>
                    <p className="text-muted-foreground">{currentTorneio.configuracao.tempoBomba}s</p>
                  </div>
                  <div>
                    <span className="font-medium">Overtime:</span>
                    <p className="text-muted-foreground">{currentTorneio.configuracao.overtime ? "Sim" : "Não"}</p>
                  </div>
                  <div>
                    <span className="font-medium">Friendly Fire:</span>
                    <p className="text-muted-foreground">{currentTorneio.configuracao.friendlyFire ? "Sim" : "Não"}</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <span className="font-medium">Mapas:</span>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {currentTorneio.configuracao.mapas.map((mapa) => (
                      <Badge key={mapa} variant="secondary">
                        {mapa}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Configurações do Servidor</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Tickrate:</span>
                    <p className="text-muted-foreground">{currentTorneio.configuracao.servidor.tickrate} Hz</p>
                  </div>
                  <div>
                    <span className="font-medium">FPS Max:</span>
                    <p className="text-muted-foreground">{currentTorneio.configuracao.servidor.fps_max}</p>
                  </div>
                  <div>
                    <span className="font-medium">Max Rate:</span>
                    <p className="text-muted-foreground">{currentTorneio.configuracao.servidor.sv_maxrate}</p>
                  </div>
                  <div>
                    <span className="font-medium">Min Rate:</span>
                    <p className="text-muted-foreground">{currentTorneio.configuracao.servidor.sv_minrate}</p>
                  </div>
                  <div>
                    <span className="font-medium">Max Update Rate:</span>
                    <p className="text-muted-foreground">{currentTorneio.configuracao.servidor.sv_maxupdaterate}</p>
                  </div>
                  <div>
                    <span className="font-medium">Max Cmd Rate:</span>
                    <p className="text-muted-foreground">{currentTorneio.configuracao.servidor.sv_maxcmdrate}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Configurações HLTV</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Status:</span>
                  <Badge variant={currentTorneio.configuracao.hltv.habilitado ? "default" : "secondary"}>
                    {currentTorneio.configuracao.hltv.habilitado ? "Habilitado" : "Desabilitado"}
                  </Badge>
                </div>

                {currentTorneio.configuracao.hltv.habilitado && (
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">IP:</span>
                      <p className="text-muted-foreground">{currentTorneio.configuracao.hltv.ip}</p>
                    </div>
                    <div>
                      <span className="font-medium">Porta:</span>
                      <p className="text-muted-foreground">{currentTorneio.configuracao.hltv.porta}</p>
                    </div>
                    <div>
                      <span className="font-medium">Delay:</span>
                      <p className="text-muted-foreground">{currentTorneio.configuracao.hltv.delay}s</p>
                    </div>
                    <div>
                      <span className="font-medium">Senha:</span>
                      <p className="text-sm text-muted-foreground">
                        {currentTorneio.configuracao.hltv.senha ? "Protegido" : "Sem senha"}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Outras Configurações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <span className="font-medium">Pausas:</span>
                    <p className="text-sm text-muted-foreground">
                      {currentTorneio.configuracao.pausas.habilitadas
                        ? `${currentTorneio.configuracao.pausas.maxPausasPorTime} pausas por time (${currentTorneio.configuracao.pausas.tempoPausa}s cada)`
                        : "Desabilitadas"}
                    </p>
                  </div>

                  <div>
                    <span className="font-medium">Substitutos:</span>
                    <p className="text-sm text-muted-foreground">
                      {currentTorneio.configuracao.substitutos.habilitados
                        ? `Até ${currentTorneio.configuracao.substitutos.maxSubstitutos} por time`
                        : "Desabilitados"}
                    </p>
                  </div>

                  <div>
                    <span className="font-medium">Ban/Pick:</span>
                    <p className="text-sm text-muted-foreground">
                      {currentTorneio.configuracao.banPick ? "Habilitado" : "Desabilitado"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
