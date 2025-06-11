"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { LoadingButton } from "@/components/ui/loading-button"
import { useToast } from "@/components/ui/use-toast"
import { Download, Save, Server, Upload, RefreshCw, AlertTriangle } from "lucide-react"

interface CSServerConfigProps {
  serverId?: string
  onSave?: (config: any) => Promise<void>
}

export function CSServerConfig({ serverId, onSave }: CSServerConfigProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("rehlds")
  const [config, setConfig] = useState({
    rehlds: {
      enabled: true,
      version: "3.14.0.857",
      secureMode: true,
      maxPlayers: 32,
      tickRate: 100,
      fps: 1000,
      allowedHltv: true,
      logLevel: 1,
    },
    regamedll: {
      enabled: true,
      version: "5.28.0.756",
      regameMode: 1, // 0 = Legacy, 1 = New features
      roundTime: 105,
      freezeTime: 15,
      buyTime: 90,
      forceCamera: true,
      timelimit: 30,
      maxRounds: 30,
      winLimit: 16,
    },
    matchbot: {
      enabled: true,
      version: "latest",
      knifeRound: true,
      readySystem: true,
      readyPercent: 100,
      readyMinimum: 10,
      readyDelay: 5,
      minPlayers: 10,
      minPlayersNeedToReady: 10,
      autoLO3: true,
      recordDemo: true,
      recordHLTV: true,
    },
    metamod: {
      enabled: true,
      version: "1.3.0.131",
      plugins: [
        { name: "MatchBot", file: "matchbot_mm.so", enabled: true },
        { name: "StatsMe", file: "statsme_mm.so", enabled: false },
        { name: "AdminMod", file: "adminmod_mm.so", enabled: false },
      ],
    },
  })

  const handleConfigChange = (section: string, field: string, value: any) => {
    setConfig((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }))
  }

  const handlePluginToggle = (index: number, enabled: boolean) => {
    setConfig((prev) => {
      const newPlugins = [...prev.metamod.plugins]
      newPlugins[index] = { ...newPlugins[index], enabled }
      return {
        ...prev,
        metamod: {
          ...prev.metamod,
          plugins: newPlugins,
        },
      }
    })
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      if (onSave) {
        await onSave(config)
      }
      toast({
        title: "Configuração salva",
        description: "As configurações do servidor CS 1.6 foram salvas com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar as configurações.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownloadConfig = () => {
    const configJson = JSON.stringify(config, null, 2)
    const blob = new Blob([configJson], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `cs_server_config${serverId ? `_${serverId}` : ""}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleUploadConfig = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string)
        setConfig(json)
        toast({
          title: "Configuração carregada",
          description: "As configurações foram carregadas com sucesso.",
        })
      } catch (error) {
        toast({
          title: "Erro ao carregar",
          description: "O arquivo não contém uma configuração válida.",
          variant: "destructive",
        })
      }
    }
    reader.readAsText(file)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Configuração do Servidor CS 1.6</CardTitle>
            <CardDescription>Configure os componentes ReHLDS, ReGameDLL_CS e MatchBot</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => document.getElementById("upload-config")?.click()}>
              <Upload className="h-4 w-4 mr-2" />
              Importar
            </Button>
            <input id="upload-config" type="file" accept=".json" className="hidden" onChange={handleUploadConfig} />
            <Button variant="outline" size="sm" onClick={handleDownloadConfig}>
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="rehlds">ReHLDS</TabsTrigger>
            <TabsTrigger value="regamedll">ReGameDLL</TabsTrigger>
            <TabsTrigger value="matchbot">MatchBot</TabsTrigger>
            <TabsTrigger value="metamod">Metamod-r</TabsTrigger>
          </TabsList>

          <TabsContent value="rehlds" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  id="rehlds-enabled"
                  checked={config.rehlds.enabled}
                  onCheckedChange={(checked) => handleConfigChange("rehlds", "enabled", checked)}
                />
                <Label htmlFor="rehlds-enabled">Habilitar ReHLDS</Label>
              </div>
              <Badge variant={config.rehlds.enabled ? "default" : "outline"}>
                {config.rehlds.enabled ? "Ativado" : "Desativado"}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rehlds-version">Versão do ReHLDS</Label>
                <Select
                  value={config.rehlds.version}
                  onValueChange={(value) => handleConfigChange("rehlds", "version", value)}
                  disabled={!config.rehlds.enabled}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3.14.0.857">3.14.0.857 (Última)</SelectItem>
                    <SelectItem value="3.13.0.768">3.13.0.768</SelectItem>
                    <SelectItem value="3.12.0.693">3.12.0.693</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rehlds-maxplayers">Máximo de Jogadores</Label>
                <Input
                  id="rehlds-maxplayers"
                  type="number"
                  min="2"
                  max="32"
                  value={config.rehlds.maxPlayers}
                  onChange={(e) => handleConfigChange("rehlds", "maxPlayers", Number.parseInt(e.target.value))}
                  disabled={!config.rehlds.enabled}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rehlds-tickrate">Taxa de Tick (tickrate)</Label>
                <Select
                  value={config.rehlds.tickRate.toString()}
                  onValueChange={(value) => handleConfigChange("rehlds", "tickRate", Number.parseInt(value))}
                  disabled={!config.rehlds.enabled}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="33">33 (Padrão)</SelectItem>
                    <SelectItem value="66">66</SelectItem>
                    <SelectItem value="100">100 (Recomendado)</SelectItem>
                    <SelectItem value="128">128</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rehlds-fps">FPS Máximo</Label>
                <Select
                  value={config.rehlds.fps.toString()}
                  onValueChange={(value) => handleConfigChange("rehlds", "fps", Number.parseInt(value))}
                  disabled={!config.rehlds.enabled}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="100">100</SelectItem>
                    <SelectItem value="500">500</SelectItem>
                    <SelectItem value="1000">1000 (Recomendado)</SelectItem>
                    <SelectItem value="2000">2000</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rehlds-secure"
                  checked={config.rehlds.secureMode}
                  onCheckedChange={(checked) => handleConfigChange("rehlds", "secureMode", !!checked)}
                  disabled={!config.rehlds.enabled}
                />
                <Label htmlFor="rehlds-secure">Modo Seguro (sv_lan 0)</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rehlds-hltv"
                  checked={config.rehlds.allowedHltv}
                  onCheckedChange={(checked) => handleConfigChange("rehlds", "allowedHltv", !!checked)}
                  disabled={!config.rehlds.enabled}
                />
                <Label htmlFor="rehlds-hltv">Permitir conexão HLTV</Label>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-md mt-4">
              <h4 className="text-sm font-medium mb-2">Sobre o ReHLDS</h4>
              <p className="text-sm text-muted-foreground">
                ReHLDS é uma versão aprimorada do motor HLDS com correções de bugs, patches de segurança e otimizações
                para servidores estáveis. Recomendado para todos os servidores de torneio.
              </p>
              <div className="flex items-center mt-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2" />
                <span className="text-xs text-muted-foreground">
                  Alterar o tickrate requer reinicialização do servidor.
                </span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="regamedll" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  id="regamedll-enabled"
                  checked={config.regamedll.enabled}
                  onCheckedChange={(checked) => handleConfigChange("regamedll", "enabled", checked)}
                />
                <Label htmlFor="regamedll-enabled">Habilitar ReGameDLL_CS</Label>
              </div>
              <Badge variant={config.regamedll.enabled ? "default" : "outline"}>
                {config.regamedll.enabled ? "Ativado" : "Desativado"}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="regamedll-version">Versão do ReGameDLL</Label>
                <Select
                  value={config.regamedll.version}
                  onValueChange={(value) => handleConfigChange("regamedll", "version", value)}
                  disabled={!config.regamedll.enabled}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5.28.0.756">5.28.0.756 (Última)</SelectItem>
                    <SelectItem value="5.27.0.627">5.27.0.627</SelectItem>
                    <SelectItem value="5.26.0.612">5.26.0.612</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="regamedll-mode">Modo de Compatibilidade</Label>
                <Select
                  value={config.regamedll.regameMode.toString()}
                  onValueChange={(value) => handleConfigChange("regamedll", "regameMode", Number.parseInt(value))}
                  disabled={!config.regamedll.enabled}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Legado (Compatível com HLDS)</SelectItem>
                    <SelectItem value="1">Novos Recursos (Recomendado)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="regamedll-roundtime">Tempo de Round (segundos)</Label>
                <Input
                  id="regamedll-roundtime"
                  type="number"
                  min="60"
                  max="540"
                  value={config.regamedll.roundTime}
                  onChange={(e) => handleConfigChange("regamedll", "roundTime", Number.parseInt(e.target.value))}
                  disabled={!config.regamedll.enabled}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="regamedll-freezetime">Tempo de Congelamento (segundos)</Label>
                <Input
                  id="regamedll-freezetime"
                  type="number"
                  min="0"
                  max="60"
                  value={config.regamedll.freezeTime}
                  onChange={(e) => handleConfigChange("regamedll", "freezeTime", Number.parseInt(e.target.value))}
                  disabled={!config.regamedll.enabled}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="regamedll-buytime">Tempo de Compra (segundos)</Label>
                <Input
                  id="regamedll-buytime"
                  type="number"
                  min="0"
                  max="240"
                  value={config.regamedll.buyTime}
                  onChange={(e) => handleConfigChange("regamedll", "buyTime", Number.parseInt(e.target.value))}
                  disabled={!config.regamedll.enabled}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="regamedll-maxrounds">Máximo de Rounds</Label>
                <Input
                  id="regamedll-maxrounds"
                  type="number"
                  min="0"
                  max="100"
                  value={config.regamedll.maxRounds}
                  onChange={(e) => handleConfigChange("regamedll", "maxRounds", Number.parseInt(e.target.value))}
                  disabled={!config.regamedll.enabled}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="regamedll-winlimit">Limite de Vitórias</Label>
                <Input
                  id="regamedll-winlimit"
                  type="number"
                  min="0"
                  max="100"
                  value={config.regamedll.winLimit}
                  onChange={(e) => handleConfigChange("regamedll", "winLimit", Number.parseInt(e.target.value))}
                  disabled={!config.regamedll.enabled}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="regamedll-timelimit">Limite de Tempo (minutos)</Label>
                <Input
                  id="regamedll-timelimit"
                  type="number"
                  min="0"
                  max="180"
                  value={config.regamedll.timelimit}
                  onChange={(e) => handleConfigChange("regamedll", "timelimit", Number.parseInt(e.target.value))}
                  disabled={!config.regamedll.enabled}
                />
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="regamedll-forcecamera"
                  checked={config.regamedll.forceCamera}
                  onCheckedChange={(checked) => handleConfigChange("regamedll", "forceCamera", !!checked)}
                  disabled={!config.regamedll.enabled}
                />
                <Label htmlFor="regamedll-forcecamera">Forçar Câmera (Apenas Time)</Label>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-md mt-4">
              <h4 className="text-sm font-medium mb-2">Sobre o ReGameDLL_CS</h4>
              <p className="text-sm text-muted-foreground">
                ReGameDLL_CS é uma versão aprimorada do GameDLL do servidor para Counter-Strike 1.6, oferecendo novos
                recursos e correções. Compatível com plugins AMX Mod X e Metamod.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="matchbot" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  id="matchbot-enabled"
                  checked={config.matchbot.enabled}
                  onCheckedChange={(checked) => handleConfigChange("matchbot", "enabled", checked)}
                />
                <Label htmlFor="matchbot-enabled">Habilitar MatchBot</Label>
              </div>
              <Badge variant={config.matchbot.enabled ? "default" : "outline"}>
                {config.matchbot.enabled ? "Ativado" : "Desativado"}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="matchbot-version">Versão do MatchBot</Label>
                <Select
                  value={config.matchbot.version}
                  onValueChange={(value) => handleConfigChange("matchbot", "version", value)}
                  disabled={!config.matchbot.enabled}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="latest">Última Versão</SelectItem>
                    <SelectItem value="1.0.0">1.0.0</SelectItem>
                    <SelectItem value="0.9.0">0.9.0</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="matchbot-minplayers">Mínimo de Jogadores</Label>
                <Input
                  id="matchbot-minplayers"
                  type="number"
                  min="2"
                  max="32"
                  value={config.matchbot.minPlayers}
                  onChange={(e) => handleConfigChange("matchbot", "minPlayers", Number.parseInt(e.target.value))}
                  disabled={!config.matchbot.enabled}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="matchbot-readypercent">Porcentagem Ready (%)</Label>
                <Input
                  id="matchbot-readypercent"
                  type="number"
                  min="1"
                  max="100"
                  value={config.matchbot.readyPercent}
                  onChange={(e) => handleConfigChange("matchbot", "readyPercent", Number.parseInt(e.target.value))}
                  disabled={!config.matchbot.enabled}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="matchbot-readyminimum">Mínimo de Jogadores Ready</Label>
                <Input
                  id="matchbot-readyminimum"
                  type="number"
                  min="1"
                  max="32"
                  value={config.matchbot.readyMinimum}
                  onChange={(e) => handleConfigChange("matchbot", "readyMinimum", Number.parseInt(e.target.value))}
                  disabled={!config.matchbot.enabled}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="matchbot-readydelay">Delay após Ready (segundos)</Label>
                <Input
                  id="matchbot-readydelay"
                  type="number"
                  min="0"
                  max="60"
                  value={config.matchbot.readyDelay}
                  onChange={(e) => handleConfigChange("matchbot", "readyDelay", Number.parseInt(e.target.value))}
                  disabled={!config.matchbot.enabled}
                />
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="matchbot-kniferound"
                  checked={config.matchbot.knifeRound}
                  onCheckedChange={(checked) => handleConfigChange("matchbot", "knifeRound", !!checked)}
                  disabled={!config.matchbot.enabled}
                />
                <Label htmlFor="matchbot-kniferound">Habilitar Round de Faca</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="matchbot-readysystem"
                  checked={config.matchbot.readySystem}
                  onCheckedChange={(checked) => handleConfigChange("matchbot", "readySystem", !!checked)}
                  disabled={!config.matchbot.enabled}
                />
                <Label htmlFor="matchbot-readysystem">Sistema de Ready (!ready)</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="matchbot-autolo3"
                  checked={config.matchbot.autoLO3}
                  onCheckedChange={(checked) => handleConfigChange("matchbot", "autoLO3", !!checked)}
                  disabled={!config.matchbot.enabled}
                />
                <Label htmlFor="matchbot-autolo3">Auto LO3 (Live on 3)</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="matchbot-recorddemo"
                  checked={config.matchbot.recordDemo}
                  onCheckedChange={(checked) => handleConfigChange("matchbot", "recordDemo", !!checked)}
                  disabled={!config.matchbot.enabled}
                />
                <Label htmlFor="matchbot-recorddemo">Gravar Demo do Servidor</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="matchbot-recordhltv"
                  checked={config.matchbot.recordHLTV}
                  onCheckedChange={(checked) => handleConfigChange("matchbot", "recordHLTV", !!checked)}
                  disabled={!config.matchbot.enabled}
                />
                <Label htmlFor="matchbot-recordhltv">Gravar Demo HLTV</Label>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-md mt-4">
              <h4 className="text-sm font-medium mb-2">Sobre o MatchBot</h4>
              <p className="text-sm text-muted-foreground">
                MatchBot é um plugin para Counter-Strike 1.6 que permite executar partidas competitivas sem intervenção
                de administrador. Os jogadores escolhem times, usam !ready e a partida inicia automaticamente.
              </p>
              <div className="flex items-center mt-2">
                <Server className="h-4 w-4 text-blue-500 mr-2" />
                <span className="text-xs text-muted-foreground">
                  Requer Metamod-r e ReGameDLL_CS para funcionar corretamente.
                </span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="metamod" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  id="metamod-enabled"
                  checked={config.metamod.enabled}
                  onCheckedChange={(checked) => handleConfigChange("metamod", "enabled", checked)}
                />
                <Label htmlFor="metamod-enabled">Habilitar Metamod-r</Label>
              </div>
              <Badge variant={config.metamod.enabled ? "default" : "outline"}>
                {config.metamod.enabled ? "Ativado" : "Desativado"}
              </Badge>
            </div>

            <div className="space-y-2">
              <Label htmlFor="metamod-version">Versão do Metamod-r</Label>
              <Select
                value={config.metamod.version}
                onValueChange={(value) => handleConfigChange("metamod", "version", value)}
                disabled={!config.metamod.enabled}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1.3.0.131">1.3.0.131 (Última)</SelectItem>
                  <SelectItem value="1.3.0.128">1.3.0.128</SelectItem>
                  <SelectItem value="1.3.0.124">1.3.0.124</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Plugins Metamod</Label>
                <Button variant="outline" size="sm" disabled={!config.metamod.enabled}>
                  Adicionar Plugin
                </Button>
              </div>

              <div className="space-y-2 mt-2">
                {config.metamod.plugins.map((plugin, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={plugin.enabled}
                        onCheckedChange={(checked) => handlePluginToggle(index, !!checked)}
                        disabled={!config.metamod.enabled}
                      />
                      <div>
                        <p className="font-medium">{plugin.name}</p>
                        <p className="text-xs text-muted-foreground">{plugin.file}</p>
                      </div>
                    </div>
                    <Badge variant={plugin.enabled ? "default" : "outline"}>
                      {plugin.enabled ? "Ativado" : "Desativado"}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-muted p-4 rounded-md mt-4">
              <h4 className="text-sm font-medium mb-2">Sobre o Metamod-r</h4>
              <p className="text-sm text-muted-foreground">
                Metamod-r é uma versão aprimorada do Metamod, um sistema de plugins para servidores Half-Life. Ele
                permite carregar múltiplos plugins como MatchBot, AdminMod e outros.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => setActiveTab(activeTab === "rehlds" ? "metamod" : "rehlds")}>
          {activeTab === "rehlds" ? "Ir para Metamod" : "Ir para ReHLDS"}
        </Button>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Reiniciar
          </Button>
          <LoadingButton onClick={handleSave} loading={isLoading}>
            <Save className="h-4 w-4 mr-2" />
            Salvar Configuração
          </LoadingButton>
        </div>
      </CardFooter>
    </Card>
  )
}
