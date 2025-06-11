import { create } from "zustand"
import type { Jogador, Partida, Torneio, ConfiguracaoTorneio } from "@/types"

interface AppState {
  torneios: Torneio[]
  partidas: Partida[]
  jogadores: Jogador[]
  currentTorneio: Torneio | null
  currentPartida: Partida | null
  templates: any[]
  isLoading: boolean
  error: string | null

  // Actions
  fetchTorneios: () => Promise<void>
  fetchPartidas: () => Promise<void>
  fetchJogadores: () => Promise<void>
  fetchTemplates: () => Promise<void>
  fetchTorneioById: (id: string) => Promise<void>
  fetchPartidaById: (id: string) => Promise<void>
  fetchTemplateById: (id: string) => Promise<Torneio | null>
  createTorneio: (torneio: Omit<Torneio, "id" | "grupos" | "partidas">) => Promise<void>
  updateTorneio: (id: string, torneio: Partial<Torneio>) => Promise<void>
  deleteTorneio: (id: string) => Promise<void>
  createTemplate: (template: { nome: string; descricao?: string; configuracao: ConfiguracaoTorneio }) => Promise<void>
  agendarPartida: (data: {
    torneioId: string
    timeAId: string
    timeBId: string
    mapa: string
    inicioPrevisto: string
  }) => Promise<void>
  startPartida: (id: string) => Promise<void>
  updatePartidaStatus: (id: string, status: string) => Promise<void>
}

export const useAppStore = create<AppState>((set, get) => ({
  torneios: [],
  partidas: [],
  jogadores: [],
  templates: [],
  currentTorneio: null,
  currentPartida: null,
  isLoading: false,
  error: null,

  fetchTorneios: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch("/api/torneios")
      if (!response.ok) throw new Error("Erro ao carregar torneios")

      const torneios = await response.json()
      set({ torneios, isLoading: false })
    } catch (error) {
      console.error("Erro ao carregar torneios:", error)
      set({ error: "Erro ao carregar torneios", isLoading: false })
    }
  },

  fetchPartidas: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch("/api/partidas")
      if (!response.ok) throw new Error("Erro ao carregar partidas")

      const partidas = await response.json()
      set({ partidas, isLoading: false })
    } catch (error) {
      console.error("Erro ao carregar partidas:", error)
      set({ error: "Erro ao carregar partidas", isLoading: false })
    }
  },

  fetchJogadores: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch("/api/jogadores")
      if (!response.ok) throw new Error("Erro ao carregar jogadores")

      const jogadores = await response.json()
      set({ jogadores, isLoading: false })
    } catch (error) {
      console.error("Erro ao carregar jogadores:", error)
      set({ error: "Erro ao carregar jogadores", isLoading: false })
    }
  },

  fetchTemplates: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch("/api/templates")
      if (!response.ok) throw new Error("Erro ao carregar templates")

      const templates = await response.json()
      set({ templates, isLoading: false })
    } catch (error) {
      console.error("Erro ao carregar templates:", error)
      set({ error: "Erro ao carregar templates", isLoading: false })
    }
  },

  fetchTorneioById: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`/api/torneios/${id}`)
      if (!response.ok) throw new Error("Erro ao carregar torneio")

      const torneio = await response.json()
      set({ currentTorneio: torneio, isLoading: false })
    } catch (error) {
      console.error("Erro ao carregar torneio:", error)
      set({ error: "Erro ao carregar torneio", isLoading: false })
    }
  },

  fetchPartidaById: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`/api/partidas/${id}`)
      if (!response.ok) throw new Error("Erro ao carregar partida")

      const partida = await response.json()
      set({ currentPartida: partida, isLoading: false })
    } catch (error) {
      console.error("Erro ao carregar partida:", error)
      set({ error: "Erro ao carregar partida", isLoading: false })
    }
  },

  fetchTemplateById: async (id: string) => {
    try {
      const response = await fetch(`/api/templates/${id}`)
      if (!response.ok) throw new Error("Erro ao carregar template")

      const template = await response.json()
      return template
    } catch (error) {
      console.error("Erro ao carregar template:", error)
      return null
    }
  },

  createTorneio: async (torneio) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch("/api/torneios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(torneio),
      })

      if (!response.ok) throw new Error("Erro ao criar torneio")

      const novoTorneio = await response.json()
      set((state) => ({
        torneios: [novoTorneio, ...state.torneios],
        isLoading: false,
      }))
    } catch (error) {
      console.error("Erro ao criar torneio:", error)
      set({ error: "Erro ao criar torneio", isLoading: false })
    }
  },

  updateTorneio: async (id, torneio) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`/api/torneios/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(torneio),
      })

      if (!response.ok) throw new Error("Erro ao atualizar torneio")

      const torneioAtualizado = await response.json()
      set((state) => ({
        torneios: state.torneios.map((t) => (t.id === id ? torneioAtualizado : t)),
        currentTorneio: state.currentTorneio?.id === id ? torneioAtualizado : state.currentTorneio,
        isLoading: false,
      }))
    } catch (error) {
      console.error("Erro ao atualizar torneio:", error)
      set({ error: "Erro ao atualizar torneio", isLoading: false })
    }
  },

  deleteTorneio: async (id) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`/api/torneios/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Erro ao deletar torneio")

      set((state) => ({
        torneios: state.torneios.filter((t) => t.id !== id),
        currentTorneio: state.currentTorneio?.id === id ? null : state.currentTorneio,
        isLoading: false,
      }))
    } catch (error) {
      console.error("Erro ao deletar torneio:", error)
      set({ error: "Erro ao deletar torneio", isLoading: false })
    }
  },

  createTemplate: async (template) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(template),
      })

      if (!response.ok) throw new Error("Erro ao criar template")

      const novoTemplate = await response.json()
      set((state) => ({
        templates: [novoTemplate, ...state.templates],
        isLoading: false,
      }))
    } catch (error) {
      console.error("Erro ao criar template:", error)
      set({ error: "Erro ao criar template", isLoading: false })
    }
  },

  agendarPartida: async (data) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch("/api/partidas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error("Erro ao agendar partida")

      const novaPartida = await response.json()
      set((state) => ({
        partidas: [novaPartida, ...state.partidas],
        isLoading: false,
      }))
    } catch (error) {
      console.error("Erro ao agendar partida:", error)
      set({ error: "Erro ao agendar partida", isLoading: false })
    }
  },

  startPartida: async (id) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`/api/partidas/${id}/start`, {
        method: "POST",
      })

      if (!response.ok) throw new Error("Erro ao iniciar partida")

      const partidaAtualizada = await response.json()
      set((state) => ({
        partidas: state.partidas.map((p) => (p.id === id ? partidaAtualizada : p)),
        currentPartida: state.currentPartida?.id === id ? partidaAtualizada : state.currentPartida,
        isLoading: false,
      }))
    } catch (error) {
      console.error("Erro ao iniciar partida:", error)
      set({ error: "Erro ao iniciar partida", isLoading: false })
    }
  },

  updatePartidaStatus: async (id, status) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`/api/partidas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) throw new Error("Erro ao atualizar status da partida")

      const partidaAtualizada = await response.json()
      set((state) => ({
        partidas: state.partidas.map((p) => (p.id === id ? partidaAtualizada : p)),
        currentPartida: state.currentPartida?.id === id ? partidaAtualizada : state.currentPartida,
        isLoading: false,
      }))
    } catch (error) {
      console.error("Erro ao atualizar status da partida:", error)
      set({ error: "Erro ao atualizar status da partida", isLoading: false })
    }
  },
}))
