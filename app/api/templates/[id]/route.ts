import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const templateId = Number.parseInt(params.id)

    const [template] = await sql`
      SELECT * FROM templates_torneio
      WHERE id = ${templateId}
    `

    if (!template) {
      return NextResponse.json({ error: "Template não encontrado" }, { status: 404 })
    }

    return NextResponse.json(template)
  } catch (error) {
    console.error("Erro ao buscar template:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const templateId = Number.parseInt(params.id)
    const body = await request.json()
    const { nome, descricao, configuracao } = body

    const [template] = await sql`
      UPDATE templates_torneio 
      SET 
        nome = ${nome},
        descricao = ${descricao},
        configuracao = ${JSON.stringify(configuracao)},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${templateId}
      RETURNING *
    `

    if (!template) {
      return NextResponse.json({ error: "Template não encontrado" }, { status: 404 })
    }

    return NextResponse.json(template)
  } catch (error) {
    console.error("Erro ao atualizar template:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const templateId = Number.parseInt(params.id)

    const [template] = await sql`
      DELETE FROM templates_torneio 
      WHERE id = ${templateId}
      RETURNING *
    `

    if (!template) {
      return NextResponse.json({ error: "Template não encontrado" }, { status: 404 })
    }

    return NextResponse.json({ message: "Template deletado com sucesso" })
  } catch (error) {
    console.error("Erro ao deletar template:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
