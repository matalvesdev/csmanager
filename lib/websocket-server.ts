import { Server as SocketIOServer } from "socket.io"
import type { Server as HTTPServer } from "http"
import Docker from "dockerode"

const docker = new Docker({ socketPath: "/var/run/docker.sock" })

export function initializeWebSocket(server: HTTPServer) {
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.NODE_ENV === "production" ? false : ["http://localhost:3000"],
      methods: ["GET", "POST"],
    },
  })

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id)

    // Send initial data
    socket.emit("connected", { message: "Connected to infrastructure monitoring" })

    // Subscribe to container events
    socket.on("subscribe-containers", () => {
      console.log("Client subscribed to container updates")
      socket.join("containers")
    })

    // Subscribe to system metrics
    socket.on("subscribe-metrics", () => {
      console.log("Client subscribed to system metrics")
      socket.join("metrics")
    })

    // Subscribe to server status
    socket.on("subscribe-servers", () => {
      console.log("Client subscribed to server status")
      socket.join("servers")
    })

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id)
    })
  })

  // Monitor Docker events
  docker.getEvents({}, (err, stream) => {
    if (err) {
      console.error("Error monitoring Docker events:", err)
      return
    }

    if (stream) {
      stream.on("data", (chunk) => {
        try {
          const event = JSON.parse(chunk.toString())

          if (event.Type === "container") {
            io.to("containers").emit("container-event", {
              action: event.Action,
              containerId: event.Actor.ID,
              containerName: event.Actor.Attributes.name,
              timestamp: new Date(event.time * 1000).toISOString(),
            })
          }
        } catch (error) {
          console.error("Error parsing Docker event:", error)
        }
      })
    }
  })

  // Send periodic system metrics
  setInterval(async () => {
    try {
      const response = await fetch("http://localhost:3000/api/system/metrics")
      const metrics = await response.json()
      io.to("metrics").emit("metrics-update", metrics)
    } catch (error) {
      console.error("Error fetching metrics for WebSocket:", error)
    }
  }, 30000) // Every 30 seconds

  return io
}
