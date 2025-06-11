import type { DockerContainer, HltvDemo, ServerConfig, ServerStatus, SystemMetrics } from "@/types/infra"

// Mock de dados para demonstração
const serverStatusMock: ServerStatus[] = [
  {
    id: "1",
    name: "CS Server #1",
    ip: "192.168.1.100",
    port: 27015,
    status: "online",
    players: 8,
    maxPlayers: 10,
    map: "de_dust2",
    cpu: 12.5,
    memory: 256,
    uptime: 3600,
    containerId: "cs-server-1",
    lastRestart: new Date(Date.now() - 3600000).toISOString(),
    version: "1.0.0",
  },
  {
    id: "2",
    name: "CS Server #2",
    ip: "192.168.1.101",
    port: 27016,
    status: "online",
    players: 0,
    maxPlayers: 10,
    map: "de_inferno",
    cpu: 5.2,
    memory: 128,
    uptime: 7200,
    containerId: "cs-server-2",
    lastRestart: new Date(Date.now() - 7200000).toISOString(),
    version: "1.0.0",
  },
  {
    id: "3",
    name: "HLTV Server",
    ip: "192.168.1.102",
    port: 27020,
    status: "online",
    players: 0,
    maxPlayers: 32,
    map: "",
    cpu: 3.1,
    memory: 96,
    uptime: 10800,
    containerId: "hltv-1",
    lastRestart: new Date(Date.now() - 10800000).toISOString(),
    version: "1.0.0",
  },
]

const dockerContainersMock: DockerContainer[] = [
  {
    id: "cs-server-1",
    name: "cs-server-1",
    image: "cs16-server:latest",
    status: "running",
    created: new Date(Date.now() - 86400000).toISOString(),
    ports: [
      {
        internal: 27015,
        external: 27015,
        protocol: "udp",
      },
    ],
    cpu: 12.5,
    memory: 256,
    logs: [
      "[2023-01-15 10:00:00] Server started",
      "[2023-01-15 10:01:00] Map changed to de_dust2",
      "[2023-01-15 10:05:00] Player connected: Player1",
      "[2023-01-15 10:06:00] Player connected: Player2",
    ],
  },
  {
    id: "hltv-1",
    name: "hltv-1",
    image: "cs16-hltv:latest",
    status: "running",
    created: new Date(Date.now() - 86400000).toISOString(),
    ports: [
      {
        internal: 27020,
        external: 27020,
        protocol: "udp",
      },
    ],
    cpu: 3.1,
    memory: 96,
    logs: [
      "[2023-01-15 10:00:00] HLTV started",
      "[2023-01-15 10:01:00] Connected to server",
      "[2023-01-15 10:05:00] Recording started",
    ],
  },
  {
    id: "db-1",
    name: "db-1",
    image: "postgres:latest",
    status: "running",
    created: new Date(Date.now() - 86400000).toISOString(),
    ports: [
      {
        internal: 5432,
        external: 5432,
        protocol: "tcp",
      },
    ],
    cpu: 2.3,
    memory: 512,
    logs: ["[2023-01-15 10:00:00] Database started", "[2023-01-15 10:01:00] Database initialized"],
  },
]

const serverConfigsMock: ServerConfig[] = [
  {
    id: "1",
    name: "CS Server Template",
    image: "cs16-server:latest",
    type: "cs-server",
    env: {
      RCON_PASSWORD: "secret",
      SV_PASSWORD: "",
      MAXPLAYERS: "10",
      MAP: "de_dust2",
    },
    ports: [
      {
        internal: 27015,
        external: 27015,
        protocol: "udp",
      },
    ],
    volumes: [
      {
        host: "./match_data",
        container: "/opt/cstrike",
      },
    ],
    autoRestart: true,
    cpuLimit: 1,
    memoryLimit: 512,
    networkMode: "bridge",
  },
  {
    id: "2",
    name: "HLTV Template",
    image: "cs16-hltv:latest",
    type: "hltv",
    env: {
      HLTV_PASSWORD: "",
      DELAY: "90",
    },
    ports: [
      {
        internal: 27020,
        external: 27020,
        protocol: "udp",
      },
    ],
    volumes: [
      {
        host: "./demos",
        container: "/opt/hltv/demos",
      },
    ],
    autoRestart: true,
    cpuLimit: 0.5,
    memoryLimit: 256,
    networkMode: "bridge",
  },
]

