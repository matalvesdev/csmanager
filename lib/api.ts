import type { Jogador, Partida, Time, Torneio, ConfiguracaoTorneio } from "@/types"

// Mock data
const jogadores: Jogador[] = [
  { id: "1", nome: "HeadHunter", tipo: "bot", perfil: "Entry", avatar: "/placeholder.svg?height=40&width=40" },
  { id: "2", nome: "Sniper", tipo: "bot", perfil: "AWPer", avatar: "/placeholder.svg?height=40&width=40" },
  { id: "3", nome: "Tactician", tipo: "bot", perfil: "IGL", avatar: "/placeholder.svg?height=40&width=40" },
  { id: "4", nome: "Shadow", tipo: "bot", perfil: "Lurker", avatar: "/placeholder.svg?height=40&width=40" },
  { id: "5", nome: "Guardian", tipo: "bot", perfil: "Support", avatar: "/placeholder.svg?height=40&width=40" },
  { id: "6", nome: "Player1", tipo: "humano", avatar: "/placeholder.svg?height=40&width=40" },
  { id: "7", nome: "Player2", tipo: "humano", avatar: "/placeholder.svg?height=40&width=40" },
  { id: "8", nome: "Player3", tipo: "humano", avatar: "/placeholder.svg?height=40&width=40" },
]

const times: Time[] = [
  { id: "1", nome: "Alpha Squad", jogadores: jogadores.slice(0, 5), logo: "/placeholder.svg?height=40&width=40" },
  {
    id: "2",
    nome: "Beta Force",
    jogadores: [...jogadores.slice(0, 3), jogadores[5], jogadores[6]],
    logo: "/placeholder.svg?height=40&width=40",
  },
  { id: "3", nome: "Gamma Team", jogadores: jogadores.slice(0, 5), logo: "/placeholder.svg?height=40&width=40" },
  { id: "4", nome: "Delta Ops", jogadores: jogadores.slice(0, 5), logo: "/placeholder.svg?height=40&width=40" },
  { id: "5", nome: "Epsilon Elite", jogadores: jogadores.slice(0, 5), logo: "/placeholder.svg?height=40&width=40" },
  { id: "6", nome: "Zeta Squad", jogadores: jogadores.slice(0, 5), logo: "/placeholder.svg?height=40&width=40" },
  { id: "7", nome: "Omega Team", jogadores: jogadores.slice(0, 5), logo: "/placeholder.svg?height=40&width=40" },
  { id: "8", nome: "Sigma Force", jogadores: jogadores.slice(0, 5), logo: "/placeholder.svg?height=40&width=40" },
]

const partidas: Partida[] = [
  {
    id: "1",
    timeA: times[0],
    timeB: times[1],
    status: "em_andamento",
    hltvDemoUrl: "https://example.com/demo1",
    inicioPrevisto: new Date().toISOString(),
    logs: ["!ready", "!startadm"],
    placar: { timeA: 7, timeB: 3 },
    mapa: "de_dust2",
    fase: "grupos",
    round: 1,
    position: 1,
  },
  {
    id: "2",
    timeA: times[2],
    timeB: times[3],
    status: "agendada",
    hltvDemoUrl: "",
    inicioPrevisto: new Date(Date.now() + 3600000).toISOString(),
    logs: [],
    mapa: "de_inferno",
    fase: "grupos",
    round: 1,
    position: 2,
  },
  {
    id: "3",
    timeA: times[4],
    timeB: times[5],
    status: "finalizada",
    hltvDemoUrl: "https://example.com/demo3",
    inicioPrevisto: new Date(Date.now() - 7200000).toISOString(),
    logs: ["!ready", "!startadm", "Partida finalizada"],
    placar: { timeA: 16, timeB: 14 },
    mapa: "de_nuke",
    fase: "eliminacao",
    round: 1,
    position: 1,
  },
]

const configuracaoPadrao: ConfiguracaoTorneio = {
  modoPartida: "MR15",
  tempoRound: 115,
  tempoBomba: 35,
  tempoFreeze: 6,
  maxRounds: 30,
  overtime: true,
  overtimeRounds: 6,
  friendlyFire: false,
  autoKick: true,
  forceCamera: true,
  ghostFreq: false,
  hltv: {
    habilitado: true,
    ip: "127.0.0.1",
    porta: 27020,
    senha: "",
    delay: 90,
  },
  servidor: {
    tickrate: 100,
    fps_max: 300,
    sv_maxrate: 25000,
    sv_minrate: 5000,
    sv_maxupdaterate: 101,
    sv_minupdaterate: 10,
    sv_maxcmdrate: 101,
    sv_mincmdrate: 10,
  },
  mapas: ["de_dust2", "de_inferno", "de_nuke", "de_train", "de_mirage", "de_cache", "de_overpass"],
  formatoMapas: "bo3",
  banPick: true,
  pausas: {
    habilitadas: true,
    maxPausasPorTime: 4,
    tempoPausa: 300,
  },
  substitutos: {
    habilitados: true,
    maxSubstitutos: 2,
  },
}

