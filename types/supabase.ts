export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      jogadores: {
        Row: {
          id: string
          nome: string
          tipo: "bot" | "humano"
          perfil: "IGL" | "Entry" | "Lurker" | "Support" | "AWPer" | null
          avatar: string | null
          nacionalidade: string | null
          created_at: string
        }
        Insert: {
          id?: string
          nome: string
          tipo?: "bot" | "humano"
          perfil?: "IGL" | "Entry" | "Lurker" | "Support" | "AWPer" | null
          avatar?: string | null
          nacionalidade?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          nome?: string
          tipo?: "bot" | "humano"
          perfil?: "IGL" | "Entry" | "Lurker" | "Support" | "AWPer" | null
          avatar?: string | null
          nacionalidade?: string | null
          created_at?: string
        }
      }
      times: {
        Row: {
          id: string
          nome: string
          logo: string | null
          pais: string | null
          created_at: string
        }
        Insert: {
          id?: string
          nome: string
          logo?: string | null
          pais?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          nome?: string
          logo?: string | null
          pais?: string | null
          created_at?: string
        }
      }
      time_jogadores: {
        Row: {
          time_id: string
          jogador_id: string
        }
        Insert: {
          time_id: string
          jogador_id: string
        }
        Update: {
          time_id?: string
          jogador_id?: string
        }
      }
      torneios: {
        Row: {
          id: string
          nome: string
          descricao: string | null
          premiacao: string | null
          regulamento: string | null
          data_inicio: string
          data_fim: string
          status: "agendado" | "em_andamento" | "finalizado"
          configuracao: Json
          created_at: string
        }
        Insert: {
          id?: string
          nome: string
          descricao?: string | null
          premiacao?: string | null
          regulamento?: string | null
          data_inicio: string
          data_fim: string
          status?: "agendado" | "em_andamento" | "finalizado"
          configuracao: Json
          created_at?: string
        }
        Update: {
          id?: string
          nome?: string
          descricao?: string | null
          premiacao?: string | null
          regulamento?: string | null
          data_inicio?: string
          data_fim?: string
          status?: "agendado" | "em_andamento" | "finalizado"
          configuracao?: Json
          created_at?: string
        }
      }
      grupos: {
        Row: {
          id: string
          torneio_id: string
          nome: string
          created_at: string
        }
        Insert: {
          id?: string
          torneio_id: string
          nome: string
          created_at?: string
        }
        Update: {
          id?: string
          torneio_id?: string
          nome?: string
          created_at?: string
        }
      }
      grupo_times: {
        Row: {
          grupo_id: string
          time_id: string
        }
        Insert: {
          grupo_id: string
          time_id: string
        }
        Update: {
          grupo_id?: string
          time_id?: string
        }
      }
      partidas: {
        Row: {
          id: string
          torneio_id: string
          time_a_id: string
          time_b_id: string
          mapa: string | null
          fase: "grupos" | "eliminacao" | null
          round_number: number | null
          position_number: number | null
          inicio_previsto: string
          status: "agendada" | "em_andamento" | "finalizada"
          placar_time_a: number | null
          placar_time_b: number | null
          hltv_demo_url: string | null
          logs: string[] | null
          created_at: string
        }
        Insert: {
          id?: string
          torneio_id: string
          time_a_id: string
          time_b_id: string
          mapa?: string | null
          fase?: "grupos" | "eliminacao" | null
          round_number?: number | null
          position_number?: number | null
          inicio_previsto: string
          status?: "agendada" | "em_andamento" | "finalizada"
          placar_time_a?: number | null
          placar_time_b?: number | null
          hltv_demo_url?: string | null
          logs?: string[] | null
          created_at?: string
        }
        Update: {
          id?: string
          torneio_id?: string
          time_a_id?: string
          time_b_id?: string
          mapa?: string | null
          fase?: "grupos" | "eliminacao" | null
          round_number?: number | null
          position_number?: number | null
          inicio_previsto?: string
          status?: "agendada" | "em_andamento" | "finalizada"
          placar_time_a?: number | null
          placar_time_b?: number | null
          hltv_demo_url?: string | null
          logs?: string[] | null
          created_at?: string
        }
      }
      templates_torneio: {
        Row: {
          id: string
          nome: string
          descricao: string | null
          configuracao: Json
          created_at: string
        }
        Insert: {
          id?: string
          nome: string
          descricao?: string | null
          configuracao: Json
          created_at?: string
        }
        Update: {
          id?: string
          nome?: string
          descricao?: string | null
          configuracao?: Json
          created_at?: string
        }
      }
    }
  }
}
