export interface SystemMetrics {
  cpu: number
  memory:
    | number
    | {
        used: number
        total: number
      }
  disk:
    | number
    | {
        used: number
        total: number
      }
  network: {
    rx: number
    tx: number
  }
  containers: ContainerMetrics[]
  uptime: number
  timestamp: string
}

export interface ContainerMetrics {
  id: string
  name: string
  status: "running" | "stopped" | "paused" | "restarting"
  cpu: number
  memory: number
}

export interface DockerContainer {
  id: string
  name: string
  image: string
  status: "running" | "stopped" | "paused" | "restarting" | "created"
  ports: string[]
  created: string
  started?: string
  environment: Record<string, string>
  volumes: string[]
  networks: string[]
}

export interface ServerConfig {
  id: string
  name: string
  type: "cs-server" | "hltv" | "api" | "database" | "web"
  image: string
  ports: Array<{
    container: number
    host: number
    protocol: "tcp" | "udp"
  }>
  environment: Record<string, string>
  volumes: Array<{
    host: string
    container: string
  }>
  resources: {
    cpuLimit: string
    memoryLimit: string
  }
  networks: string[]
  created: string
  updated: string
}

export interface Server {
  id: string
  name: string
  type: "cs-server" | "hltv" | "api" | "database" | "web"
  ip: string
  port: number
  status: "online" | "offline" | "starting" | "stopping" | "error"
  players: number
  maxPlayers: number
  cpu: number
  memory: number
  uptime: number
  map?: string | null
  lastRestart: string
}

export interface HltvDemo {
  id: string
  name: string
  partida: string
  data: string
  duracao: number // em segundos
  tamanho: number // em bytes
  status: "disponivel" | "processando" | "erro"
}
