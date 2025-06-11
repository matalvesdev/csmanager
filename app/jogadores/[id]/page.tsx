"use client"

import { useEffect } from "react"
import { useParams } from "next/navigation"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EstatisticasJogador } from "@/components/estatisticas/estatisticas-jogador"

export default function JogadorDetailPage() {
  const params = useParams()
  const id = params.id as string
  const { jogadores, fetchJogadores, isLoading } = useAppStore()

  useEffect(() => {
    fetchJogadores()
  }, [fetchJogadores])

  const jogador = jogadores.find((j) => j.id === id)

  if (isLoading) {
    return (
      <div className="container py-6 space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!jogador) {
    return (
      <div className="container py-6 space-y-6">
        <h1 className="text-3xl font-bold">Jogador não encontrado</h1>
        <p>O jogador que você está procurando não existe ou foi removido.</p>
        <Button onClick={() => window.history.back()}>Voltar</Button>
      </div>
    )
  }

  return (
    <div className="container py-6 space-y-6">
      <h1 className="text-3xl font-bold">Perfil do Jogador</h1>

      <Tabs defaultValue="estatisticas">
        <TabsList>
          <TabsTrigger value="estatisticas">Estatísticas</TabsTrigger>
          <TabsTrigger value="partidas">Partidas</TabsTrigger>
          <TabsTrigger value="historico">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="estatisticas" className="space-y-6 pt-4">
          <EstatisticasJogador jogador={jogador} />
        </TabsContent>

        <TabsContent value="partidas" className="space-y-6 pt-4">
          <div className="text-center py-12 text-muted-foreground">Histórico de partidas em breve</div>
        </TabsContent>

        <TabsContent value="historico" className="space-y-6 pt-4">
          <div className="text-center py-12 text-muted-foreground">Histórico detalhado em breve</div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
