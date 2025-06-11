import type { BackupConfig, BackupJob, RestorePoint } from "@/types/backup"

class BackupSystem {
  private configs: BackupConfig[] = []
  private jobs: BackupJob[] = []
  private restorePoints: RestorePoint[] = []

  // Default backup configurations
  private defaultConfigs: BackupConfig[] = [
    {
      id: "daily-full",
      name: "Backup Diário Completo",
      description: "Backup completo de todos os dados importantes",
      enabled: true,
      schedule: "0 2 * * *", // Daily at 2 AM
      retention: 7,
      targets: [
        { type: "database", path: "/var/lib/postgresql/data" },
        { type: "configs", path: "/opt/cs-tournament/configs" },
        { type: "demos", path: "/opt/cs-tournament/demos" },
      ],
      compression: true,
      encryption: true,
      status: "idle",
    },
    {
      id: "hourly-configs",
      name: "Backup de Configurações",
      description: "Backup das configurações de servidores",
      enabled: true,
      schedule: "0 * * * *", // Every hour
      retention: 24,
      targets: [{ type: "configs", path: "/opt/cs-tournament/configs" }],
      compression: true,
      encryption: false,
      status: "idle",
    },
    {
      id: "weekly-demos",
      name: "Backup de Demos",
      description: "Backup semanal das demos HLTV",
      enabled: true,
      schedule: "0 3 * * 0", // Weekly on Sunday at 3 AM
      retention: 30,
      targets: [{ type: "demos", path: "/opt/cs-tournament/demos" }],
      compression: true,
      encryption: false,
      status: "idle",
    },
  ]

  constructor() {
    this.configs = [...this.defaultConfigs]
    this.generateMockData()
  }

  private generateMockData() {
    // Generate some mock restore points
    const now = new Date()
    for (let i = 0; i < 10; i++) {
      const timestamp = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      this.restorePoints.push({
        id: `restore-${i}`,
        name: `Backup ${timestamp.toLocaleDateString("pt-BR")}`,
        description: "Backup automático diário",
        timestamp: timestamp.toISOString(),
        size: Math.floor(Math.random() * 1000000000) + 100000000, // 100MB - 1GB
        type: i === 0 ? "full" : "incremental",
        configId: "daily-full",
        path: `/backups/daily-full-${timestamp.toISOString().split("T")[0]}.tar.gz`,
        verified: Math.random() > 0.1, // 90% verified
      })
    }

    // Generate some mock jobs
    for (let i = 0; i < 5; i++) {
      const startTime = new Date(now.getTime() - i * 60 * 60 * 1000)
      const endTime = new Date(startTime.getTime() + Math.random() * 30 * 60 * 1000)
      this.jobs.push({
        id: `job-${i}`,
        configId: this.configs[i % this.configs.length].id,
        status: i === 0 ? "running" : Math.random() > 0.8 ? "failed" : "completed",
        startTime: startTime.toISOString(),
        endTime: i === 0 ? undefined : endTime.toISOString(),
        size: Math.floor(Math.random() * 500000000) + 50000000,
        progress: i === 0 ? Math.floor(Math.random() * 100) : 100,
        error: i === 1 && Math.random() > 0.5 ? "Falha na conexão com o banco de dados" : undefined,
      })
    }
  }

  // Backup configuration management
  getConfigs(): BackupConfig[] {
    return this.configs
  }

  getConfig(id: string): BackupConfig | undefined {
    return this.configs.find((config) => config.id === id)
  }

  createConfig(config: Omit<BackupConfig, "id">): BackupConfig {
    const newConfig: BackupConfig = {
      ...config,
      id: `config-${Date.now()}`,
    }
    this.configs.push(newConfig)
    return newConfig
  }

  updateConfig(id: string, updates: Partial<BackupConfig>): BackupConfig | null {
    const configIndex = this.configs.findIndex((config) => config.id === id)
    if (configIndex === -1) return null

    this.configs[configIndex] = { ...this.configs[configIndex], ...updates }
    return this.configs[configIndex]
  }

  deleteConfig(id: string): boolean {
    const configIndex = this.configs.findIndex((config) => config.id === id)
    if (configIndex === -1) return false

    this.configs.splice(configIndex, 1)
    return true
  }

