import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const templates = await sql`
      SELECT * FROM templates_torneio
      ORDER BY created_at DESC
    `

    return NextResponse.json(templates)
  } catch (error) {
    console.error("Erro ao buscar templates:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nome, descricao, configuracao } = body

    const [template] = await sql`
      INSERT INTO templates_torneio (nome, descricao, configuracao)
      VALUES (${nome}, ${descricao}, ${JSON.stringify(configuracao)})
      RETURNING *
    `

    return NextResponse.json(template, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar template:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
