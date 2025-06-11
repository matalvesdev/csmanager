import { NextRequest, NextResponse } from "next/server";

// Mock para status da partida
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const matchId = searchParams.get("matchId");
  const serverId = searchParams.get("serverId");
  const token = process.env.MATCHBOT_API_TOKEN;
  const baseUrl =
    process.env.NEXT_PUBLIC_MATCHBOT_WS_URL || "http://localhost:3005";
  try {
    const url = `${baseUrl.replace(
      /\/$/,
      ""
    )}/api/status?matchId=${encodeURIComponent(
      matchId || ""
    )}&serverId=${encodeURIComponent(serverId || "")}`;
    const res = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
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
