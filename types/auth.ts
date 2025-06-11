export interface Usuario {
  id: string
  nome: string
  email: string
  avatar?: string
  role: "admin" | "moderador" | "organizador" | "usuario"
  permissoes: Permissao[]
  ativo: boolean
  ultimoLogin?: string
  criadoEm: string
}

export interface Permissao {
  id: string
  nome: string
  descricao: string
  categoria: "torneios" | "partidas" | "jogadores" | "sistema" | "usuarios"
}

export interface Sessao {
  usuario: Usuario
  token: string
  expiresAt: string
}

export const PERMISSOES_PADRAO: Record<string, Permissao[]> = {
  admin: [{ id: "all", nome: "Acesso Total", descricao: "Acesso completo ao sistema", categoria: "sistema" }],
  moderador: [
    { id: "torneios.criar", nome: "Criar Torneios", descricao: "Pode criar novos torneios", categoria: "torneios" },
    {
      id: "torneios.editar",
      nome: "Editar Torneios",
      descricao: "Pode editar torneios existentes",
      categoria: "torneios",
    },
    {
      id: "partidas.gerenciar",
      nome: "Gerenciar Partidas",
      descricao: "Pode gerenciar partidas",
      categoria: "partidas",
    },
    {
      id: "jogadores.gerenciar",
      nome: "Gerenciar Jogadores",
      descricao: "Pode gerenciar jogadores",
      categoria: "jogadores",
    },
  ],
  organizador: [
    {
      id: "torneios.visualizar",
      nome: "Visualizar Torneios",
      descricao: "Pode visualizar torneios",
      categoria: "torneios",
    },
    {
      id: "partidas.visualizar",
      nome: "Visualizar Partidas",
      descricao: "Pode visualizar partidas",
      categoria: "partidas",
    },
    { id: "partidas.agendar", nome: "Agendar Partidas", descricao: "Pode agendar partidas", categoria: "partidas" },
  ],
  usuario: [
    {
      id: "torneios.visualizar",
      nome: "Visualizar Torneios",
      descricao: "Pode visualizar torneios",
      categoria: "torneios",
    },
    {
      id: "partidas.visualizar",
      nome: "Visualizar Partidas",
      descricao: "Pode visualizar partidas",
      categoria: "partidas",
    },
  ],
}
