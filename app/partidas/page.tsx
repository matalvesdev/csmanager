"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useAppStore } from "@/lib/store"
import { formatDate, formatStatus } from "@/lib/format"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar } from "lucide-react"

export default function PartidasPage() {
  const { partidas, isLoading, fetchPartidas } = useAppStore()

  useEffect(() => {
    fetchPartidas()
  }, [fetchPartidas])

  const partidasEmAndamento = partidas.filter((p) => p.status === "em_andamento")
  const partidasAgendadas = partidas.filter((p) => p.status === "agendada")
  const partidasFinalizadas = partidas.filter((p) => p.status === "finalizada")

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Partidas</h1>
        <Button>
          <Calendar className="mr-2 h-4 w-4" />
          Agendar Partida
        </Button>
      </div>

      <Tabs defaultValue="todas">
        <TabsList>
          <TabsTrigger value="todas">Todas</TabsTrigger>
          <TabsTrigger value="em_andamento">Em Andamento</TabsTrigger>
          <TabsTrigger value="agendadas">Agendadas</TabsTrigger>
          <TabsTrigger value="finalizadas">Finalizadas</TabsTrigger>
        </TabsList>

        <TabsContent value="todas" className="space-y-4 pt-4">
          {renderPartidasTable(partidas, isLoading)}
        </TabsContent>

        <TabsContent value="em_andamento" className="space-y-4 pt-4">
          {renderPartidasTable(partidasEmAndamento, isLoading)}
        </TabsContent>

        <TabsContent value="agendadas" className="space-y-4 pt-4">
          {renderPartidasTable(partidasAgendadas, isLoading)}
        </TabsContent>

        <TabsContent value="finalizadas" className="space-y-4 pt-4">
          {renderPartidasTable(partidasFinalizadas, isLoading)}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function renderPartidasTable(partidas: any[], isLoading: boolean) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (partidas.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground">Nenhuma partida encontrada</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Partidas</CardTitle>
        <CardDescription>{partidas.length} partidas encontradas</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Times</TableHead>
              <TableHead>Mapa</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Placar</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {partidas.map((partida) => (
              <TableRow key={partida.id}>
                <TableCell className="font-medium">
                  {partida.timeA.nome} vs {partida.timeB.nome}
                </TableCell>
                <TableCell>{partida.mapa || "N/A"}</TableCell>
                <TableCell>{formatDate(partida.inicioPrevisto)}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`
                      ${
                        partida.status === "em_andamento"
                          ? "bg-green-500/10 text-green-500 border-green-500/20"
                          : partida.status === "finalizada"
                            ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                            : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                      }
                    `}
                  >
                    {formatStatus(partida.status)}
                  </Badge>
                </TableCell>
                <TableCell>{partida.placar ? `${partida.placar.timeA} - ${partida.placar.timeB}` : "N/A"}</TableCell>
                <TableCell className="text-right">
                  <Link href={`/partidas/${partida.id}`}>
                    <Button size="sm">Ver</Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
