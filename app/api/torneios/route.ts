import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const torneios = await sql`
      SELECT 
        t.*,
        COALESCE(
          json_agg(
            DISTINCT json_build_object(
              'id', g.id,
              'nome', g.nome,
              'times', COALESCE(grupo_times.times, '[]'::json)
            )
          ) FILTER (WHERE g.id IS NOT NULL), 
          '[]'::json
        ) as grupos,
        COALESCE(
          json_agg(
            DISTINCT json_build_object(
              'id', p.id,
              'timeA', json_build_object('id', ta.id, 'nome', ta.nome, 'logo', ta.logo, 'pais', ta.pais),
              'timeB', json_build_object('id', tb.id, 'nome', tb.nome, 'logo', tb.logo, 'pais', tb.pais),
              'mapa', p.mapa,
              'fase', p.fase,
              'round', p.round_number,
              'position', p.position_number,
              'inicioPrevisto', p.inicio_previsto,
              'status', p.status,
              'placar', json_build_object('timeA', p.placar_time_a, 'timeB', p.placar_time_b),
              'hltvDemoUrl', p.hltv_demo_url,
              'logs', p.logs
            )
          ) FILTER (WHERE p.id IS NOT NULL),
          '[]'::json
        ) as partidas
      FROM torneios t
      LEFT JOIN grupos g ON t.id = g.torneio_id
      LEFT JOIN LATERAL (
        SELECT 
          COALESCE(
            json_agg(
              json_build_object(
                'id', tm.id,
                'nome', tm.nome,
                'logo', tm.logo,
                'pais', tm.pais,
                'jogadores', COALESCE(time_jogadores.jogadores, '[]'::json)
              )
            ) FILTER (WHERE tm.id IS NOT NULL),
            '[]'::json
          ) as times
        FROM grupo_times gt
        LEFT JOIN times tm ON gt.time_id = tm.id
        LEFT JOIN LATERAL (
          SELECT 
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
          FROM time_jogadores tj
          LEFT JOIN jogadores j ON tj.jogador_id = j.id
          WHERE tj.time_id = tm.id
        ) time_jogadores ON true
        WHERE gt.grupo_id = g.id
      ) grupo_times ON true
      LEFT JOIN partidas p ON t.id = p.torneio_id
      LEFT JOIN times ta ON p.time_a_id = ta.id
      LEFT JOIN times tb ON p.time_b_id = tb.id
      GROUP BY t.id
      ORDER BY t.created_at DESC
    `

    return NextResponse.json(torneios)
  } catch (error) {
    console.error("Erro ao buscar torneios:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nome, descricao, premiacao, regulamento, dataInicio, dataFim, configuracao } = body

    const [torneio] = await sql`
      INSERT INTO torneios (nome, descricao, premiacao, regulamento, data_inicio, data_fim, configuracao)
      VALUES (${nome}, ${descricao}, ${premiacao}, ${regulamento}, ${dataInicio}, ${dataFim}, ${JSON.stringify(configuracao)})
      RETURNING *
    `

    return NextResponse.json(torneio, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar torneio:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
