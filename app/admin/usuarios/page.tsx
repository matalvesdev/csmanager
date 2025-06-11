"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Users, Plus, Search, MoreHorizontal, Edit, Trash2, Shield, UserCheck, UserX } from "lucide-react"
import { formatDate } from "@/lib/format"
import type { Usuario } from "@/types/auth"
import { useToast } from "@/components/ui/use-toast"

// Mock de usuários
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
    ],
    ativo: true,
    ultimoLogin: new Date(Date.now() - 3600000).toISOString(),
    criadoEm: "2023-02-01T00:00:00.000Z",
  },
  {
    id: "3",
    nome: "Maria Organizadora",
    email: "organizadora@cs16tournament.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "organizador",
    permissoes: [
      {
        id: "torneios.visualizar",
        nome: "Visualizar Torneios",
        descricao: "Pode visualizar torneios",
        categoria: "torneios",
      },
      { id: "partidas.agendar", nome: "Agendar Partidas", descricao: "Pode agendar partidas", categoria: "partidas" },
    ],
    ativo: true,
    ultimoLogin: new Date(Date.now() - 7200000).toISOString(),
    criadoEm: "2023-03-01T00:00:00.000Z",
  },
  {
    id: "4",
    nome: "Carlos Usuário",
    email: "usuario@cs16tournament.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "usuario",
    permissoes: [
      {
        id: "torneios.visualizar",
        nome: "Visualizar Torneios",
        descricao: "Pode visualizar torneios",
        categoria: "torneios",
      },
    ],
    ativo: false,
    ultimoLogin: new Date(Date.now() - 86400000).toISOString(),
    criadoEm: "2023-04-01T00:00:00.000Z",
  },
]

export default function UsuariosPage() {
  const { toast } = useToast()
  const [usuarios, setUsuarios] = useState<Usuario[]>(usuariosMock)
  const [filtro, setFiltro] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("todos")
  const [statusFilter, setStatusFilter] = useState<string>("todos")
  const [novoUsuarioOpen, setNovoUsuarioOpen] = useState(false)
  const [editandoUsuario, setEditandoUsuario] = useState<Usuario | null>(null)

  // Filtrar usuários
  const usuariosFiltrados = usuarios.filter((usuario) => {
    const matchNome =
      usuario.nome.toLowerCase().includes(filtro.toLowerCase()) ||
      usuario.email.toLowerCase().includes(filtro.toLowerCase())
    const matchRole = roleFilter === "todos" || usuario.role === roleFilter
    const matchStatus =
      statusFilter === "todos" ||
      (statusFilter === "ativo" && usuario.ativo) ||
      (statusFilter === "inativo" && !usuario.ativo)

    return matchNome && matchRole && matchStatus
  })

  const toggleUsuarioStatus = (id: string) => {
    setUsuarios((prev) => prev.map((usuario) => (usuario.id === id ? { ...usuario, ativo: !usuario.ativo } : usuario)))

    const usuario = usuarios.find((u) => u.id === id)
    toast({
      title: `Usuário ${usuario?.ativo ? "desativado" : "ativado"}`,
      description: `${usuario?.nome} foi ${usuario?.ativo ? "desativado" : "ativado"} com sucesso.`,
    })
  }

  const excluirUsuario = (id: string) => {
    const usuario = usuarios.find((u) => u.id === id)
    setUsuarios((prev) => prev.filter((u) => u.id !== id))

    toast({
      title: "Usuário excluído",
      description: `${usuario?.nome} foi excluído com sucesso.`,
      variant: "destructive",
    })
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      case "moderador":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "organizador":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="h-3 w-3" />
      case "moderador":
        return <UserCheck className="h-3 w-3" />
      default:
        return null
    }
  }

  return (
    <ProtectedRoute adminOnly>
      <div className="container py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gestão de Usuários</h1>
            <p className="text-muted-foreground">Gerencie usuários, permissões e acessos do sistema</p>
          </div>

          <Dialog open={novoUsuarioOpen} onOpenChange={setNovoUsuarioOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Novo Usuário
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Novo Usuário</DialogTitle>
                <DialogDescription>Adicione um novo usuário ao sistema</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome</Label>
                  <Input id="nome" placeholder="Nome completo" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="email@exemplo.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Função</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma função" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usuario">Usuário</SelectItem>
                      <SelectItem value="organizador">Organizador</SelectItem>
                      <SelectItem value="moderador">Moderador</SelectItem>
                      <SelectItem value="admin">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setNovoUsuarioOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => setNovoUsuarioOpen(false)}>Criar Usuário</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usuarios.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usuarios.filter((u) => u.ativo).length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Administradores</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usuarios.filter((u) => u.role === "admin").length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuários Inativos</CardTitle>
              <UserX className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usuarios.filter((u) => !u.ativo).length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nome ou email..."
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>

              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filtrar por função" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas as funções</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="moderador">Moderador</SelectItem>
                  <SelectItem value="organizador">Organizador</SelectItem>
                  <SelectItem value="usuario">Usuário</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os status</SelectItem>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tabela de Usuários */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Usuários</CardTitle>
            <CardDescription>{usuariosFiltrados.length} usuário(s) encontrado(s)</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Função</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Último Login</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usuariosFiltrados.map((usuario) => (
                  <TableRow key={usuario.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={usuario.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{usuario.nome.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{usuario.nome}</div>
                          <div className="text-sm text-muted-foreground">{usuario.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getRoleBadgeColor(usuario.role)}>
                        {getRoleIcon(usuario.role)}
                        <span className="ml-1 capitalize">{usuario.role}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={usuario.ativo ? "default" : "secondary"}>
                        {usuario.ativo ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell>{usuario.ultimoLogin ? formatDate(usuario.ultimoLogin) : "Nunca"}</TableCell>
                    <TableCell>{formatDate(usuario.criadoEm)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setEditandoUsuario(usuario)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleUsuarioStatus(usuario.id)}>
                            {usuario.ativo ? (
                              <>
                                <UserX className="mr-2 h-4 w-4" />
                                Desativar
                              </>
                            ) : (
                              <>
                                <UserCheck className="mr-2 h-4 w-4" />
                                Ativar
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => excluirUsuario(usuario.id)} className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  )
}
