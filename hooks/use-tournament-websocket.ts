"use client"

import { useEffect, useRef } from "react"
import { io, type Socket } from "socket.io-client"
import { useAppStore } from "@/lib/store-real"

export function useTournamentWebSocket() {
  const socketRef = useRef<Socket | null>(null)
  const { fetchTorneios, fetchTorneioById, fetchPartidas } = useAppStore()

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io(process.env.NEXT_PUBLIC_WS_URL || "http://localhost:3000", {
      transports: ["websocket"],
    })

    const socket = socketRef.current

    socket.on("connect", () => {
      console.log("Connected to tournament WebSocket")
      socket.emit("subscribe-tournaments")
    })

    socket.on("tournament-created", (tournament) => {
      console.log("New tournament created:", tournament)
      fetchTorneios()
    })

    socket.on("tournament-updated", (tournament) => {
      console.log("Tournament updated:", tournament)
      fetchTorneioById(tournament.id)
    })

    socket.on("tournament-list-updated", () => {
      console.log("Tournament list updated")
      fetchTorneios()
    })

    socket.on("match-updated", (match) => {
      console.log("Match updated:", match)
      fetchPartidas()
    })

    socket.on("disconnect", () => {
      console.log("Disconnected from tournament WebSocket")
    })

    return () => {
      socket.disconnect()
    }
  }, [fetchTorneios, fetchTorneioById, fetchPartidas])

  const subscribeTo = {
    tournament: (tournamentId: string) => {
      socketRef.current?.emit("subscribe-tournament", tournamentId)
    },
    match: (matchId: string) => {
      socketRef.current?.emit("subscribe-match", matchId)
    },
  }

  return { subscribeTo }
}
