"use client"

import { create } from "zustand"
import type { SystemMetrics, DockerContainer, ServerConfig } from "@/types/infra"

interface InfraStore {
  systemMetrics: SystemMetrics | null
  containers: DockerContainer[]
  serverConfigs: ServerConfig[]
  isLoading: boolean
  error: string | null

  // Actions
  fetchSystemMetrics: () => Promise<void>
  fetchContainers: () => Promise<void>
  fetchServerConfigs: () => Promise<void>
  createContainer: (config: Partial<DockerContainer>) => Promise<void>
  startContainer: (id: string) => Promise<void>
  stopContainer: (id: string) => Promise<void>
  restartContainer: (id: string) => Promise<void>
  removeContainer: (id: string) => Promise<void>
}

export const useInfraStore = create<InfraStore>((set, get) => ({
  systemMetrics: null,
  containers: [],
  serverConfigs: [],
  isLoading: false,
  error: null,

  fetchSystemMetrics: async () => {
    try {
      set({ isLoading: true, error: null })

      // Simulação de dados de métricas com formato correto
      const mockMetrics: SystemMetrics = {
        cpu: Math.random() * 100,
        memory: {
          used: Math.random() * 8 * 1024 * 1024 * 1024, // 0-8 GB em bytes
          total: 16 * 1024 * 1024 * 1024, // 16 GB em bytes
        },
        disk: {
          used: Math.random() * 500 * 1024 * 1024 * 1024, // 0-500 GB em bytes
          total: 1024 * 1024 * 1024 * 1024, // 1 TB em bytes
        },
        network: {
          rx: Math.random() * 10 * 1024 * 1024, // 0-10 MB/s
          tx: Math.random() * 5 * 1024 * 1024, // 0-5 MB/s
        },
        containers: [
          {
            id: "cs-server-1",
            name: "cs-server-1",
            status: "running",
            cpu: Math.random() * 50,
            memory: Math.random() * 512 * 1024 * 1024, // 0-512 MB
          },
          {
            id: "hltv-1",
            name: "hltv-1",
            status: "running",
            cpu: Math.random() * 20,
            memory: Math.random() * 256 * 1024 * 1024, // 0-256 MB
          },
        ],
        uptime: Date.now() - Math.random() * 86400000, // 0-24 horas em ms
        timestamp: new Date().toISOString(),
      }

      set({ systemMetrics: mockMetrics, isLoading: false })
    } catch (error) {
      set({ error: "Erro ao buscar métricas do sistema", isLoading: false })
    }
  },

  fetchContainers: async () => {
    try {
      set({ isLoading: true, error: null })

      // Simulação de containers
      const mockContainers: DockerContainer[] = [
        {
          id: "cs-server-1",
          name: "cs-server-1",
          image: "cs16-server:latest",
          status: "running",
          ports: ["27015:27015/udp", "27020:27020/udp"],
          created: new Date(Date.now() - 3600000).toISOString(),
          started: new Date(Date.now() - 1800000).toISOString(),
          environment: {
            SERVER_NAME: "CS 1.6 Tournament Server",
            MAX_PLAYERS: "10",
          },
          volumes: ["/opt/cstrike:/cstrike"],
          networks: ["tournament-network"],
        },
        {
          id: "hltv-1",
          name: "hltv-recorder",
          image: "hltv:latest",
          status: "running",
          ports: ["27021:27021/udp"],
          created: new Date(Date.now() - 3600000).toISOString(),
          started: new Date(Date.now() - 1800000).toISOString(),
          environment: {
            HLTV_SERVER: "cs-server-1:27020",
          },
          volumes: ["/demos:/demos"],
          networks: ["tournament-network"],
        },
      ]

      set({ containers: mockContainers, isLoading: false })
    } catch (error) {
      set({ error: "Erro ao buscar containers", isLoading: false })
    }
  },

  fetchServerConfigs: async () => {
    try {
      set({ isLoading: true, error: null })

      // Simulação de configurações
      const mockConfigs: ServerConfig[] = [
        {
          id: "cs-server-template",
          name: "CS 1.6 Server Template",
          type: "cs-server",
          image: "cs16-server:latest",
          ports: [
            { container: 27015, host: 27015, protocol: "udp" },
            { container: 27020, host: 27020, protocol: "udp" },
          ],
          environment: {
            SERVER_NAME: "CS 1.6 Tournament Server",
            MAX_PLAYERS: "10",
            MAP: "de_dust2",
          },
          volumes: [{ host: "/opt/cstrike", container: "/cstrike" }],
          resources: {
            cpuLimit: "1.0",
            memoryLimit: "512m",
          },
          networks: ["tournament-network"],
          created: new Date().toISOString(),
          updated: new Date().toISOString(),
        },
      ]

      set({ serverConfigs: mockConfigs, isLoading: false })
    } catch (error) {
      set({ error: "Erro ao buscar configurações", isLoading: false })
    }
  },

  createContainer: async (config) => {
    try {
      set({ isLoading: true, error: null })
      // Simulação de criação de container
      await new Promise((resolve) => setTimeout(resolve, 1000))
      get().fetchContainers()
    } catch (error) {
      set({ error: "Erro ao criar container", isLoading: false })
    }
  },

  startContainer: async (id) => {
    try {
      set({ isLoading: true, error: null })
      // Simulação de start
      await new Promise((resolve) => setTimeout(resolve, 500))
      get().fetchContainers()
    } catch (error) {
      set({ error: "Erro ao iniciar container", isLoading: false })
    }
  },

  stopContainer: async (id) => {
    try {
      set({ isLoading: true, error: null })
      // Simulação de stop
      await new Promise((resolve) => setTimeout(resolve, 500))
      get().fetchContainers()
    } catch (error) {
      set({ error: "Erro ao parar container", isLoading: false })
    }
  },

  restartContainer: async (id) => {
    try {
      set({ isLoading: true, error: null })
      // Simulação de restart
      await new Promise((resolve) => setTimeout(resolve, 1000))
      get().fetchContainers()
    } catch (error) {
      set({ error: "Erro ao reiniciar container", isLoading: false })
    }
  },

  removeContainer: async (id) => {
    try {
      set({ isLoading: true, error: null })
      // Simulação de remoção
      await new Promise((resolve) => setTimeout(resolve, 500))
      get().fetchContainers()
    } catch (error) {
      set({ error: "Erro ao remover container", isLoading: false })
    }
  },
}))
