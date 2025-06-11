import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const jogadores = await sql`
      SELECT 
        j.*,
        COALESCE(
          json_agg(
            DISTINCT json_build_object(
              'id', t.id,
              'nome', t.nome,
              'logo', t.logo,
              'pais', t.pais
            )
          ) FILTER (WHERE t.id IS NOT NULL),
          '[]'::json
        ) as times
      FROM jogadores j
      LEFT JOIN time_jogadores tj ON j.id = tj.jogador_id
      LEFT JOIN times t ON tj.time_id = t.id
      GROUP BY j.id
      ORDER BY j.nome
    `

    return NextResponse.json(jogadores)
  } catch (error) {
    console.error("Erro ao buscar jogadores:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nome, tipo, perfil, avatar, nacionalidade } = body

    const [jogador] = await sql`
      INSERT INTO jogadores (nome, tipo, perfil, avatar, nacionalidade)
      VALUES (${nome}, ${tipo}, ${perfil}, ${avatar}, ${nacionalidade})
      RETURNING *
    `

    return NextResponse.json(jogador, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar jogador:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
