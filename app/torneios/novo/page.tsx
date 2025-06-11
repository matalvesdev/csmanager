"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/lib/store"
import type { ConfiguracaoTorneio } from "@/types"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, X } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"

const mapasDisponiveis = [
  "de_dust2",
  "de_inferno",
  "de_nuke",
  "de_train",
  "de_mirage",
  "de_cache",
  "de_overpass",
  "de_cbble",
  "de_vertigo",
  "de_aztec",
]

export default function NovoTorneioPage() {
  const router = useRouter()
  const { createTorneio, isLoading } = useAppStore()

  // Estados básicos
  const [nome, setNome] = useState("")
  const [descricao, setDescricao] = useState("")
  const [premiacao, setPremiacao] = useState("")
  const [regulamento, setRegulamento] = useState("")
  const [dataInicio, setDataInicio] = useState<Date>()
  const [dataFim, setDataFim] = useState<Date>()

  // Configurações do torneio
  const [configuracao, setConfiguracao] = useState<ConfiguracaoTorneio>({
    modoPartida: "MR15",
    tempoRound: 115,
    tempoBomba: 35,
    tempoFreeze: 6,
    maxRounds: 30,
    overtime: true,
    overtimeRounds: 6,
    friendlyFire: false,
    autoKick: true,
    forceCamera: true,
    ghostFreq: false,
    hltv: {
      habilitado: true,
      ip: "127.0.0.1",
      porta: 27020,
      senha: "",
      delay: 90,
    },
    servidor: {
      tickrate: 100,
      fps_max: 300,
      sv_maxrate: 25000,
      sv_minrate: 5000,
      sv_maxupdaterate: 101,
      sv_minupdaterate: 10,
      sv_maxcmdrate: 101,
      sv_mincmdrate: 10,
    },
    mapas: ["de_dust2", "de_inferno", "de_nuke"],
    formatoMapas: "bo3",
    banPick: true,
    pausas: {
      habilitadas: true,
      maxPausasPorTime: 4,
      tempoPausa: 300,
    },
    substitutos: {
      habilitados: true,
      maxSubstitutos: 2,
    },
  })

  const updateConfiguracao = (key: keyof ConfiguracaoTorneio, value: any) => {
    setConfiguracao((prev) => ({ ...prev, [key]: value }))
  }

  const updateNestedConfig = (parent: keyof ConfiguracaoTorneio, key: string, value: any) => {
    setConfiguracao((prev) => ({
      ...prev,
      [parent]: {
        ...(prev[parent] as any),
        [key]: value,
      },
    }))
  }

  const adicionarMapa = (mapa: string) => {
    if (!configuracao.mapas.includes(mapa)) {
      updateConfiguracao("mapas", [...configuracao.mapas, mapa])
    }
  }

  const removerMapa = (mapa: string) => {
    updateConfiguracao(
      "mapas",
      configuracao.mapas.filter((m) => m !== mapa),
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!nome || !dataInicio || !dataFim) {
      return
    }

    await createTorneio({
      nome,
      descricao,
      premiacao,
      regulamento,
      dataInicio: dataInicio.toISOString(),
      dataFim: dataFim.toISOString(),
      status: "agendado",
      grupos: [],
      partidas: [],
      configuracao,
    })

    router.push("/torneios")
  }

  return (
    <div className="container py-6 space-y-6">
      <h1 className="text-3xl font-bold">Novo Torneio</h1>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="basico" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basico">Básico</TabsTrigger>
            <TabsTrigger value="gameplay">Gameplay</TabsTrigger>
            <TabsTrigger value="servidor">Servidor</TabsTrigger>
            <TabsTrigger value="hltv">HLTV</TabsTrigger>
          </TabsList>

          <TabsContent value="basico" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
                <CardDescription>Dados gerais do torneio</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome do Torneio *</Label>
                  <Input
                    id="nome"
                    placeholder="Ex: Campeonato CS 1.6 2023"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea
                    id="descricao"
                    placeholder="Descrição do torneio..."
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="premiacao">Premiação</Label>
                    <Input
                      id="premiacao"
                      placeholder="Ex: R$ 10.000"
                      value={premiacao}
                      onChange={(e) => setPremiacao(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="regulamento">Regulamento</Label>
                    <Input
                      id="regulamento"
                      placeholder="Link ou texto do regulamento"
                      value={regulamento}
                      onChange={(e) => setRegulamento(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Data de Início *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !dataInicio && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dataInicio ? format(dataInicio, "PPP", { locale: ptBR }) : "Selecione uma data"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={dataInicio} onSelect={setDataInicio} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>Data de Término *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !dataFim && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dataFim ? format(dataFim, "PPP", { locale: ptBR }) : "Selecione uma data"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={dataFim}
                          onSelect={setDataFim}
                          disabled={(date) => (dataInicio ? date < dataInicio : false)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gameplay" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Gameplay</CardTitle>
                <CardDescription>Regras e configurações das partidas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Modo de Partida</Label>
                      <Select
                        value={configuracao.modoPartida}
                        onValueChange={(value: any) => updateConfiguracao("modoPartida", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MR15">MR15 (15 rounds para vencer)</SelectItem>
                          <SelectItem value="MR12">MR12 (12 rounds para vencer)</SelectItem>
                          <SelectItem value="MR10">MR10 (10 rounds para vencer)</SelectItem>
                          <SelectItem value="MR30">MR30 (30 rounds para vencer)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Formato dos Mapas</Label>
                      <Select
                        value={configuracao.formatoMapas}
                        onValueChange={(value: any) => updateConfiguracao("formatoMapas", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bo1">Best of 1 (BO1)</SelectItem>
                          <SelectItem value="bo3">Best of 3 (BO3)</SelectItem>
                          <SelectItem value="bo5">Best of 5 (BO5)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Tempo do Round (segundos)</Label>
                      <Input
                        type="number"
                        value={configuracao.tempoRound}
                        onChange={(e) => updateConfiguracao("tempoRound", Number.parseInt(e.target.value))}
                        min={60}
                        max={300}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Tempo da Bomba (segundos)</Label>
                      <Input
                        type="number"
                        value={configuracao.tempoBomba}
                        onChange={(e) => updateConfiguracao("tempoBomba", Number.parseInt(e.target.value))}
                        min={20}
                        max={60}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Overtime</Label>
                      <Switch
                        checked={configuracao.overtime}
                        onCheckedChange={(checked) => updateConfiguracao("overtime", checked)}
                      />
                    </div>

                    {configuracao.overtime && (
                      <div className="space-y-2">
                        <Label>Rounds de Overtime</Label>
                        <Input
                          type="number"
                          value={configuracao.overtimeRounds}
                          onChange={(e) => updateConfiguracao("overtimeRounds", Number.parseInt(e.target.value))}
                          min={1}
                          max={10}
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <Label>Friendly Fire</Label>
                      <Switch
                        checked={configuracao.friendlyFire}
                        onCheckedChange={(checked) => updateConfiguracao("friendlyFire", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label>Auto Kick</Label>
                      <Switch
                        checked={configuracao.autoKick}
                        onCheckedChange={(checked) => updateConfiguracao("autoKick", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label>Force Camera</Label>
                      <Switch
                        checked={configuracao.forceCamera}
                        onCheckedChange={(checked) => updateConfiguracao("forceCamera", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label>Ban/Pick de Mapas</Label>
                      <Switch
                        checked={configuracao.banPick}
                        onCheckedChange={(checked) => updateConfiguracao("banPick", checked)}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label>Mapas do Torneio</Label>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {configuracao.mapas.map((mapa) => (
                      <Badge key={mapa} variant="secondary" className="flex items-center gap-1">
                        {mapa}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => removerMapa(mapa)} />
                      </Badge>
                    ))}
                  </div>
                  <Select onValueChange={adicionarMapa}>
                    <SelectTrigger>
                      <SelectValue placeholder="Adicionar mapa" />
                    </SelectTrigger>
                    <SelectContent>
                      {mapasDisponiveis
                        .filter((mapa) => !configuracao.mapas.includes(mapa))
                        .map((mapa) => (
                          <SelectItem key={mapa} value={mapa}>
                            {mapa}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Pausas</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center justify-between">
                      <Label>Pausas Habilitadas</Label>
                      <Switch
                        checked={configuracao.pausas.habilitadas}
                        onCheckedChange={(checked) => updateNestedConfig("pausas", "habilitadas", checked)}
                      />
                    </div>

                    {configuracao.pausas.habilitadas && (
                      <>
                        <div className="space-y-2">
                          <Label>Max Pausas por Time</Label>
                          <Input
                            type="number"
                            value={configuracao.pausas.maxPausasPorTime}
                            onChange={(e) =>
                              updateNestedConfig("pausas", "maxPausasPorTime", Number.parseInt(e.target.value))
                            }
                            min={1}
                            max={10}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Tempo de Pausa (segundos)</Label>
                          <Input
                            type="number"
                            value={configuracao.pausas.tempoPausa}
                            onChange={(e) =>
                              updateNestedConfig("pausas", "tempoPausa", Number.parseInt(e.target.value))
                            }
                            min={60}
                            max={600}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Substitutos</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between">
                      <Label>Substitutos Habilitados</Label>
                      <Switch
                        checked={configuracao.substitutos.habilitados}
                        onCheckedChange={(checked) => updateNestedConfig("substitutos", "habilitados", checked)}
                      />
                    </div>

                    {configuracao.substitutos.habilitados && (
                      <div className="space-y-2">
                        <Label>Max Substitutos por Time</Label>
                        <Input
                          type="number"
                          value={configuracao.substitutos.maxSubstitutos}
                          onChange={(e) =>
                            updateNestedConfig("substitutos", "maxSubstitutos", Number.parseInt(e.target.value))
                          }
                          min={1}
                          max={5}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="servidor" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações do Servidor</CardTitle>
                <CardDescription>Parâmetros técnicos do servidor CS 1.6</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Tickrate</Label>
                      <Select
                        value={configuracao.servidor.tickrate.toString()}
                        onValueChange={(value) => updateNestedConfig("servidor", "tickrate", Number.parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="100">100 Hz</SelectItem>
                          <SelectItem value="128">128 Hz</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>FPS Max</Label>
                      <Input
                        type="number"
                        value={configuracao.servidor.fps_max}
                        onChange={(e) => updateNestedConfig("servidor", "fps_max", Number.parseInt(e.target.value))}
                        min={100}
                        max={1000}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>sv_maxrate</Label>
                      <Input
                        type="number"
                        value={configuracao.servidor.sv_maxrate}
                        onChange={(e) => updateNestedConfig("servidor", "sv_maxrate", Number.parseInt(e.target.value))}
                        min={1000}
                        max={100000}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>sv_minrate</Label>
                      <Input
                        type="number"
                        value={configuracao.servidor.sv_minrate}
                        onChange={(e) => updateNestedConfig("servidor", "sv_minrate", Number.parseInt(e.target.value))}
                        min={1000}
                        max={25000}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>sv_maxupdaterate</Label>
                      <Input
                        type="number"
                        value={configuracao.servidor.sv_maxupdaterate}
                        onChange={(e) =>
                          updateNestedConfig("servidor", "sv_maxupdaterate", Number.parseInt(e.target.value))
                        }
                        min={10}
                        max={128}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>sv_minupdaterate</Label>
                      <Input
                        type="number"
                        value={configuracao.servidor.sv_minupdaterate}
                        onChange={(e) =>
                          updateNestedConfig("servidor", "sv_minupdaterate", Number.parseInt(e.target.value))
                        }
                        min={10}
                        max={100}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>sv_maxcmdrate</Label>
                      <Input
                        type="number"
                        value={configuracao.servidor.sv_maxcmdrate}
                        onChange={(e) =>
                          updateNestedConfig("servidor", "sv_maxcmdrate", Number.parseInt(e.target.value))
                        }
                        min={10}
                        max={128}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>sv_mincmdrate</Label>
                      <Input
                        type="number"
                        value={configuracao.servidor.sv_mincmdrate}
                        onChange={(e) =>
                          updateNestedConfig("servidor", "sv_mincmdrate", Number.parseInt(e.target.value))
                        }
                        min={10}
                        max={100}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hltv" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações HLTV</CardTitle>
                <CardDescription>Configurações para transmissão e gravação das partidas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>HLTV Habilitado</Label>
                    <p className="text-sm text-muted-foreground">Ativar gravação e transmissão das partidas</p>
                  </div>
                  <Switch
                    checked={configuracao.hltv.habilitado}
                    onCheckedChange={(checked) => updateNestedConfig("hltv", "habilitado", checked)}
                  />
                </div>

                {configuracao.hltv.habilitado && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>IP do HLTV</Label>
                        <Input
                          value={configuracao.hltv.ip || ""}
                          onChange={(e) => updateNestedConfig("hltv", "ip", e.target.value)}
                          placeholder="127.0.0.1"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Porta do HLTV</Label>
                        <Input
                          type="number"
                          value={configuracao.hltv.porta || ""}
                          onChange={(e) => updateNestedConfig("hltv", "porta", Number.parseInt(e.target.value))}
                          placeholder="27020"
                          min={1024}
                          max={65535}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Senha do HLTV</Label>
                        <Input
                          type="password"
                          value={configuracao.hltv.senha || ""}
                          onChange={(e) => updateNestedConfig("hltv", "senha", e.target.value)}
                          placeholder="Deixe vazio para sem senha"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Delay (segundos)</Label>
                        <Input
                          type="number"
                          value={configuracao.hltv.delay || ""}
                          onChange={(e) => updateNestedConfig("hltv", "delay", Number.parseInt(e.target.value))}
                          placeholder="90"
                          min={0}
                          max={300}
                        />
                        <p className="text-xs text-muted-foreground">
                          Delay para evitar cheating (recomendado: 90 segundos)
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card>
          <CardFooter className="flex justify-between pt-6">
            <Button variant="outline" type="button" onClick={() => router.back()}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading || !nome || !dataInicio || !dataFim}>
              {isLoading ? "Criando..." : "Criar Torneio"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
