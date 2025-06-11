import { create } from "zustand"
import type { Jogador, Partida, Torneio } from "@/types"

interface AppState {
  torneios: Torneio[]
  partidas: Partida[]
  jogadores: Jogador[]
  currentTorneio: Torneio | null
  currentPartida: Partida | null
  isLoading: boolean
  error: string | null

  // Actions
  fetchTorneios: () => Promise<void>
  fetchPartidas: () => Promise<void>
  fetchJogadores: () => Promise<void>
  fetchTorneioById: (id: string) => Promise<void>
  fetchPartidaById: (id: string) => Promise<void>
  createTorneio: (torneio: Omit<Torneio, "id">) => Promise<void>
  updateTorneio: (id: string, torneio: Partial<Torneio>) => Promise<void>
  deleteTorneio: (id: string) => Promise<void>
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
  currentTorneio: null,
  currentPartida: null,
  isLoading: false,
  error: null,

  fetchTorneios: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch("/api/torneios")
      if (!response.ok) throw new Error("Erro ao carregar torneios")

      const data = await response.json()
      const torneios = data.map((t: any) => ({
        id: t.id.toString(),
        nome: t.nome,
        descricao: t.descricao,
        premiacao: t.premiacao,
        regulamento: t.regulamento,
        dataInicio: t.data_inicio,
        dataFim: t.data_fim,
        status: t.status,
        grupos: t.grupos || [],
        partidas: t.partidas || [],
        configuracao: t.configuracao,
      }))

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

  fetchTorneioById: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`/api/torneios/${id}`)
      if (!response.ok) throw new Error("Erro ao carregar torneio")

      const data = await response.json()
      const torneio = {
        id: data.id.toString(),
        nome: data.nome,
        descricao: data.descricao,
        premiacao: data.premiacao,
        regulamento: data.regulamento,
        dataInicio: data.data_inicio,
        dataFim: data.data_fim,
        status: data.status,
        grupos: data.grupos || [],
        partidas: data.partidas || [],
        configuracao: data.configuracao,
      }

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

  createTorneio: async (torneioData: Omit<Torneio, "id">) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch("/api/torneios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: torneioData.nome,
          descricao: torneioData.descricao,
          premiacao: torneioData.premiacao,
          regulamento: torneioData.regulamento,
          dataInicio: torneioData.dataInicio,
          dataFim: torneioData.dataFim,
          configuracao: torneioData.configuracao,
        }),
      })

      if (!response.ok) throw new Error("Erro ao criar torneio")

      const newTorneio = await response.json()
      set((state) => ({
        torneios: [
          ...state.torneios,
          {
            ...newTorneio,
            id: newTorneio.id.toString(),
            grupos: [],
            partidas: [],
          },
        ],
        isLoading: false,
      }))
    } catch (error) {
      console.error("Erro ao criar torneio:", error)
      set({ error: "Erro ao criar torneio", isLoading: false })
    }
  },

  updateTorneio: async (id: string, torneioData: Partial<Torneio>) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`/api/torneios/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(torneioData),
      })

      if (!response.ok) throw new Error("Erro ao atualizar torneio")

      const updatedTorneio = await response.json()
      set((state) => ({
        torneios: state.torneios.map((t) =>
          t.id === id ? { ...t, ...updatedTorneio, id: updatedTorneio.id.toString() } : t,
        ),
        currentTorneio:
          state.currentTorneio?.id === id
            ? { ...state.currentTorneio, ...updatedTorneio, id: updatedTorneio.id.toString() }
            : state.currentTorneio,
        isLoading: false,
      }))
    } catch (error) {
      console.error("Erro ao atualizar torneio:", error)
      set({ error: "Erro ao atualizar torneio", isLoading: false })
    }
  },

  deleteTorneio: async (id: string) => {
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

  agendarPartida: async (data) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch("/api/partidas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error("Erro ao agendar partida")

      const newPartida = await response.json()
      set((state) => ({
        partidas: [...state.partidas, newPartida],
        isLoading: false,
      }))

      // Recarregar torneio se necessário
      if (data.torneioId) {
        get().fetchTorneioById(data.torneioId)
      }
    } catch (error) {
      console.error("Erro ao agendar partida:", error)
      set({ error: "Erro ao agendar partida", isLoading: false })
    }
  },

  startPartida: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`/api/partidas/${id}/start`, {
        method: "POST",
      })

      if (!response.ok) throw new Error("Erro ao iniciar partida")

      const updatedPartida = await response.json()
      set((state) => ({
        partidas: state.partidas.map((p) => (p.id === id ? updatedPartida : p)),
        currentPartida: state.currentPartida?.id === id ? updatedPartida : state.currentPartida,
        isLoading: false,
      }))
    } catch (error) {
      console.error("Erro ao iniciar partida:", error)
      set({ error: "Erro ao iniciar partida", isLoading: false })
    }
  },

  updatePartidaStatus: async (id: string, status: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`/api/partidas/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) throw new Error("Erro ao atualizar status da partida")

      const updatedPartida = await response.json()
      set((state) => ({
        partidas: state.partidas.map((p) => (p.id === id ? updatedPartida : p)),
        currentPartida: state.currentPartida?.id === id ? updatedPartida : state.currentPartida,
        isLoading: false,
      }))
    } catch (error) {
      console.error("Erro ao atualizar status da partida:", error)
      set({ error: "Erro ao atualizar status da partida", isLoading: false })
    }
  },
}))
