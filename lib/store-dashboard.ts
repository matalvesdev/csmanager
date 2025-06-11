import { create } from "zustand"
import type { User } from "@/types/auth"

interface DashboardStats {
  totalUsuarios: number
  usuariosAtivos: number
  novosUsuarios30Dias: number
  totalTorneios: number
  torneiosAtivos: number
  totalPartidas: number
  partidasEmAndamento: number
  servidoresOnline: number
  containersAtivos: number
}

interface DashboardState {
  usuarios: User[]
  stats: DashboardStats
  isLoading: boolean
  error: string | null

  // Actions
  fetchUsuarios: () => Promise<void>
  fetchStats: () => Promise<void>
  updateStats: () => void
}

// Mock data para demonstração
const mockUsuarios: User[] = [
  {
    id: "1",
    nome: "Admin Sistema",
    email: "admin@cs16tournament.com",
    role: "admin",
    permissions: ["admin", "moderator", "user"],
    avatar: "/avatars/admin.jpg",
    status: "ativo",
    ultimoLogin: new Date().toISOString(),
    criadoEm: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    nome: "João Moderador",
    email: "joao@cs16tournament.com",
    role: "moderator",
    permissions: ["moderator", "user"],
    avatar: "/avatars/joao.jpg",
    status: "ativo",
    ultimoLogin: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    criadoEm: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    nome: "Carlos Organizador",
    email: "carlos@cs16tournament.com",
    role: "user",
    permissions: ["user"],
    avatar: "/avatars/carlos.jpg",
    status: "ativo",
    ultimoLogin: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    criadoEm: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "4",
    nome: "Ana Player",
    email: "ana@cs16tournament.com",
    role: "user",
    permissions: ["user"],
    avatar: "/avatars/ana.jpg",
    status: "inativo",
    ultimoLogin: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    criadoEm: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "5",
    nome: "Pedro Gamer",
    email: "pedro@cs16tournament.com",
    role: "user",
    permissions: ["user"],
    avatar: "/avatars/pedro.jpg",
    status: "ativo",
    ultimoLogin: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    criadoEm: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

const mockStats: DashboardStats = {
  totalUsuarios: 156,
  usuariosAtivos: 142,
  novosUsuarios30Dias: 23,
  totalTorneios: 45,
  torneiosAtivos: 12,
  totalPartidas: 1247,
  partidasEmAndamento: 8,
  servidoresOnline: 6,
  containersAtivos: 12,
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  usuarios: [],
  stats: mockStats,
  isLoading: false,
  error: null,

  fetchUsuarios: async () => {
    set({ isLoading: true, error: null })
    try {
      // Simular delay de API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      set({
        usuarios: mockUsuarios,
        isLoading: false,
      })
    } catch (error) {
      set({
        error: "Erro ao carregar usuários",
        isLoading: false,
      })
    }
  },

  fetchStats: async () => {
    set({ isLoading: true, error: null })
    try {
      // Simular delay de API
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Simular variação nas estatísticas
      const updatedStats = {
        ...mockStats,
        usuariosAtivos: mockStats.usuariosAtivos + Math.floor(Math.random() * 10) - 5,
        partidasEmAndamento: Math.max(0, mockStats.partidasEmAndamento + Math.floor(Math.random() * 6) - 3),
        servidoresOnline: Math.max(0, mockStats.servidoresOnline + Math.floor(Math.random() * 4) - 2),
      }

      set({
        stats: updatedStats,
        isLoading: false,
      })
    } catch (error) {
      set({
        error: "Erro ao carregar estatísticas",
        isLoading: false,
      })
    }
  },

  updateStats: () => {
    const { stats } = get()

    // Atualizar estatísticas com base nos dados atuais
    const updatedStats = {
      ...stats,
      usuariosAtivos: get().usuarios.filter((u) => u.status === "ativo").length,
      totalUsuarios: get().usuarios.length,
    }

    set({ stats: updatedStats })
  },
}))
