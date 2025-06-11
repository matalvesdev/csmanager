"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { useAppStore } from "@/lib/store"
import { formatDate, formatStatus } from "@/lib/format"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { EmptyState } from "@/components/ui/empty-state"
import { Trophy, Calendar, Users, Clock, Play } from "lucide-react"
import { motion } from "framer-motion"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export default function Dashboard() {
  const { usuario } = useAuth()
  const {
    torneios = [],
    partidas = [],
    jogadores = [],
    isLoading,
    fetchTorneios,
    fetchPartidas,
    fetchJogadores,
  } = useAppStore()
  const [greeting, setGreeting] = useState("")

  useEffect(() => {
    try {
      fetchTorneios()
      fetchPartidas()
      fetchJogadores()

      // Definir saudação baseada no horário
      const hour = new Date().getHours()
      if (hour < 12) setGreeting("Bom dia")
      else if (hour < 18) setGreeting("Boa tarde")
      else setGreeting("Boa noite")
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
    }
  }, [fetchTorneios, fetchPartidas, fetchJogadores])

  // Garantir que temos arrays mesmo se os dados não estiverem carregados
  const torneiosAtivos = Array.isArray(torneios) ? torneios.filter((t) => t?.status === "em_andamento") : []
  const partidasEmAndamento = Array.isArray(partidas) ? partidas.filter((p) => p?.status === "em_andamento") : []
  const proximasPartidas = Array.isArray(partidas) ? partidas.filter((p) => p?.status === "agendada") : []
  const botCount = Array.isArray(jogadores) ? jogadores.filter((j) => j?.tipo === "bot").length : 0

  const estatisticas = [
    {
      title: "Torneios",
      value: torneios?.length || 0,
      description: `${torneiosAtivos.length} ativos`,
      icon: Trophy,
      color: "text-yellow-500",
      href: "/torneios",
    },
    {
      title: "Partidas",
      value: partidas?.length || 0,
      description: `${partidasEmAndamento.length} em andamento`,
      icon: Calendar,
      color: "text-blue-500",
      href: "/partidas",
    },
    {
      title: "Jogadores",
      value: jogadores?.length || 0,
      description: `${botCount} bots`,
      icon: Users,
      color: "text-green-500",
      href: "/jogadores",
    },
    {
      title: "Taxa de Sucesso",
      value: "98.5%",
      description: "Partidas finalizadas",
      icon: Clock,
      color: "text-purple-500",
      href: "/admin",
    },
  ]

  return (
    <div className="container py-6 space-y-6">
      <Breadcrumb items={[{ label: "Dashboard" }]} />

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              {greeting}, {usuario?.nome || "Usuário"}! 👋
            </h1>
            <p className="text-muted-foreground">Aqui está um resumo das atividades do seu sistema</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
              Sistema Online
            </Badge>
          </div>
        </div>
      </motion.div>

      {/* Cards de Estatísticas */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {estatisticas.map((stat, index) => (
          <motion.div key={stat.title} variants={item}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer group">
              <Link href={stat.href}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <stat.icon className={`h-4 w-4 ${stat.color} group-hover:scale-110 transition-transform`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{isLoading ? <Skeleton className="h-8 w-16" /> : stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </CardContent>
              </Link>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Partidas em Andamento */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Play className="h-5 w-5 text-green-500" />
                    Partidas em Andamento
                  </CardTitle>
                  <CardDescription>Partidas que estão sendo jogadas agora</CardDescription>
                </div>
                <Badge variant="secondary">{partidasEmAndamento.length}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : partidasEmAndamento.length > 0 ? (
                <div className="space-y-4">
                  {partidasEmAndamento.slice(0, 3).map((partida) => (
                    <motion.div
                      key={partida.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-between border p-4 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="font-medium">
                          {partida.timeA?.nome || "Time A"} vs {partida.timeB?.nome || "Time B"}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <span>{partida.mapa || "Mapa não definido"}</span>
                          <span>•</span>
                          <span>{formatDate(partida.inicioPrevisto)}</span>
                        </div>
                        {partida.placar && (
                          <div className="text-sm font-medium mt-1">
                            {partida.placar.timeA} - {partida.placar.timeB}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse" />
                          Ao Vivo
                        </Badge>
                        <Link href={`/partidas/${partida.id}`}>
                          <Button size="sm">Ver</Button>
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={Play}
                  title="Nenhuma partida em andamento"
                  description="Não há partidas sendo jogadas no momento"
                  action={{
                    label: "Agendar Partida",
                    onClick: () => (window.location.href = "/partidas/agendar"),
                  }}
                />
              )}
            </CardContent>
            {partidasEmAndamento.length > 3 && (
              <CardFooter>
                <Link href="/partidas" className="w-full">
                  <Button variant="outline" className="w-full">
                    Ver todas as partidas
                  </Button>
                </Link>
              </CardFooter>
            )}
          </Card>
        </motion.div>

        {/* Torneios Ativos */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    Torneios Ativos
                  </CardTitle>
                  <CardDescription>Torneios que estão em andamento</CardDescription>
                </div>
                <Badge variant="secondary">{torneiosAtivos.length}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : torneiosAtivos.length > 0 ? (
                <div className="space-y-4">
                  {torneiosAtivos.slice(0, 3).map((torneio) => (
                    <motion.div
                      key={torneio.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-between border p-4 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="font-medium">{torneio.nome || "Torneio sem nome"}</div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(torneio.dataInicio)} - {formatDate(torneio.dataFim)}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {torneio.partidas?.length || 0} partidas • {torneio.grupos?.length || 0} grupos
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                          {formatStatus(torneio.status)}
                        </Badge>
                        <Link href={`/torneios/${torneio.id}`}>
                          <Button size="sm">Gerenciar</Button>
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={Trophy}
                  title="Nenhum torneio ativo"
                  description="Não há torneios em andamento no momento"
                  action={{
                    label: "Criar Torneio",
                    onClick: () => (window.location.href = "/torneios/novo"),
                  }}
                />
              )}
            </CardContent>
            {torneiosAtivos.length > 3 && (
              <CardFooter>
                <Link href="/torneios" className="w-full">
                  <Button variant="outline" className="w-full">
                    Ver todos os torneios
                  </Button>
                </Link>
              </CardFooter>
            )}
          </Card>
        </motion.div>
      </div>

      {/* Próximas Partidas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-500" />
                  Próximas Partidas
                </CardTitle>
                <CardDescription>Partidas agendadas para acontecer em breve</CardDescription>
              </div>
              <Badge variant="secondary">{proximasPartidas.length}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : proximasPartidas.length > 0 ? (
              <div className="space-y-4">
                {proximasPartidas.slice(0, 5).map((partida, index) => (
                  <motion.div
                    key={partida.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between border p-4 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="font-medium">
                        {partida.timeA?.nome || "Time A"} vs {partida.timeB?.nome || "Time B"}
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <span>{partida.mapa || "Mapa não definido"}</span>
                        <span>•</span>
                        <span>{formatDate(partida.inicioPrevisto)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                        Agendada
                      </Badge>
                      <Link href={`/partidas/${partida.id}`}>
                        <Button size="sm" variant="outline">
                          Ver
                        </Button>
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Clock}
                title="Nenhuma partida agendada"
                description="Não há partidas agendadas para os próximos dias"
                action={{
                  label: "Agendar Partida",
                  onClick: () => (window.location.href = "/partidas/agendar"),
                }}
              />
            )}
          </CardContent>
          {proximasPartidas.length > 5 && (
            <CardFooter>
              <Link href="/partidas" className="w-full">
                <Button variant="outline" className="w-full">
                  Ver todas as partidas agendadas
                </Button>
              </Link>
            </CardFooter>
          )}
        </Card>
      </motion.div>
    </div>
  )
}
