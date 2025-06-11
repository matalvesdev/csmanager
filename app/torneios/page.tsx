"use client"

import { useEffect, useState } from "react"
import { Plus, Search, Filter, Calendar, Trophy, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAppStore } from "@/lib/store-supabase"
import { formatDate } from "@/lib/format"
import Link from "next/link"

export default function TorneiosPage() {
  const { torneios, isLoading, fetchTorneios } = useAppStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("todos")

  useEffect(() => {
    fetchTorneios()
  }, [fetchTorneios])

  const filteredTorneios = torneios.filter((torneio) => {
    const matchesSearch =
      torneio.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      torneio.descricao.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "todos" || torneio.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "agendado":
        return "bg-blue-100 text-blue-800"
      case "em_andamento":
        return "bg-green-100 text-green-800"
      case "finalizado":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "agendado":
        return "Agendado"
      case "em_andamento":
        return "Em Andamento"
      case "finalizado":
        return "Finalizado"
      default:
        return status
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando torneios...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Torneios</h1>
          <p className="text-muted-foreground">Gerencie torneios de Counter-Strike 1.6</p>
        </div>
        <Link href="/torneios/novo">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Torneio
          </Button>
        </Link>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar torneios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os Status</SelectItem>
            <SelectItem value="agendado">Agendado</SelectItem>
            <SelectItem value="em_andamento">Em Andamento</SelectItem>
            <SelectItem value="finalizado">Finalizado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredTorneios.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Trophy className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum torneio encontrado</h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchTerm || statusFilter !== "todos"
                ? "Tente ajustar os filtros de busca"
                : "Comece criando seu primeiro torneio"}
            </p>
            {!searchTerm && statusFilter === "todos" && (
              <Link href="/torneios/novo">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeiro Torneio
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTorneios.map((torneio) => (
            <Link key={torneio.id} href={`/torneios/${torneio.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{torneio.nome}</CardTitle>
                      <CardDescription className="line-clamp-2">{torneio.descricao}</CardDescription>
                    </div>
                    <Badge className={getStatusColor(torneio.status)}>{getStatusText(torneio.status)}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formatDate(torneio.dataInicio)} - {formatDate(torneio.dataFim)}
                    </div>

                    {torneio.premiacao && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Trophy className="h-4 w-4 mr-2" />
                        {torneio.premiacao}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <Users className="h-4 w-4 mr-1" />
                        {torneio.grupos?.reduce((total, grupo) => total + (grupo.times?.length || 0), 0) || 0} times
                      </div>
                      <div className="text-muted-foreground">{torneio.partidas?.length || 0} partidas</div>
                    </div>
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
