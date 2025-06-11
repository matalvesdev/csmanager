import type { Alert, AlertRule, AlertCondition, NotificationSettings, AlertAction } from "@/types/alerts"
import type { SystemMetrics, ServerStatus } from "@/types/infra"

class AlertSystem {
  private alerts: Alert[] = []
  private rules: AlertRule[] = []
  private settings: NotificationSettings = {
    email: false,
    discord: false,
    slack: false,
    webhook: false,
    emailAddress: "",
    discordWebhook: "",
    slackWebhook: "",
    customWebhook: "",
  }

  // Default alert rules
  private defaultRules: AlertRule[] = [
    {
      id: "cpu-high",
      name: "CPU Alto",
      description: "CPU acima de 80% por mais de 5 minutos",
      enabled: true,
      conditions: [
        {
          metric: "cpu",
          operator: ">",
          value: 80,
          duration: 300,
        },
      ],
      actions: ["notification", "email"],
      cooldown: 15,
    },
    {
      id: "memory-high",
      name: "Memória Alta",
      description: "Uso de memória acima de 90%",
      enabled: true,
      conditions: [
        {
          metric: "memory.used",
          operator: ">",
          value: 90,
          duration: 60,
        },
      ],
      actions: ["notification"],
      cooldown: 10,
    },
    {
      id: "disk-full",
      name: "Disco Cheio",
      description: "Espaço em disco acima de 95%",
      enabled: true,
      conditions: [
        {
          metric: "disk.used",
          operator: ">",
          value: 95,
          duration: 0,
        },
      ],
      actions: ["notification", "email", "discord"],
      cooldown: 60,
    },
    {
      id: "server-offline",
      name: "Servidor Offline",
      description: "Servidor CS 1.6 ficou offline",
      enabled: true,
      conditions: [
        {
          metric: "server.status",
          operator: "=",
          value: 0, // 0 = offline
          duration: 30,
        },
      ],
      actions: ["notification", "email"],
      cooldown: 5,
    },
  ]

  constructor() {
    this.rules = [...this.defaultRules]
  }

  // Check metrics against alert rules
  checkMetrics(metrics: SystemMetrics, servers: ServerStatus[]) {
    this.rules.forEach((rule) => {
      if (!rule.enabled) return

      const shouldTrigger = rule.conditions.every((condition) => {
        return this.evaluateCondition(condition, metrics, servers)
      })

      if (shouldTrigger && this.canTriggerRule(rule)) {
        this.triggerAlert(rule, metrics, servers)
      }
    })
  }

  private evaluateCondition(condition: AlertCondition, metrics: SystemMetrics, servers: ServerStatus[]): boolean {
    let value: number

    switch (condition.metric) {
      case "cpu":
        value = metrics.cpu
        break
      case "memory.used":
        value = (metrics.memory.used / metrics.memory.total) * 100
        break
      case "disk.used":
        value = (metrics.disk.used / metrics.disk.total) * 100
        break
      case "server.status":
        // Count offline servers
        value = servers.filter((s) => s.status === "offline").length
        break
      default:
        return false
    }

    switch (condition.operator) {
      case ">":
        return value > condition.value
      case "<":
        return value < condition.value
      case ">=":
        return value >= condition.value
      case "<=":
        return value <= condition.value
      case "=":
        return value === condition.value
      case "!=":
        return value !== condition.value
      default:
        return false
    }
  }

  private canTriggerRule(rule: AlertRule): boolean {
    if (!rule.lastTriggered) return true

    const lastTriggered = new Date(rule.lastTriggered)
    const now = new Date()
    const cooldownMs = rule.cooldown * 60 * 1000

    return now.getTime() - lastTriggered.getTime() > cooldownMs
  }

  private triggerAlert(rule: AlertRule, metrics: SystemMetrics, servers: ServerStatus[]) {
    const alert: Alert = {
      id: `${rule.id}-${Date.now()}`,
      type: this.getAlertType(rule),
      title: rule.name,
      message: this.generateAlertMessage(rule, metrics, servers),
      source: "system",
      timestamp: new Date().toISOString(),
      read: false,
      acknowledged: false,
      severity: this.getAlertSeverity(rule),
      actions: this.getAlertActions(rule),
    }

    this.alerts.unshift(alert)
    rule.lastTriggered = new Date().toISOString()

    // Send notifications
    this.sendNotifications(alert)

    // Trigger callbacks
    this.onAlertTriggered?.(alert)
  }

  private getAlertType(rule: AlertRule): Alert["type"] {
    if (rule.id.includes("error") || rule.id.includes("offline")) return "error"
    if (rule.id.includes("warning") || rule.id.includes("high")) return "warning"
    return "info"
  }

  private getAlertSeverity(rule: AlertRule): Alert["severity"] {
    if (rule.id.includes("critical") || rule.id.includes("offline")) return "critical"
    if (rule.id.includes("high") || rule.id.includes("full")) return "high"
    if (rule.id.includes("warning")) return "medium"
    return "low"
  }

