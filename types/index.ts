export interface Partida {
  id: string
  timeA: Time
  timeB: Time
  status: "agendada" | "em_andamento" | "finalizada"
  hltvDemoUrl: string
  inicioPrevisto: string
  logs: string[]
  placar?: {
    timeA: number
    timeB: number
  }
  mapa?: string
  fase?: "grupos" | "eliminacao"
  round?: number
  position?: number
}

export interface Time {
  id: string
  nome: string
  logo?: string
  jogadores: Jogador[]
}

export interface Jogador {
  id: string
  nome: string
  tipo: "bot" | "humano"
  perfil?: "IGL" | "Entry" | "Lurker" | "Support" | "AWPer"
  avatar?: string
}

export interface Torneio {
  id: string
  nome: string
  dataInicio: string
  dataFim: string
  status: "agendado" | "em_andamento" | "finalizado"
  grupos: Grupo[]
  partidas: Partida[]
  configuracao: ConfiguracaoTorneio
  descricao?: string
  premiacao?: string
  regulamento?: string
}

export interface Grupo {
  id: string
  nome: string
  times: Time[]
}

export interface ConfiguracaoTorneio {
  modoPartida: "MR15" | "MR12" | "MR10" | "MR30"
  tempoRound: number // em segundos
  tempoBomba: number // em segundos
  tempoFreeze: number // em segundos
  maxRounds: number
  overtime: boolean
  overtimeRounds: number
  friendlyFire: boolean
  autoKick: boolean
  forceCamera: boolean
  ghostFreq: boolean
  hltv: {
    habilitado: boolean
    ip?: string
    porta?: number
    senha?: string
    delay?: number
  }
  servidor: {
    tickrate: 100 | 128
    fps_max: number
    sv_maxrate: number
    sv_minrate: number
    sv_maxupdaterate: number
    sv_minupdaterate: number
    sv_maxcmdrate: number
    sv_mincmdrate: number
  }
  mapas: string[]
  formatoMapas: "bo1" | "bo3" | "bo5"
  banPick: boolean
  pausas: {
    habilitadas: boolean
    maxPausasPorTime: number
    tempoPausa: number // em segundos
  }
  substitutos: {
    habilitados: boolean
    maxSubstitutos: number
  }
}
