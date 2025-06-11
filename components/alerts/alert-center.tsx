"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  Bell,
  BellOff,
  Check,
  CheckCheck,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle,
  Settings,
  Mail,
  MessageSquare,
  Webhook,
} from "lucide-react"
import { alertSystem } from "@/lib/alert-system"
import type { Alert, AlertRule, NotificationSettings } from "@/types/alerts"
import { useToast } from "@/components/ui/use-toast"

export function AlertCenter() {
  const { toast } = useToast()
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [rules, setRules] = useState<AlertRule[]>([])
  const [settings, setSettings] = useState<NotificationSettings>({
    email: false,
    discord: false,
    slack: false,
    webhook: false,
  })
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null)
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    // Load initial data
    setAlerts(alertSystem.getAlerts())
    setRules(alertSystem.getRules())
    setSettings(alertSystem.getSettings())

    // Set up alert callback
    alertSystem.onAlertTriggered = (alert: Alert) => {
      setAlerts(alertSystem.getAlerts())
      toast({
        title: alert.title,
        description: alert.message,
        variant: alert.type === "error" ? "destructive" : "default",
      })
    }

    // Refresh alerts every 30 seconds
    const interval = setInterval(() => {
      setAlerts(alertSystem.getAlerts())
    }, 30000)

    return () => clearInterval(interval)
  }, [toast])

  const getAlertIcon = (type: Alert["type"]) => {
    switch (type) {
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  const getSeverityBadge = (severity: Alert["severity"]) => {
    const variants = {
      low: "outline",
      medium: "secondary",
      high: "default",
      critical: "destructive",
    } as const

    return (
      <Badge variant={variants[severity]} className="text-xs">
        {severity.toUpperCase()}
      </Badge>
    )
  }

  const handleMarkAsRead = (alertId: string) => {
    alertSystem.markAsRead(alertId)
    setAlerts(alertSystem.getAlerts())
  }

  const handleAcknowledge = (alertId: string) => {
    alertSystem.acknowledge(alertId)
    setAlerts(alertSystem.getAlerts())
    toast({
      title: "Alerta reconhecido",
      description: "O alerta foi marcado como reconhecido.",
    })
  }

  const handleAlertAction = (alert: Alert, actionId: string) => {
    switch (actionId) {
      case "acknowledge":
        handleAcknowledge(alert.id)
        break
      case "restart-servers":
        toast({
          title: "Reiniciando servidores",
          description: "Os servidores offline estão sendo reiniciados.",
        })
        break
      case "view-details":
        setSelectedAlert(alert)
        break
    }
  }

  const handleRuleToggle = (ruleId: string, enabled: boolean) => {
    alertSystem.updateRule(ruleId, { enabled })
    setRules(alertSystem.getRules())
    toast({
      title: enabled ? "Regra ativada" : "Regra desativada",
      description: `A regra de alerta foi ${enabled ? "ativada" : "desativada"}.`,
    })
  }

  const handleSettingsUpdate = (newSettings: Partial<NotificationSettings>) => {
    const updatedSettings = { ...settings, ...newSettings }
    alertSystem.updateSettings(updatedSettings)
    setSettings(updatedSettings)
    toast({
      title: "Configurações salvas",
      description: "As configurações de notificação foram atualizadas.",
    })
  }

  const unreadCount = alerts.filter((alert) => !alert.read).length
  const criticalCount = alerts.filter((alert) => alert.severity === "critical" && !alert.acknowledged).length

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <CardTitle>Central de Alertas</CardTitle>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount}
              </Badge>
            )}
          </div>
          <Button variant="outline" size="sm" onClick={() => setShowSettings(true)}>
            <Settings className="h-4 w-4 mr-2" />
            Configurações
          </Button>
        </div>
        <CardDescription>
          Monitore alertas do sistema e configure notificações
          {criticalCount > 0 && (
            <span className="text-red-500 font-medium ml-2">• {criticalCount} alertas críticos</span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="alerts" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="alerts">Alertas ({alerts.length})</TabsTrigger>
            <TabsTrigger value="rules">Regras ({rules.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="alerts" className="space-y-4">
            {alerts.length === 0 ? (
              <div className="text-center py-8">
                <BellOff className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium">Nenhum alerta</p>
                <p className="text-muted-foreground">Todos os sistemas estão funcionando normalmente</p>
              </div>
            ) : (
              <ScrollArea className="h-[400px]">
                <div className="space-y-2">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-4 border rounded-lg ${
                        !alert.read ? "bg-muted/50 border-primary/20" : ""
                      } ${alert.severity === "critical" && !alert.acknowledged ? "border-red-500/50" : ""}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          {getAlertIcon(alert.type)}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium">{alert.title}</h4>
                              {getSeverityBadge(alert.severity)}
                              {alert.acknowledged && (
                                <Badge variant="outline" className="text-xs">
                                  <CheckCheck className="h-3 w-3 mr-1" />
                                  Reconhecido
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{alert.message}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>
                                {formatDistanceToNow(new Date(alert.timestamp), { locale: ptBR, addSuffix: true })}
                              </span>
                              <span>Fonte: {alert.source}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          {alert.actions?.map((action) => (
                            <Button
                              key={action.id}
                              variant={action.variant || "outline"}
                              size="sm"
                              onClick={() => handleAlertAction(alert, action.id)}
                              disabled={action.id === "acknowledge" && alert.acknowledged}
                            >
                              {action.id === "acknowledge" && <Check className="h-3 w-3 mr-1" />}
                              {action.label}
                            </Button>
                          ))}
                          {!alert.read && (
                            <Button variant="ghost" size="sm" onClick={() => handleMarkAsRead(alert.id)}>
                              Marcar como lido
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </TabsContent>

          <TabsContent value="rules" className="space-y-4">
            <div className="space-y-2">
              {rules.map((rule) => (
                <div key={rule.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{rule.name}</h4>
                        <Badge variant={rule.enabled ? "default" : "secondary"} className="text-xs">
                          {rule.enabled ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{rule.description}</p>
                      <div className="text-xs text-muted-foreground">
                        Cooldown: {rule.cooldown} minutos
                        {rule.lastTriggered && (
                          <span className="ml-4">
                            Último disparo:{" "}
                            {formatDistanceToNow(new Date(rule.lastTriggered), { locale: ptBR, addSuffix: true })}
                          </span>
                        )}
                      </div>
                    </div>
                    <Switch checked={rule.enabled} onCheckedChange={(enabled) => handleRuleToggle(rule.id, enabled)} />
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Settings Dialog */}
        <Dialog open={showSettings} onOpenChange={setShowSettings}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Configurações de Notificação</DialogTitle>
              <DialogDescription>Configure como e onde receber alertas do sistema</DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <Label>Notificações por Email</Label>
                  </div>
                  <Switch checked={settings.email} onCheckedChange={(email) => handleSettingsUpdate({ email })} />
                </div>
                {settings.email && (
                  <div className="ml-6">
                    <Label htmlFor="emailAddress">Endereço de Email</Label>
                    <Input
                      id="emailAddress"
                      type="email"
                      value={settings.emailAddress || ""}
                      onChange={(e) => handleSettingsUpdate({ emailAddress: e.target.value })}
                      placeholder="admin@exemplo.com"
                    />
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    <Label>Discord</Label>
                  </div>
                  <Switch checked={settings.discord} onCheckedChange={(discord) => handleSettingsUpdate({ discord })} />
                </div>
                {settings.discord && (
                  <div className="ml-6">
                    <Label htmlFor="discordWebhook">Webhook URL do Discord</Label>
                    <Input
                      id="discordWebhook"
                      value={settings.discordWebhook || ""}
                      onChange={(e) => handleSettingsUpdate({ discordWebhook: e.target.value })}
                      placeholder="https://discord.com/api/webhooks/..."
                    />
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    <Label>Slack</Label>
                  </div>
                  <Switch checked={settings.slack} onCheckedChange={(slack) => handleSettingsUpdate({ slack })} />
                </div>
                {settings.slack && (
                  <div className="ml-6">
                    <Label htmlFor="slackWebhook">Webhook URL do Slack</Label>
                    <Input
                      id="slackWebhook"
                      value={settings.slackWebhook || ""}
                      onChange={(e) => handleSettingsUpdate({ slackWebhook: e.target.value })}
                      placeholder="https://hooks.slack.com/services/..."
                    />
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Webhook className="h-4 w-4" />
                    <Label>Webhook Personalizado</Label>
                  </div>
                  <Switch checked={settings.webhook} onCheckedChange={(webhook) => handleSettingsUpdate({ webhook })} />
                </div>
                {settings.webhook && (
                  <div className="ml-6">
                    <Label htmlFor="customWebhook">URL do Webhook</Label>
                    <Input
                      id="customWebhook"
                      value={settings.customWebhook || ""}
                      onChange={(e) => handleSettingsUpdate({ customWebhook: e.target.value })}
                      placeholder="https://api.exemplo.com/webhook"
                    />
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Alert Details Dialog */}
        <Dialog open={!!selectedAlert} onOpenChange={() => setSelectedAlert(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {selectedAlert && getAlertIcon(selectedAlert.type)}
                {selectedAlert?.title}
              </DialogTitle>
              <DialogDescription>Detalhes do alerta</DialogDescription>
            </DialogHeader>

            {selectedAlert && (
              <div className="space-y-4">
                <div>
                  <Label>Mensagem</Label>
                  <p className="text-sm">{selectedAlert.message}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Severidade</Label>
                    <p className="text-sm">{getSeverityBadge(selectedAlert.severity)}</p>
                  </div>
                  <div>
                    <Label>Fonte</Label>
                    <p className="text-sm capitalize">{selectedAlert.source}</p>
                  </div>
                </div>

                <div>
                  <Label>Timestamp</Label>
                  <p className="text-sm">
                    {formatDistanceToNow(new Date(selectedAlert.timestamp), { locale: ptBR, addSuffix: true })}
                  </p>
                </div>

                <div className="flex gap-2">
                  {selectedAlert.actions?.map((action) => (
                    <Button
                      key={action.id}
                      variant={action.variant || "outline"}
                      size="sm"
                      onClick={() => {
                        handleAlertAction(selectedAlert, action.id)
                        setSelectedAlert(null)
                      }}
                    >
                      {action.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
