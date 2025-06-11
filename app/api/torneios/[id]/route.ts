import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const torneioId = params.id
    const supabase = createServerSupabaseClient()

    // Buscar torneio específico com todos os relacionamentos
    const { data: torneio, error } = await supabase
      .from("torneios")
      .select(`
        *,
        grupos:grupos(
          id,
          nome,
          grupo_times:grupo_times(
            times:time_id(
              id,
              nome,
              logo,
              jogadores:time_jogadores(
                jogador:jogador_id(
                  id,
                  nome,
                  tipo,
                  perfil,
                  avatar
                )
              )
            )
          )
        ),
        partidas:partidas(
          id,
          mapa,
          fase,
          round_number,
          position_number,
          inicio_previsto,
          status,
          placar_time_a,
          placar_time_b,
          hltv_demo_url,
          logs,
          timeA:time_a_id(
            id,
            nome,
            logo
          ),
          timeB:time_b_id(
            id,
            nome,
            logo
          )
        )
      `)
      .eq("id", torneioId)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Torneio não encontrado" }, { status: 404 })
      }
      throw new Error(`Erro ao buscar torneio: ${error.message}`)
    }

    if (!torneio) {
      return NextResponse.json({ error: "Torneio não encontrado" }, { status: 404 })
    }

    // Formatar grupos
    const grupos = torneio.grupos.map((grupo) => {
      const times = grupo.grupo_times.map((gt) => {
        const time = gt.times
        const jogadores = time.jogadores.map((tj) => tj.jogador)
        return {
          ...time,
          jogadores,
        }
      })

      return {
        id: grupo.id,
        nome: grupo.nome,
        times,
      }
    })

    // Formatar partidas
    const partidas = torneio.partidas.map((partida) => {
      return {
        id: partida.id,
        timeA: partida.timeA,
        timeB: partida.timeB,
        mapa: partida.mapa,
        fase: partida.fase,
        round: partida.round_number,
        position: partida.position_number,
        inicioPrevisto: partida.inicio_previsto,
        status: partida.status,
        placar: {
          timeA: partida.placar_time_a || 0,
          timeB: partida.placar_time_b || 0,
        },
        hltvDemoUrl: partida.hltv_demo_url || "",
        logs: partida.logs || [],
      }
    })

    // Formatar torneio para o formato esperado pelo frontend
    const torneioFormatado = {
      id: torneio.id,
      nome: torneio.nome,
      descricao: torneio.descricao || "",
      premiacao: torneio.premiacao || "",
      regulamento: torneio.regulamento || "",
      dataInicio: torneio.data_inicio,
      dataFim: torneio.data_fim,
      status: torneio.status,
      configuracao: torneio.configuracao,
      grupos,
      partidas,
    }

    return NextResponse.json(torneioFormatado)
  } catch (error) {
    console.error("Erro ao buscar torneio:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const torneioId = params.id
    const body = await request.json()
    const { nome, descricao, premiacao, regulamento, dataInicio, dataFim, status, configuracao } = body

    const supabase = createServerSupabaseClient()

    const { data: torneio, error } = await supabase
      .from("torneios")
      .update({
        nome,
        descricao,
        premiacao,
        regulamento,
        data_inicio: dataInicio,
        data_fim: dataFim,
        status,
        configuracao,
      })
      .eq("id", torneioId)
      .select()
      .single()

    if (error) {
      throw new Error(`Erro ao atualizar torneio: ${error.message}`)
    }

    if (!torneio) {
      return NextResponse.json({ error: "Torneio não encontrado" }, { status: 404 })
    }

    return NextResponse.json(torneio)
  } catch (error) {
    console.error("Erro ao atualizar torneio:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const torneioId = params.id
    const supabase = createServerSupabaseClient()

    const { error } = await supabase.from("torneios").delete().eq("id", torneioId)

    if (error) {
      throw new Error(`Erro ao deletar torneio: ${error.message}`)
    }

    return NextResponse.json({ message: "Torneio deletado com sucesso" })
  } catch (error) {
    console.error("Erro ao deletar torneio:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
