export interface BackupConfig {
  id: string
  name: string
  description: string
  enabled: boolean
  schedule: string // cron expression
  retention: number // days
  targets: BackupTarget[]
  compression: boolean
  encryption: boolean
  lastRun?: string
  nextRun?: string
  status: "idle" | "running" | "completed" | "failed"
}

export interface BackupTarget {
  type: "database" | "files" | "configs" | "demos"
  path: string
  exclude?: string[]
}

export interface BackupJob {
  id: string
  configId: string
  status: "pending" | "running" | "completed" | "failed"
  startTime: string
  endTime?: string
  size?: number
  error?: string
  progress?: number
}

export interface RestorePoint {
  id: string
  name: string
  description: string
  timestamp: string
  size: number
  type: "full" | "incremental"
  configId: string
  path: string
  verified: boolean
}