  private generateAlertMessage(rule: AlertRule, metrics: SystemMetrics, servers: ServerStatus[]): string {
    switch (rule.id) {
      case "cpu-high":
        return `CPU está em ${metrics.cpu.toFixed(1)}% de uso`
      case "memory-high":
        return `Memória está em ${((metrics.memory.used / metrics.memory.total) * 100).toFixed(1)}% de uso`
      case "disk-full":
        return `Disco está em ${((metrics.disk.used / metrics.disk.total) * 100).toFixed(1)}% de uso`
      case "server-offline":
        const offlineServers = servers.filter((s) => s.status === "offline")
        return `${offlineServers.length} servidor(es) offline: ${offlineServers.map((s) => s.name).join(", ")}`
      default:
        return rule.description
    }
  }

  private getAlertActions(rule: AlertRule): AlertAction[] {
    const actions: AlertAction[] = [
      {
        id: "acknowledge",
        label: "Reconhecer",
        action: "acknowledge",
        variant: "outline",
      },
    ]

    if (rule.id === "server-offline") {
      actions.push({
        id: "restart-servers",
        label: "Reiniciar Servidores",
        action: "restart-servers",
        variant: "default",
      })
    }

    if (rule.id.includes("high") || rule.id.includes("full")) {
      actions.push({
        id: "view-details",
        label: "Ver Detalhes",
        action: "view-details",
        variant: "outline",
      })
    }

    return actions
  }

  private async sendNotifications(alert: Alert) {
    if (this.settings.email && this.settings.emailAddress) {
      await this.sendEmailNotification(alert)
    }

    if (this.settings.discord && this.settings.discordWebhook) {
      await this.sendDiscordNotification(alert)
    }

    if (this.settings.slack && this.settings.slackWebhook) {
      await this.sendSlackNotification(alert)
    }

    if (this.settings.webhook && this.settings.customWebhook) {
      await this.sendWebhookNotification(alert)
    }
  }

  private async sendEmailNotification(alert: Alert) {
    // Implementation for email notifications
    console.log("Sending email notification:", alert)
  }

  private async sendDiscordNotification(alert: Alert) {
    try {
      const webhook = this.settings.discordWebhook!
      const color = this.getDiscordColor(alert.type)

      await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          embeds: [
            {
              title: `🚨 ${alert.title}`,
              description: alert.message,
              color,
              timestamp: alert.timestamp,
              fields: [
                {
                  name: "Severidade",
                  value: alert.severity.toUpperCase(),
                  inline: true,
                },
                {
                  name: "Fonte",
                  value: alert.source.toUpperCase(),
                  inline: true,
                },
              ],
            },
          ],
        }),
      })
    } catch (error) {
      console.error("Error sending Discord notification:", error)
    }
  }

  private async sendSlackNotification(alert: Alert) {
    try {
      const webhook = this.settings.slackWebhook!
      const color = this.getSlackColor(alert.type)

      await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          attachments: [
            {
              color,
              title: alert.title,
              text: alert.message,
              fields: [
                {
                  title: "Severidade",
                  value: alert.severity.toUpperCase(),
                  short: true,
                },
                {
                  title: "Fonte",
                  value: alert.source.toUpperCase(),
                  short: true,
                },
              ],
              ts: Math.floor(new Date(alert.timestamp).getTime() / 1000),
            },
          ],
        }),
      })
    } catch (error) {
      console.error("Error sending Slack notification:", error)
    }
  }

  private async sendWebhookNotification(alert: Alert) {
    try {
      const webhook = this.settings.customWebhook!

      await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(alert),
      })
    } catch (error) {
      console.error("Error sending webhook notification:", error)
    }
  }

  private getDiscordColor(type: Alert["type"]): number {
    switch (type) {
      case "error":
        return 0xff0000 // Red
      case "warning":
        return 0xffa500 // Orange
      case "success":
        return 0x00ff00 // Green
      default:
        return 0x0099ff // Blue
    }
  }

  private getSlackColor(type: Alert["type"]): string {
    switch (type) {
      case "error":
        return "danger"
      case "warning":
        return "warning"
      case "success":
        return "good"
      default:
        return "#0099ff"
    }
  }

  // Public methods
  getAlerts(): Alert[] {
    return this.alerts
  }

  getUnreadAlerts(): Alert[] {
    return this.alerts.filter((alert) => !alert.read)
  }

  markAsRead(alertId: string) {
    const alert = this.alerts.find((a) => a.id === alertId)
    if (alert) {
      alert.read = true
    }
  }

  acknowledge(alertId: string) {
    const alert = this.alerts.find((a) => a.id === alertId)
    if (alert) {
      alert.acknowledged = true
      alert.read = true
    }
  }

  getRules(): AlertRule[] {
    return this.rules
  }

  updateRule(ruleId: string, updates: Partial<AlertRule>) {
    const ruleIndex = this.rules.findIndex((r) => r.id === ruleId)
    if (ruleIndex !== -1) {
      this.rules[ruleIndex] = { ...this.rules[ruleIndex], ...updates }
    }
  }

  getSettings(): NotificationSettings {
    return this.settings
  }

  updateSettings(settings: Partial<NotificationSettings>) {
    this.settings = { ...this.settings, ...settings }
  }

  // Callback for when alerts are triggered
  onAlertTriggered?: (alert: Alert) => void
}

export const alertSystem = new AlertSystem()
