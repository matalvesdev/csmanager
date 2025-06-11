"use client"

import { useEffect, useState } from "react"
import { Search, Filter, User, Users, Globe } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAppStore } from "@/lib/store-supabase"
import Link from "next/link"

export default function JogadoresPage() {
  const { jogadores, isLoading, fetchJogadores } = useAppStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [perfilFilter, setPerfilFilter] = useState<string>("todos")
  const [nacionalidadeFilter, setNacionalidadeFilter] = useState<string>("todas")

  useEffect(() => {
    fetchJogadores()
  }, [fetchJogadores])

  const filteredJogadores = jogadores.filter((jogador) => {
    const matchesSearch = jogador.nome.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPerfil = perfilFilter === "todos" || jogador.perfil === perfilFilter
    const matchesNacionalidade = nacionalidadeFilter === "todas" || jogador.nacionalidade === nacionalidadeFilter

    return matchesSearch && matchesPerfil && matchesNacionalidade
  })

  const nacionalidades = Array.from(new Set(jogadores.map((j) => j.nacionalidade).filter(Boolean)))

  const getPerfilColor = (perfil: string) => {
    switch (perfil) {
      case "IGL":
        return "bg-purple-100 text-purple-800"
      case "Entry":
        return "bg-red-100 text-red-800"
      case "AWPer":
        return "bg-green-100 text-green-800"
      case "Support":
        return "bg-blue-100 text-blue-800"
      case "Lurker":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando jogadores...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Jogadores</h1>
          <p className="text-muted-foreground">Base de dados de jogadores de Counter-Strike 1.6</p>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar jogadores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={perfilFilter} onValueChange={setPerfilFilter}>
          <SelectTrigger className="w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filtrar por perfil" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os Perfis</SelectItem>
            <SelectItem value="IGL">IGL</SelectItem>
            <SelectItem value="Entry">Entry Fragger</SelectItem>
            <SelectItem value="AWPer">AWPer</SelectItem>
            <SelectItem value="Support">Support</SelectItem>
            <SelectItem value="Lurker">Lurker</SelectItem>
          </SelectContent>
        </Select>
        <Select value={nacionalidadeFilter} onValueChange={setNacionalidadeFilter}>
          <SelectTrigger className="w-48">
            <Globe className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filtrar por país" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas as Nacionalidades</SelectItem>
            {nacionalidades.map((nacionalidade) => (
              <SelectItem key={nacionalidade} value={nacionalidade}>
                {nacionalidade}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredJogadores.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <User className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum jogador encontrado</h3>
            <p className="text-muted-foreground text-center">Tente ajustar os filtros de busca</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredJogadores.map((jogador) => (
            <Link key={jogador.id} href={`/jogadores/${jogador.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={jogador.avatar || "/placeholder.svg"} alt={jogador.nome} />
                      <AvatarFallback>
                        {jogador.nome
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate">{jogador.nome}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        {jogador.nacionalidade && <span className="text-sm">{jogador.nacionalidade}</span>}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {jogador.perfil && <Badge className={getPerfilColor(jogador.perfil)}>{jogador.perfil}</Badge>}

                    {jogador.times && jogador.times.length > 0 && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="h-4 w-4 mr-1" />
                        {jogador.times.length} time{jogador.times.length !== 1 ? "s" : ""}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
