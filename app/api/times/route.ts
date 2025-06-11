import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const times = await sql`
      SELECT 
        t.*,
        COALESCE(
          json_agg(
            json_build_object(
              'id', j.id,
              'nome', j.nome,
              'tipo', j.tipo,
              'perfil', j.perfil,
              'avatar', j.avatar,
              'nacionalidade', j.nacionalidade
            )
          ) FILTER (WHERE j.id IS NOT NULL),
          '[]'::json
        ) as jogadores
      FROM times t
      LEFT JOIN time_jogadores tj ON t.id = tj.time_id
      LEFT JOIN jogadores j ON tj.jogador_id = j.id
      GROUP BY t.id
      ORDER BY t.nome
    `

    return NextResponse.json(times)
  } catch (error) {
    console.error("Erro ao buscar times:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nome, logo, pais, jogadores } = body

    // Iniciar transação
    const [time] = await sql`
      INSERT INTO times (nome, logo, pais)
      VALUES (${nome}, ${logo}, ${pais})
      RETURNING *
    `

    // Associar jogadores ao time se fornecidos
    if (jogadores && jogadores.length > 0) {
      for (const jogadorId of jogadores) {
        await sql`
          INSERT INTO time_jogadores (time_id, jogador_id)
          VALUES (${time.id}, ${jogadorId})
        `
      }
    }

    return NextResponse.json(time, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar time:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
