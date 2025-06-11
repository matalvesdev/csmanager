import { NextRequest, NextResponse } from "next/server";

// Mock para envio de comando
export async function POST(req: NextRequest) {
  try {
    const { matchId, serverId, command } = await req.json();
    const token = process.env.MATCHBOT_API_TOKEN;
    const baseUrl =
      process.env.NEXT_PUBLIC_MATCHBOT_WS_URL || "http://localhost:3005";
    const url = `${baseUrl.replace(/\/$/, "")}/api/command`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ matchId, serverId, command }),
    });
    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: `Erro do MatchBot: ${text}` },
        { status: res.status }
      );
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      { error: `MatchBot offline ou erro de rede: ${err.message}` },
      { status: 502 }
    );
  }
}