// Atualizar os torneios mock para incluir a configuração
const torneios: Torneio[] = [
  {
    id: "1",
    nome: "Campeonato CS 1.6 2023",
    dataInicio: new Date().toISOString(),
    dataFim: new Date(Date.now() + 604800000).toISOString(),
    status: "em_andamento",
    grupos: [
      {
        id: "1",
        nome: "Grupo A",
        times: times.slice(0, 4),
      },
      {
        id: "2",
        nome: "Grupo B",
        times: times.slice(4, 8),
      },
    ],
    partidas: partidas,
    configuracao: configuracaoPadrao,
    descricao: "Campeonato oficial de Counter-Strike 1.6",
    premiacao: "R$ 10.000 para o primeiro lugar",
  },
  {
    id: "2",
    nome: "Copa Bot Masters",
    dataInicio: new Date(Date.now() + 1209600000).toISOString(),
    dataFim: new Date(Date.now() + 1814400000).toISOString(),
    status: "agendado",
    grupos: [],
    partidas: [],
    configuracao: {
      ...configuracaoPadrao,
      modoPartida: "MR12",
      formatoMapas: "bo1",
    },
    descricao: "Torneio exclusivo para bots",
  },
]

// API functions
export const api = {
  // Torneios
  getTorneios: async (): Promise<Torneio[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(torneios), 500)
    })
  },

  getTorneioById: async (id: string): Promise<Torneio | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(torneios.find((t) => t.id === id)), 500)
    })
  },

  createTorneio: async (torneio: Omit<Torneio, "id">): Promise<Torneio> => {
    const newTorneio = {
      ...torneio,
      id: `${torneios.length + 1}`,
    }
    torneios.push(newTorneio)
    return new Promise((resolve) => {
      setTimeout(() => resolve(newTorneio), 500)
    })
  },

  // Partidas
  getPartidas: async (): Promise<Partida[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(partidas), 500)
    })
  },

  getPartidaById: async (id: string): Promise<Partida | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(partidas.find((p) => p.id === id)), 500)
    })
  },

  startPartida: async (id: string): Promise<Partida> => {
    const partida = partidas.find((p) => p.id === id)
    if (partida) {
      partida.status = "em_andamento"
      partida.logs.push("!startadm")
    }
    return new Promise((resolve) => {
      setTimeout(() => resolve(partida!), 500)
    })
  },

  readyPartida: async (id: string): Promise<Partida> => {
    const partida = partidas.find((p) => p.id === id)
    if (partida) {
      partida.logs.push("!ready")
    }
    return new Promise((resolve) => {
      setTimeout(() => resolve(partida!), 500)
    })
  },

  cancelPartida: async (id: string): Promise<Partida> => {
    const partida = partidas.find((p) => p.id === id)
    if (partida) {
      partida.status = "agendada"
      partida.logs.push("Partida cancelada")
    }
    return new Promise((resolve) => {
      setTimeout(() => resolve(partida!), 500)
    })
  },

  // Jogadores
  getJogadores: async (): Promise<Jogador[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(jogadores), 500)
    })
  },

  // Novas funcionalidades
  agendarPartida: async (data: {
    torneioId: string
    timeA: Time
    timeB: Time
    mapa: string
    inicioPrevisto: string
  }): Promise<Partida> => {
    const newPartida: Partida = {
      id: `${partidas.length + 1}`,
      timeA: data.timeA,
      timeB: data.timeB,
      status: "agendada",
      hltvDemoUrl: "",
      inicioPrevisto: data.inicioPrevisto,
      logs: [],
      mapa: data.mapa,
      fase: "grupos",
      round: 1,
      position: partidas.length + 1,
    }

    partidas.push(newPartida)

    // Adicionar à lista de partidas do torneio
    const torneio = torneios.find((t) => t.id === data.torneioId)
    if (torneio) {
      torneio.partidas.push(newPartida)
    }

    return new Promise((resolve) => {
      setTimeout(() => resolve(newPartida), 500)
    })
  },

  gerarBracket: async (torneioId: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulação de geração de bracket
        console.log(`Gerando bracket para torneio ${torneioId}`)
        resolve()
      }, 1000)
    })
  },
}
