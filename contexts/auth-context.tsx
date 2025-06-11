"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { Usuario, Sessao } from "@/types/auth"

interface AuthContextType {
  usuario: Usuario | null
  sessao: Sessao | null
  isLoading: boolean
  login: (email: string, senha: string) => Promise<boolean>
  logout: () => void
  hasPermission: (permissao: string) => boolean
  isAdmin: () => boolean
  isModerador: () => boolean
}

const AuthContext = createContext<AuthContextType>({
  usuario: null,
  sessao: null,
  isLoading: true,
  login: async () => false,
  logout: () => {},
  hasPermission: () => false,
  isAdmin: () => false,
  isModerador: () => false,
})

// Mock de usuários para demonstração
const usuariosMock: Usuario[] = [
  {
    id: "1",
    nome: "Admin Sistema",
    email: "admin@cs16tournament.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "admin",
    permissoes: [{ id: "all", nome: "Acesso Total", descricao: "Acesso completo ao sistema", categoria: "sistema" }],
    ativo: true,
    ultimoLogin: new Date().toISOString(),
    criadoEm: "2023-01-01T00:00:00.000Z",
  },
  {
    id: "2",
    nome: "João Moderador",
    email: "moderador@cs16tournament.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "moderador",
    permissoes: [
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
    ],
    ativo: true,
    ultimoLogin: new Date(Date.now() - 3600000).toISOString(),
    criadoEm: "2023-02-01T00:00:00.000Z",
  },
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [sessao, setSessao] = useState<Sessao | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)

    // Auto-login para ambiente de desenvolvimento
    // Remover em produção
    const autoLogin = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      const adminUser = usuariosMock[0]
      const novaSessao: Sessao = {
        usuario: adminUser,
        token: `token-${Date.now()}`,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      }
      setUsuario(adminUser)
      setSessao(novaSessao)
      if (typeof window !== "undefined") {
        localStorage.setItem("cs16-sessao", JSON.stringify(novaSessao))
      }
      setIsLoading(false)
    }

    autoLogin()
  }, [])

  const login = async (email: string, senha: string): Promise<boolean> => {
    setIsLoading(true)

    // Simulação de login
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const usuarioEncontrado = usuariosMock.find((u) => u.email === email)

    if (usuarioEncontrado && senha === "123456") {
      const novaSessao: Sessao = {
        usuario: usuarioEncontrado,
        token: `token-${Date.now()}`,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 horas
      }

      setUsuario(usuarioEncontrado)
      setSessao(novaSessao)
      if (typeof window !== "undefined") {
        localStorage.setItem("cs16-sessao", JSON.stringify(novaSessao))
      }
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  const logout = () => {
    setUsuario(null)
    setSessao(null)
    if (typeof window !== "undefined") {
      localStorage.removeItem("cs16-sessao")
    }
  }

  const hasPermission = (permissao: string): boolean => {
    if (!usuario) return false
    if (usuario.role === "admin") return true
    return usuario.permissoes.some((p) => p.id === permissao)
  }

  const isAdmin = (): boolean => {
    return usuario?.role === "admin" || false
  }

  const isModerador = (): boolean => {
    return usuario?.role === "moderador" || usuario?.role === "admin" || false
  }

  return (
    <AuthContext.Provider
      value={{
        usuario,
        sessao,
        isLoading,
        login,
        logout,
        hasPermission,
        isAdmin,
        isModerador,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  return context
}