const hltvDemosMock: HltvDemo[] = [
  {
    id: "1",
    name: "match_20230115_team1_vs_team2_dust2",
    partida: "Team1 vs Team2",
    partidaId: "1",
    data: new Date(Date.now() - 86400000).toISOString(),
    tamanho: 15728640, // 15MB
    duracao: 1800, // 30 minutos
    downloadUrl: "/demos/match_20230115_team1_vs_team2_dust2.dem",
    status: "disponivel",
  },
  {
    id: "2",
    name: "match_20230116_team3_vs_team4_inferno",
    partida: "Team3 vs Team4",
    partidaId: "2",
    data: new Date(Date.now() - 172800000).toISOString(),
    tamanho: 20971520, // 20MB
    duracao: 2400, // 40 minutos
    downloadUrl: "/demos/match_20230116_team3_vs_team4_inferno.dem",
    status: "disponivel",
  },
  {
    id: "3",
    name: "match_20230117_team5_vs_team6_nuke",
    partida: "Team5 vs Team6",
    partidaId: "3",
    data: new Date(Date.now() - 3600000).toISOString(),
    tamanho: 10485760, // 10MB
    duracao: 1200, // 20 minutos
    downloadUrl: "/demos/match_20230117_team5_vs_team6_nuke.dem",
    status: "processando",
  },
]

const systemMetricsMock: SystemMetrics = {
  cpu: 35.2,
  memory: {
    total: 16384, // 16GB
    used: 8192, // 8GB
    free: 8192, // 8GB
  },
  disk: {
    total: 1048576, // 1TB
    used: 524288, // 500GB
    free: 524288, // 500GB
  },
  network: {
    rx: 1024, // 1MB/s
    tx: 512, // 0.5MB/s
  },
  containers: 5,
  containersRunning: 4,
  containersStopped: 1,
}

// API para infraestrutura
export const apiInfra = {
  // Servidores
  getServers: async (): Promise<ServerStatus[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(serverStatusMock), 500)
    })
  },

  getServerById: async (id: string): Promise<ServerStatus | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(serverStatusMock.find((s) => s.id === id)), 500)
    })
  },

  startServer: async (id: string): Promise<ServerStatus> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const server = serverStatusMock.find((s) => s.id === id)
        if (server) {
          server.status = "online"
          server.lastRestart = new Date().toISOString()
        }
        resolve(server!)
      }, 1500)
    })
  },

  stopServer: async (id: string): Promise<ServerStatus> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const server = serverStatusMock.find((s) => s.id === id)
        if (server) {
          server.status = "offline"
        }
        resolve(server!)
      }, 1500)
    })
  },

  restartServer: async (id: string): Promise<ServerStatus> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const server = serverStatusMock.find((s) => s.id === id)
        if (server) {
          server.status = "online"
          server.lastRestart = new Date().toISOString()
        }
        resolve(server!)
      }, 2000)
    })
  },

  // Docker Containers
  getContainers: async (): Promise<DockerContainer[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(dockerContainersMock), 500)
    })
  },

  getContainerById: async (id: string): Promise<DockerContainer | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(dockerContainersMock.find((c) => c.id === id)), 500)
    })
  },

  getContainerLogs: async (id: string): Promise<string[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const container = dockerContainersMock.find((c) => c.id === id)
        resolve(container?.logs || [])
      }, 500)
    })
  },

  startContainer: async (id: string): Promise<DockerContainer> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const container = dockerContainersMock.find((c) => c.id === id)
        if (container) {
          container.status = "running"
        }
        resolve(container!)
      }, 1500)
    })
  },

  stopContainer: async (id: string): Promise<DockerContainer> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const container = dockerContainersMock.find((c) => c.id === id)
        if (container) {
          container.status = "stopped"
        }
        resolve(container!)
      }, 1500)
    })
  },

  restartContainer: async (id: string): Promise<DockerContainer> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const container = dockerContainersMock.find((c) => c.id === id)
        if (container) {
          container.status = "running"
        }
        resolve(container!)
      }, 2000)
    })
  },

  // Configurações de Servidor
  getServerConfigs: async (): Promise<ServerConfig[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(serverConfigsMock), 500)
    })
  },

  getServerConfigById: async (id: string): Promise<ServerConfig | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(serverConfigsMock.find((c) => c.id === id)), 500)
    })
  },

  createServerConfig: async (config: Omit<ServerConfig, "id">): Promise<ServerConfig> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newConfig = {
          ...config,
          id: `${serverConfigsMock.length + 1}`,
        }
        serverConfigsMock.push(newConfig)
        resolve(newConfig)
      }, 1000)
    })
  },

  updateServerConfig: async (id: string, config: Partial<ServerConfig>): Promise<ServerConfig> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const configIndex = serverConfigsMock.findIndex((c) => c.id === id)
        if (configIndex !== -1) {
          serverConfigsMock[configIndex] = { ...serverConfigsMock[configIndex], ...config }
        }
        resolve(serverConfigsMock[configIndex])
      }, 1000)
    })
  },

  // HLTV Demos
  getHltvDemos: async (): Promise<HltvDemo[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(hltvDemosMock), 500)
    })
  },

  getHltvDemoById: async (id: string): Promise<HltvDemo | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(hltvDemosMock.find((d) => d.id === id)), 500)
    })
  },

  getHltvDemosByPartida: async (partidaId: string): Promise<HltvDemo[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(hltvDemosMock.filter((d) => d.partidaId === partidaId)), 500)
    })
  },

  // Métricas do Sistema
  getSystemMetrics: async (): Promise<SystemMetrics> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(systemMetricsMock), 500)
    })
  },
}
