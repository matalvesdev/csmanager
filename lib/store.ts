import { create } from "zustand"
import type { Jogador, Partida, Torneio } from "@/types"

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
  createTorneio: (torneio: Omit<Torneio, "id" | "grupos" | "partidas">) => Promise<void>
  updateTorneio: (id: string, torneio: Partial<Torneio>) => Promise<void>
  deleteTorneio: (id: string) => Promise<void>
  clearError: () => void
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

  clearError: () => set({ error: null }),
}))
