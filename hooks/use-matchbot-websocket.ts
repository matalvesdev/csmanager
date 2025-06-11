import { useEffect, useRef } from "react";
import { io, type Socket } from "socket.io-client";

export function useMatchBotWebSocket({
  matchId,
  serverId,
  onStatus,
  onEvents,
  onPlayers,
}: {
  matchId?: string;
  serverId?: string;
  onStatus?: (status: any) => void;
  onEvents?: (events: any[]) => void;
  onPlayers?: (players: any[]) => void;
}) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!matchId && !serverId) return;
    socketRef.current = io(
      process.env.NEXT_PUBLIC_MATCHBOT_WS_URL || "http://localhost:4000",
      {
        transports: ["websocket"],
      }
    );
    const socket = socketRef.current;
    socket.emit("subscribe-match", { matchId, serverId });
    socket.on("match-status", (status) => onStatus?.(status));
    socket.on("match-events", (events) => onEvents?.(events));
    socket.on("match-players", (players) => onPlayers?.(players));
    return () => {
      socket.disconnect();
    };
  }, [matchId, serverId]);
}
