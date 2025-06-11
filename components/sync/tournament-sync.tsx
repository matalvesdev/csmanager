"use client"

import { useEffect } from "react"
import { useAppStore } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"

export function TournamentSync() {
  const { fetchTorneios, fetchPartidas, fetchJogadores, fetchTemplates, error, clearError } = useAppStore()
  const { toast } = useToast()

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await Promise.all([fetchTorneios(), fetchPartidas(), fetchJogadores(), fetchTemplates()])
      } catch (error) {
        console.error("Erro ao carregar dados iniciais:", error)
      }
    }

    loadInitialData()
  }, [fetchTorneios, fetchPartidas, fetchJogadores, fetchTemplates])

  useEffect(() => {
    if (error) {
      toast({
        title: "Erro",
        description: error,
        variant: "destructive",
      })
      clearError()
    }
  }, [error, toast, clearError])

  return null
}
