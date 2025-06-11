import { Server as SocketIOServer } from "socket.io"
import type { Server as HTTPServer } from "http"

export function initializeTournamentWebSocket(server: HTTPServer) {
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.NODE_ENV === "production" ? false : ["http://localhost:3000"],
      methods: ["GET", "POST"],
    },
  })

  io.on("connection", (socket) => {
    console.log("Client connected to tournaments:", socket.id)

    // Subscribe to tournament updates
    socket.on("subscribe-tournament", (tournamentId: string) => {
      socket.join(`tournament-${tournamentId}`)
      console.log(`Client subscribed to tournament ${tournamentId}`)
    })

    // Subscribe to match updates
    socket.on("subscribe-match", (matchId: string) => {
      socket.join(`match-${matchId}`)
      console.log(`Client subscribed to match ${matchId}`)
    })

    // Subscribe to all tournaments
    socket.on("subscribe-tournaments", () => {
      socket.join("tournaments")
      console.log("Client subscribed to all tournaments")
    })

    socket.on("disconnect", () => {
      console.log("Client disconnected from tournaments:", socket.id)
    })
  })

  // Broadcast tournament updates
  const broadcastTournamentUpdate = (tournamentId: string, data: any) => {
    io.to(`tournament-${tournamentId}`).emit("tournament-updated", data)
    io.to("tournaments").emit("tournament-list-updated")
  }

  // Broadcast match updates
  const broadcastMatchUpdate = (matchId: string, data: any) => {
    io.to(`match-${matchId}`).emit("match-updated", data)
  }

  // Broadcast new tournament
  const broadcastNewTournament = (tournament: any) => {
    io.to("tournaments").emit("tournament-created", tournament)
  }

  return {
    io,
    broadcastTournamentUpdate,
    broadcastMatchUpdate,
    broadcastNewTournament,
  }
}
