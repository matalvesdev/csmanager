"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { formatDistanceToNow, format } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  Database,
  Download,
  Play,
  RotateCcw,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  HardDrive,
  Plus,
  Shield,
  Archive,
} from "lucide-react"
import { backupSystem } from "@/lib/backup-system"
import { LoadingButton } from "@/components/ui/loading-button"
import { useToast } from "@/components/ui/use-toast"
import { formatBytes } from "@/lib/format"
import type { BackupConfig, BackupJob, RestorePoint } from "@/types/backup"

export function BackupDashboard() {
  const { toast } = useToast()
  const [configs, setConfigs] = useState<BackupConfig[]>([])
  const [jobs, setJobs] = useState<BackupJob[]>([])
  const [restorePoints, setRestorePoints] = useState<RestorePoint[]>([])
  const [storageUsage, setStorageUsage] = useState({ total: 0, used: 0, available: 0 })
  const [selectedConfig, setSelectedConfig] = useState<BackupConfig | null>(null)
  const [selectedRestorePoint, setSelectedRestorePoint] = useState<RestorePoint | null>(null)
  const [showConfigDialog, setShowConfigDialog] = useState(false)
  const [showRestoreDialog, setShowRestoreDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadData()

    // Refresh data every 30 seconds
    const interval = setInterval(loadData, 30000)
    return () => clearInterval(interval)
  }, [])

  const loadData = () => {
    setConfigs(backupSystem.getConfigs())
    setJobs(backupSystem.getJobs())
    setRestorePoints(backupSystem.getRestorePoints())
    setStorageUsage(backupSystem.getStorageUsage())
  }

  const handleRunBackup = async (configId: string) => {
    setIsLoading(true)
    try {
      await backupSystem.runBackup(configId)
      toast({
        title: "Backup iniciado",
        description: "O backup foi iniciado com sucesso.",
      })
      loadData()
    } catch (error) {
      toast({
        title: "Erro ao iniciar backup",
        description: "Ocorreu um erro ao iniciar o backup.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleConfig = async (configId: string, enabled: boolean) => {
    backupSystem.updateConfig(configId, { enabled })
    setConfigs(backupSystem.getConfigs())
    toast({
      title: enabled ? "Backup ativado" : "Backup desativado",
      description: `A configuração de backup foi ${enabled ? "ativada" : "desativada"}.`,
    })
  }

  const handleVerifyRestorePoint = async (pointId: string) => {
    setIsLoading(true)
    try {
      const isValid = await backupSystem.verifyRestorePoint(pointId)
      toast({
        title: isValid ? "Backup verificado" : "Backup inválido",
        description: isValid ? "O backup foi verificado com sucesso." : "O backup está corrompido ou inacessível.",
        variant: isValid ? "default" : "destructive",
      })
      loadData()
    } catch (error) {
      toast({
        title: "Erro na verificação",
        description: "Ocorreu um erro ao verificar o backup.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRestore = async (pointId: string, options: { overwrite: boolean; target?: string }) => {
    setIsLoading(true)
    try {
      const success = await backupSystem.restoreFromPoint(pointId, options)
      if (success) {
        toast({
          title: "Restauração concluída",
          description: "Os dados foram restaurados com sucesso.",
        })
        setShowRestoreDialog(false)
      } else {
        toast({
          title: "Erro na restauração",
          description: "Ocorreu um erro durante a restauração.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erro na restauração",
        description: "Ocorreu um erro durante a restauração.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCleanupOldBackups = () => {
    const deletedCount = backupSystem.cleanupOldBackups()
    toast({
      title: "Limpeza concluída",
      description: `${deletedCount} backup(s) antigo(s) foram removidos.`,
    })
    loadData()
  }

  const getStatusIcon = (status: BackupJob["status"]) => {
    switch (status) {
      case "running":
        return <Clock className="h-4 w-4 text-blue-500 animate-spin" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: BackupJob["status"]) => {
    const variants = {
      pending: "secondary",
      running: "default",
      completed: "default",
      failed: "destructive",
    } as const

    const colors = {
      pending: "text-yellow-600",
      running: "text-blue-600",
      completed: "text-green-600",
      failed: "text-red-600",
    }

    return (
      <Badge variant={variants[status]} className={colors[status]}>
        {status === "running"
          ? "Executando"
          : status === "completed"
            ? "Concluído"
            : status === "failed"
              ? "Falhou"
              : "Pendente"}
      </Badge>
    )
  }

  const runningJobs = jobs.filter((job) => job.status === "running")
  const recentJobs = jobs.slice(0, 5)
  const recentRestorePoints = restorePoints.slice(0, 10)

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Configurações Ativas</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{configs.filter((c) => c.enabled).length}</div>
            <p className="text-xs text-muted-foreground">de {configs.length} configurações</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Backups Executando</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{runningJobs.length}</div>
            <p className="text-xs text-muted-foreground">em execução agora</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pontos de Restauração</CardTitle>
            <Archive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{restorePoints.length}</div>
            <p className="text-xs text-muted-foreground">disponíveis</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Armazenamento</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatBytes(storageUsage.used)}</div>
            <p className="text-xs text-muted-foreground">de {formatBytes(storageUsage.total)} usado</p>
            <Progress value={(storageUsage.used / storageUsage.total) * 100} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Running Jobs */}
      {runningJobs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Backups em Execução
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {runningJobs.map((job) => {
                const config = configs.find((c) => c.id === job.configId)
                return (
                  <div key={job.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{config?.name}</h4>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(job.status)}
                        {getStatusBadge(job.status)}
                      </div>
                    </div>
                    <Progress value={job.progress || 0} className="mb-2" />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Progresso: {job.progress || 0}%</span>
                      <span>
                        Iniciado: {formatDistanceToNow(new Date(job.startTime), { locale: ptBR, addSuffix: true })}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <Tabs defaultValue="configs" className="w-full">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="configs">Configurações</TabsTrigger>
            <TabsTrigger value="jobs">Histórico</TabsTrigger>
            <TabsTrigger value="restore">Restauração</TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCleanupOldBackups}>
              <Trash2 className="h-4 w-4 mr-2" />
              Limpar Antigos
            </Button>
            <Dialog open={showConfigDialog} onOpenChange={setShowConfigDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Configuração
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Nova Configuração de Backup</DialogTitle>
                  <DialogDescription>Configure um novo backup automático</DialogDescription>
                </DialogHeader>
                {/* Backup configuration form would go here */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome</Label>
                      <Input id="name" placeholder="Backup Personalizado" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="schedule">Agendamento</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a frequência" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hourly">A cada hora</SelectItem>
                          <SelectItem value="daily">Diário</SelectItem>
                          <SelectItem value="weekly">Semanal</SelectItem>
                          <SelectItem value="monthly">Mensal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea id="description" placeholder="Descreva o que será incluído neste backup" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="compression" />
                    <Label htmlFor="compression">Compressão</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="encryption" />
                    <Label htmlFor="encryption">Criptografia</Label>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <TabsContent value="configs" className="space-y-4">
          <div className="grid gap-4">
            {configs.map((config) => {
              const recentJob = jobs.find((job) => job.configId === config.id)
              const nextRun = backupSystem.getNextScheduledRun(config.id)

              return (
                <Card key={config.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {config.name}
                          {config.enabled ? (
                            <Badge variant="default">Ativo</Badge>
                          ) : (
                            <Badge variant="secondary">Inativo</Badge>
                          )}
                        </CardTitle>
                        <CardDescription>{config.description}</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={config.enabled}
                          onCheckedChange={(enabled) => handleToggleConfig(config.id, enabled)}
                        />
                        <LoadingButton
                          variant="outline"
                          size="sm"
                          onClick={() => handleRunBackup(config.id)}
                          loading={isLoading}
                          disabled={!config.enabled}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Executar
                        </LoadingButton>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <Label className="text-muted-foreground">Agendamento</Label>
                        <p>{config.schedule}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Retenção</Label>
                        <p>{config.retention} dias</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Último Backup</Label>
                        <p>
                          {recentJob
                            ? formatDistanceToNow(new Date(recentJob.startTime), { locale: ptBR, addSuffix: true })
                            : "Nunca"}
                        </p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Próximo Backup</Label>
                        <p>
                          {nextRun && config.enabled
                            ? formatDistanceToNow(nextRun, { locale: ptBR, addSuffix: true })
                            : "Não agendado"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <Label className="text-muted-foreground">Alvos do Backup</Label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {config.targets.map((target, index) => (
                          <Badge key={index} variant="outline">
                            {target.type}: {target.path}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                      {config.compression && (
                        <div className="flex items-center gap-1">
                          <Archive className="h-3 w-3" />
                          Compressão
                        </div>
                      )}
                      {config.encryption && (
                        <div className="flex items-center gap-1">
                          <Shield className="h-3 w-3" />
                          Criptografia
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="jobs" className="space-y-4">
          <ScrollArea className="h-[600px]">
            <div className="space-y-2">
              {recentJobs.map((job) => {
                const config = configs.find((c) => c.id === job.configId)
                return (
                  <div key={job.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{config?.name}</h4>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(job.status)}
                        {getStatusBadge(job.status)}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                      <div>
                        <Label>Início</Label>
                        <p>{format(new Date(job.startTime), "dd/MM/yyyy HH:mm", { locale: ptBR })}</p>
                      </div>
                      <div>
                        <Label>Duração</Label>
                        <p>
                          {job.endTime
                            ? formatDistanceToNow(new Date(job.startTime), {
                                locale: ptBR,
                                includeSeconds: true,
                              })
                            : "Em execução"}
                        </p>
                      </div>
                      <div>
                        <Label>Tamanho</Label>
                        <p>{job.size ? formatBytes(job.size) : "N/A"}</p>
                      </div>
                      <div>
                        <Label>Progresso</Label>
                        <p>{job.progress || 0}%</p>
                      </div>
                    </div>

                    {job.error && (
                      <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                        <strong>Erro:</strong> {job.error}
                      </div>
                    )}

                    {job.status === "running" && <Progress value={job.progress || 0} className="mt-2" />}
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="restore" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Pontos de Restauração</h3>
              <p className="text-sm text-muted-foreground">Selecione um backup para restaurar os dados</p>
            </div>
          </div>

          <ScrollArea className="h-[600px]">
            <div className="space-y-2">
              {recentRestorePoints.map((point) => {
                const config = configs.find((c) => c.id === point.configId)
                return (
                  <div key={point.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium">{point.name}</h4>
                        <p className="text-sm text-muted-foreground">{point.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {point.verified ? (
                          <Badge variant="default" className="text-green-600">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verificado
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-yellow-600">
                            <Clock className="h-3 w-3 mr-1" />
                            Não verificado
                          </Badge>
                        )}
                        <Badge variant="outline">{point.type === "full" ? "Completo" : "Incremental"}</Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground mb-4">
                      <div>
                        <Label>Data</Label>
                        <p>{format(new Date(point.timestamp), "dd/MM/yyyy HH:mm", { locale: ptBR })}</p>
                      </div>
                      <div>
                        <Label>Tamanho</Label>
                        <p>{formatBytes(point.size)}</p>
                      </div>
                      <div>
                        <Label>Configuração</Label>
                        <p>{config?.name}</p>
                      </div>
                      <div>
                        <Label>Idade</Label>
                        <p>{formatDistanceToNow(new Date(point.timestamp), { locale: ptBR, addSuffix: true })}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {!point.verified && (
                        <LoadingButton
                          variant="outline"
                          size="sm"
                          onClick={() => handleVerifyRestorePoint(point.id)}
                          loading={isLoading}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Verificar
                        </LoadingButton>
                      )}

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="default"
                            size="sm"
                            disabled={!point.verified}
                            onClick={() => setSelectedRestorePoint(point)}
                          >
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Restaurar
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Confirmar Restauração</DialogTitle>
                            <DialogDescription>
                              Esta ação irá restaurar os dados do backup selecionado. Os dados atuais podem ser
                              sobrescritos.
                            </DialogDescription>
                          </DialogHeader>

                          <div className="space-y-4">
                            <div className="p-4 bg-muted rounded-lg">
                              <h4 className="font-medium mb-2">Detalhes do Backup</h4>
                              <div className="text-sm space-y-1">
                                <p>
                                  <strong>Nome:</strong> {point.name}
                                </p>
                                <p>
                                  <strong>Data:</strong>{" "}
                                  {format(new Date(point.timestamp), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                                </p>
                                <p>
                                  <strong>Tamanho:</strong> {formatBytes(point.size)}
                                </p>
                                <p>
                                  <strong>Tipo:</strong> {point.type === "full" ? "Completo" : "Incremental"}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Switch id="overwrite" />
                              <Label htmlFor="overwrite">Sobrescrever dados existentes</Label>
                            </div>

                            <div className="flex justify-end gap-2">
                              <Button variant="outline">Cancelar</Button>
                              <LoadingButton
                                onClick={() => handleRestore(point.id, { overwrite: true })}
                                loading={isLoading}
                                variant="default"
                              >
                                <RotateCcw className="h-4 w-4 mr-2" />
                                Confirmar Restauração
                              </LoadingButton>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Button variant="outline" size="sm" onClick={() => window.open(point.path, "_blank")}>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}