  // Backup job management
  getJobs(): BackupJob[] {
    return this.jobs.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
  }

  getJobsByConfig(configId: string): BackupJob[] {
    return this.jobs.filter((job) => job.configId === configId)
  }

  async runBackup(configId: string): Promise<BackupJob> {
    const config = this.getConfig(configId)
    if (!config) {
      throw new Error("Configuração de backup não encontrada")
    }

    const job: BackupJob = {
      id: `job-${Date.now()}`,
      configId,
      status: "running",
      startTime: new Date().toISOString(),
      progress: 0,
    }

    this.jobs.unshift(job)

    // Simulate backup process
    this.simulateBackupProgress(job)

    return job
  }

  private async simulateBackupProgress(job: BackupJob) {
    const config = this.getConfig(job.configId)!
    const totalSteps = config.targets.length * 10

    for (let step = 0; step <= totalSteps; step++) {
      await new Promise((resolve) => setTimeout(resolve, 100))
      job.progress = Math.floor((step / totalSteps) * 100)

      // Simulate occasional failures
      if (Math.random() < 0.05) {
        job.status = "failed"
        job.error = "Erro simulado durante o backup"
        job.endTime = new Date().toISOString()
        return
      }
    }

    // Complete the job
    job.status = "completed"
    job.endTime = new Date().toISOString()
    job.size = Math.floor(Math.random() * 500000000) + 50000000
    job.progress = 100

    // Create restore point
    const restorePoint: RestorePoint = {
      id: `restore-${Date.now()}`,
      name: `${config.name} - ${new Date().toLocaleDateString("pt-BR")}`,
      description: `Backup criado automaticamente`,
      timestamp: new Date().toISOString(),
      size: job.size,
      type: "full",
      configId: config.id,
      path: `/backups/${config.id}-${Date.now()}.tar.gz`,
      verified: true,
    }

    this.restorePoints.unshift(restorePoint)
  }

  // Restore point management
  getRestorePoints(): RestorePoint[] {
    return this.restorePoints.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }

  getRestorePointsByConfig(configId: string): RestorePoint[] {
    return this.restorePoints.filter((point) => point.configId === configId)
  }

  async verifyRestorePoint(id: string): Promise<boolean> {
    const point = this.restorePoints.find((p) => p.id === id)
    if (!point) return false

    // Simulate verification process
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const isValid = Math.random() > 0.1 // 90% success rate
    point.verified = isValid

    return isValid
  }

  async restoreFromPoint(id: string, options: { overwrite: boolean; target?: string }): Promise<boolean> {
    const point = this.restorePoints.find((p) => p.id === id)
    if (!point) return false

    // Simulate restore process
    await new Promise((resolve) => setTimeout(resolve, 5000))

    return Math.random() > 0.05 // 95% success rate
  }

  deleteRestorePoint(id: string): boolean {
    const pointIndex = this.restorePoints.findIndex((point) => point.id === id)
    if (pointIndex === -1) return false

    this.restorePoints.splice(pointIndex, 1)
    return true
  }

  // Utility methods
  getStorageUsage(): { total: number; used: number; available: number } {
    const totalSize = this.restorePoints.reduce((sum, point) => sum + point.size, 0)
    return {
      total: 1000000000000, // 1TB
      used: totalSize,
      available: 1000000000000 - totalSize,
    }
  }

  getNextScheduledRun(configId: string): Date | null {
    const config = this.getConfig(configId)
    if (!config || !config.enabled) return null

    // Simple cron parsing for demo purposes
    // In a real implementation, use a proper cron library
    const now = new Date()
    const nextRun = new Date(now.getTime() + 24 * 60 * 60 * 1000) // Next day for demo
    return nextRun
  }

  cleanupOldBackups(): number {
    let deletedCount = 0

    this.configs.forEach((config) => {
      const configRestorePoints = this.getRestorePointsByConfig(config.id)
      const retentionDate = new Date()
      retentionDate.setDate(retentionDate.getDate() - config.retention)

      const toDelete = configRestorePoints.filter((point) => new Date(point.timestamp) < retentionDate)

      toDelete.forEach((point) => {
        this.deleteRestorePoint(point.id)
        deletedCount++
      })
    })

    return deletedCount
  }
}

export const backupSystem = new BackupSystem()
