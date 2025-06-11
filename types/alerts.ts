export interface Alert {
  id: string
  type: "info" | "warning" | "error" | "success"
  title: string
  message: string
  source: "server" | "container" | "system" | "user"
  sourceId?: string
  timestamp: string
  read: boolean
  acknowledged: boolean
  severity: "low" | "medium" | "high" | "critical"
  actions?: AlertAction[]
}

export interface AlertAction {
  id: string
  label: string
  action: string
  variant?: "default" | "destructive" | "outline"
}

export interface AlertRule {
  id: string
  name: string
  description: string
  enabled: boolean
  conditions: AlertCondition[]
  actions: string[]
  cooldown: number // minutes
  lastTriggered?: string
}

export interface AlertCondition {
  metric: string
  operator: ">" | "<" | "=" | "!=" | ">=" | "<="
  value: number
  duration: number // seconds
}

export interface NotificationSettings {
  email: boolean
  discord: boolean
  slack: boolean
  webhook: boolean
  emailAddress?: string
  discordWebhook?: string
  slackWebhook?: string
  customWebhook?: string
}
