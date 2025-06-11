"use client"

import { useEffect } from "react"
import { useAppStore } from "@/lib/store"
import { AgendarPartida } from "@/components/partidas/agendar-partida"

export default function AgendarPartidaPage() {
  const { fetchTorneios } = useAppStore()

  useEffect(() => {
    fetchTorneios()
  }, [fetchTorneios])

  return (
    <div className="container py-6 space-y-6">
      <h1 className="text-3xl font-bold">Agendar Partida</h1>
      <AgendarPartida />
    </div>
  )
}
