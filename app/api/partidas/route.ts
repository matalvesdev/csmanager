import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const partidas = await sql`
      SELECT 
        p.*,
        json_build_object(
          'id', ta.id,
          'nome', ta.nome,
          'logo', ta.logo,
          'jogadores', COALESCE(ta_jogadores.jogadores, '[]'::json)
        ) as time_a,
        json_build_object(
          'id', tb.id,
          'nome', tb.nome,
          'logo', tb.logo,
          'jogadores', COALESCE(tb_jogadores.jogadores, '[]'::json)
        ) as time_b
      FROM partidas p
      LEFT JOIN times ta ON p.time_a_id = ta.id
      LEFT JOIN times tb ON p.time_b_id = tb.id
      LEFT JOIN LATERAL (
        SELECT 
          COALESCE(
            json_agg(
              json_build_object(
                'id', j.id,
                'nome', j.nome,
                'tipo', j.tipo,
                'perfil', j.perfil,
                'avatar', j.avatar
              )
            ) FILTER (WHERE j.id IS NOT NULL),
            '[]'::json
          ) as jogadores
        FROM time_jogadores tj
        LEFT JOIN jogadores j ON tj.jogador_id = j.id
        WHERE tj.time_id = ta.id
      ) ta_jogadores ON true
      LEFT JOIN LATERAL (
        SELECT 
          COALESCE(
            json_agg(
              json_build_object(
                'id', j.id,
                'nome', j.nome,
                'tipo', j.tipo,
                'perfil', j.perfil,
                'avatar', j.avatar
              )
            ) FILTER (WHERE j.id IS NOT NULL),
            '[]'::json
          ) as jogadores
        FROM time_jogadores tj
        LEFT JOIN jogadores j ON tj.jogador_id = j.id
        WHERE tj.time_id = tb.id
      ) tb_jogadores ON true
      ORDER BY p.inicio_previsto ASC
    `

    const formattedPartidas = partidas.map((p) => ({
      id: p.id.toString(),
      timeA: p.time_a,
      timeB: p.time_b,
      mapa: p.mapa,
      fase: p.fase,
      round: p.round_number,
      position: p.position_number,
      inicioPrevisto: p.inicio_previsto,
      status: p.status,
      placar: {
        timeA: p.placar_time_a,
        timeB: p.placar_time_b,
      },
      hltvDemoUrl: p.hltv_demo_url || "",
      logs: p.logs || [],
    }))

    return NextResponse.json(formattedPartidas)
  } catch (error) {
    console.error("Erro ao buscar partidas:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { torneioId, timeAId, timeBId, mapa, inicioPrevisto, fase = "grupos" } = body

    const [partida] = await sql`
      INSERT INTO partidas (torneio_id, time_a_id, time_b_id, mapa, inicio_previsto, fase)
      VALUES (${torneioId}, ${timeAId}, ${timeBId}, ${mapa}, ${inicioPrevisto}, ${fase})
      RETURNING *
    `

    return NextResponse.json(partida, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar partida:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
