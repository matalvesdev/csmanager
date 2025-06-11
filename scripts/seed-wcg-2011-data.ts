import { createClient } from "@supabase/supabase-js"

// Configuração do cliente Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error("Variáveis de ambiente do Supabase não configuradas")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Dados do WCG 2011
const wcgTeams = [
  {
    nome: "SK Gaming",
    pais: "Suécia",
    logo: "/images/teams/sk-gaming.png",
    jogadores: [
      { nome: "GeT_RiGhT", perfil: "Lurker", nacionalidade: "Suécia" },
      { nome: "f0rest", perfil: "Entry", nacionalidade: "Suécia" },
      { nome: "Delpan", perfil: "AWPer", nacionalidade: "Suécia" },
      { nome: "Xizt", perfil: "IGL", nacionalidade: "Suécia" },
      { nome: "RobbaN", perfil: "Support", nacionalidade: "Suécia" },
    ],
  },
  {
    nome: "Natus Vincere",
    pais: "Ucrânia",
    logo: "/images/teams/navi.png",
    jogadores: [
      { nome: "markeloff", perfil: "AWPer", nacionalidade: "Ucrânia" },
      { nome: "Edward", perfil: "Entry", nacionalidade: "Ucrânia" },
      { nome: "Zeus", perfil: "IGL", nacionalidade: "Ucrânia" },
      { nome: "starix", perfil: "Support", nacionalidade: "Ucrânia" },
      { nome: "ceh9", perfil: "Lurker", nacionalidade: "Ucrânia" },
    ],
  },
  {
    nome: "Fnatic",
    pais: "Suécia",
    logo: "/images/teams/fnatic.png",
    jogadores: [
      { nome: "Gux", perfil: "Entry", nacionalidade: "Suécia" },
      { nome: "cArn", perfil: "IGL", nacionalidade: "Suécia" },
      { nome: "Xizt", perfil: "Support", nacionalidade: "Suécia" },
      { nome: "DSN", perfil: "AWPer", nacionalidade: "Suécia" },
      { nome: "THREAT", perfil: "Lurker", nacionalidade: "Suécia" },
    ],
  },
  {
    nome: "mTw",
    pais: "Dinamarca",
    logo: "/images/teams/mtw.png",
    jogadores: [
      { nome: "zonic", perfil: "Entry", nacionalidade: "Dinamarca" },
      { nome: "ave", perfil: "IGL", nacionalidade: "Dinamarca" },
      { nome: "Sunde", perfil: "Support", nacionalidade: "Dinamarca" },
      { nome: "minet", perfil: "AWPer", nacionalidade: "Dinamarca" },
      { nome: "trace", perfil: "Lurker", nacionalidade: "Dinamarca" },
    ],
  },
  {
    nome: "ESC Gaming",
    pais: "Polônia",
    logo: "/images/teams/esc-gaming.png",
    jogadores: [
      { nome: "NEO", perfil: "Entry", nacionalidade: "Polônia" },
      { nome: "TaZ", perfil: "IGL", nacionalidade: "Polônia" },
      { nome: "pasha", perfil: "AWPer", nacionalidade: "Polônia" },
      { nome: "kuben", perfil: "Support", nacionalidade: "Polônia" },
      { nome: "loord", perfil: "Lurker", nacionalidade: "Polônia" },
    ],
  },
  {
    nome: "Frag eXecutors",
    pais: "Polônia",
    logo: "/images/teams/frag-executors.png",
    jogadores: [
      { nome: "Hyper", perfil: "Entry", nacionalidade: "Polônia" },
      { nome: "GruBy", perfil: "IGL", nacionalidade: "Polônia" },
      { nome: "reatz", perfil: "AWPer", nacionalidade: "Polônia" },
      { nome: "SZPERO", perfil: "Support", nacionalidade: "Polônia" },
      { nome: "mouz", perfil: "Lurker", nacionalidade: "Polônia" },
    ],
  },
  {
    nome: "mousesports",
    pais: "Alemanha",
    logo: "/images/teams/mousesports.png",
    jogadores: [
      { nome: "gob b", perfil: "IGL", nacionalidade: "Alemanha" },
      { nome: "cyx", perfil: "Entry", nacionalidade: "Alemanha" },
      { nome: "tiziaN", perfil: "Support", nacionalidade: "Alemanha" },
      { nome: "kapio", perfil: "AWPer", nacionalidade: "Alemanha" },
      { nome: "gore", perfil: "Lurker", nacionalidade: "Alemanha" },
    ],
  },
  {
    nome: "WinFakt",
    pais: "Alemanha",
    logo: "/images/teams/winfakt.png",
    jogadores: [
      { nome: "Tixo", perfil: "Entry", nacionalidade: "Alemanha" },
      { nome: "approx", perfil: "IGL", nacionalidade: "Alemanha" },
      { nome: "stavros", perfil: "AWPer", nacionalidade: "Alemanha" },
      { nome: "enkay J", perfil: "Support", nacionalidade: "Alemanha" },
      { nome: "Blizzard", perfil: "Lurker", nacionalidade: "Alemanha" },
    ],
  },
  {
    nome: "Lions",
    pais: "França",
    logo: "/images/teams/lions.png",
    jogadores: [
      { nome: "shox", perfil: "Entry", nacionalidade: "França" },
      { nome: "Ex6TenZ", perfil: "IGL", nacionalidade: "Bélgica" },
      { nome: "SmithZz", perfil: "AWPer", nacionalidade: "França" },
      { nome: "RpK", perfil: "Support", nacionalidade: "França" },
      { nome: "ScreaM", perfil: "Lurker", nacionalidade: "Bélgica" },
    ],
  },
  {
    nome: "Team ALTERNATE",
    pais: "Alemanha",
    logo: "/images/teams/alternate.png",
    jogadores: [
      { nome: "LEGIJA", perfil: "Entry", nacionalidade: "Alemanha" },
      { nome: "kzy", perfil: "IGL", nacionalidade: "Alemanha" },
      { nome: "asmo", perfil: "AWPer", nacionalidade: "Alemanha" },
      { nome: "fel1x", perfil: "Support", nacionalidade: "Alemanha" },
      { nome: "syrsoN", perfil: "Lurker", nacionalidade: "Alemanha" },
    ],
  },
  {
    nome: "compLexity",
    pais: "Estados Unidos",
    logo: "/images/teams/complexity.png",
    jogadores: [
      { nome: "fRoD", perfil: "AWPer", nacionalidade: "Estados Unidos" },
      { nome: "Storm", perfil: "IGL", nacionalidade: "Estados Unidos" },
      { nome: "Warden", perfil: "Support", nacionalidade: "Estados Unidos" },
      { nome: "Hanes", perfil: "Entry", nacionalidade: "Estados Unidos" },
      { nome: "Sunman", perfil: "Lurker", nacionalidade: "Estados Unidos" },
    ],
  },
  {
    nome: "Evil Geniuses",
    pais: "Estados Unidos",
    logo: "/images/teams/evil-geniuses.png",
    jogadores: [
      { nome: "n0thing", perfil: "Entry", nacionalidade: "Estados Unidos" },
      { nome: "DaZeD", perfil: "IGL", nacionalidade: "Estados Unidos" },
      { nome: "Irukandji", perfil: "AWPer", nacionalidade: "Estados Unidos" },
      { nome: "lurppis", perfil: "Support", nacionalidade: "Finlândia" },
      { nome: "Swag", perfil: "Lurker", nacionalidade: "Estados Unidos" },
    ],
  },
  {
    nome: "Team 3D",
    pais: "Estados Unidos",
    logo: "/images/teams/team-3d.png",
    jogadores: [
      { nome: "ksharp", perfil: "AWPer", nacionalidade: "Estados Unidos" },
      { nome: "rambo", perfil: "IGL", nacionalidade: "Estados Unidos" },
      { nome: "method", perfil: "Entry", nacionalidade: "Estados Unidos" },
      { nome: "volcano", perfil: "Support", nacionalidade: "Estados Unidos" },
      { nome: "steel", perfil: "Lurker", nacionalidade: "Estados Unidos" },
    ],
  },
  {
    nome: "WeMade FOX",
    pais: "Coreia do Sul",
    logo: "/images/teams/wemade-fox.png",
    jogadores: [
      { nome: "solo", perfil: "IGL", nacionalidade: "Coreia do Sul" },
      { nome: "bail", perfil: "Entry", nacionalidade: "Coreia do Sul" },
      { nome: "glow", perfil: "AWPer", nacionalidade: "Coreia do Sul" },
      { nome: "termi", perfil: "Support", nacionalidade: "Coreia do Sul" },
      { nome: "peri", perfil: "Lurker", nacionalidade: "Coreia do Sul" },
    ],
  },
  {
    nome: "TyLoo",
    pais: "China",
    logo: "/images/teams/tyloo.png",
    jogadores: [
      { nome: "KingZ", perfil: "Entry", nacionalidade: "China" },
      { nome: "Karsa", perfil: "IGL", nacionalidade: "China" },
      { nome: "Reaction", perfil: "AWPer", nacionalidade: "China" },
      { nome: "Savage", perfil: "Support", nacionalidade: "China" },
      { nome: "Jungle", perfil: "Lurker", nacionalidade: "China" },
    ],
  },
  {
    nome: "Immunity",
    pais: "Austrália",
    logo: "/images/teams/immunity.png",
    jogadores: [
      { nome: "USTILO", perfil: "Entry", nacionalidade: "Austrália" },
      { nome: "James", perfil: "IGL", nacionalidade: "Austrália" },
      { nome: "Rickeh", perfil: "AWPer", nacionalidade: "Austrália" },
      { nome: "SnypeR", perfil: "Support", nacionalidade: "Austrália" },
      { nome: "emagine", perfil: "Lurker", nacionalidade: "Austrália" },
    ],
  },
  {
    nome: "Vox Eminor",
    pais: "Austrália",
    logo: "/images/teams/vox-eminor.png",
    jogadores: [
      { nome: "Havoc", perfil: "IGL", nacionalidade: "Austrália" },
      { nome: "AZR", perfil: "Entry", nacionalidade: "Austrália" },
      { nome: "jks", perfil: "Lurker", nacionalidade: "Austrália" },
      { nome: "SPUNJ", perfil: "AWPer", nacionalidade: "Austrália" },
      { nome: "topguN", perfil: "Support", nacionalidade: "Austrália" },
    ],
  },
  {
    nome: "Made in Brazil",
    pais: "Brasil",
    logo: "/images/teams/mibr.png",
    jogadores: [
      { nome: "cogu", perfil: "AWPer", nacionalidade: "Brasil" },
      { nome: "fnx", perfil: "Entry", nacionalidade: "Brasil" },
      { nome: "nak", perfil: "IGL", nacionalidade: "Brasil" },
      { nome: "bit", perfil: "Support", nacionalidade: "Brasil" },
      { nome: "prax", perfil: "Lurker", nacionalidade: "Brasil" },
    ],
  },
  {
    nome: "Keyd Stars",
    pais: "Brasil",
    logo: "/images/teams/keyd-stars.png",
    jogadores: [
      { nome: "FalleN", perfil: "AWPer", nacionalidade: "Brasil" },
      { nome: "fer", perfil: "Entry", nacionalidade: "Brasil" },
      { nome: "zqk", perfil: "Support", nacionalidade: "Brasil" },
      { nome: "steel", perfil: "IGL", nacionalidade: "Brasil" },
      { nome: "boltz", perfil: "Lurker", nacionalidade: "Brasil" },
    ],
  },
  {
    nome: "Virtus.pro",
    pais: "Rússia",
    logo: "/images/teams/virtus-pro.png",
    jogadores: [
      { nome: "Edward", perfil: "Entry", nacionalidade: "Ucrânia" },
      { nome: "Dosia", perfil: "Lurker", nacionalidade: "Rússia" },
      { nome: "kucher", perfil: "IGL", nacionalidade: "Ucrânia" },
      { nome: "ANGE1", perfil: "Support", nacionalidade: "Ucrânia" },
      { nome: "AdreN", perfil: "AWPer", nacionalidade: "Cazaquistão" },
    ],
  },
  {
    nome: "Moscow Five",
    pais: "Rússia",
    logo: "/images/teams/moscow-five.png",
    jogadores: [
      { nome: "hooch", perfil: "IGL", nacionalidade: "Rússia" },
      { nome: "Dosia", perfil: "Entry", nacionalidade: "Rússia" },
      { nome: "Fox", perfil: "AWPer", nacionalidade: "Rússia" },
      { nome: "ROMJkE", perfil: "Support", nacionalidade: "Rússia" },
      { nome: "xek", perfil: "Lurker", nacionalidade: "Rússia" },
    ],
  },
  {
    nome: "Anexis",
    pais: "Dinamarca",
    logo: "/images/teams/anexis.png",
    jogadores: [
      { nome: "cajunb", perfil: "AWPer", nacionalidade: "Dinamarca" },
      { nome: "karrigan", perfil: "IGL", nacionalidade: "Dinamarca" },
      { nome: "Friis", perfil: "Entry", nacionalidade: "Dinamarca" },
      { nome: "LOMME", perfil: "Support", nacionalidade: "Dinamarca" },
      { nome: "Xyp9x", perfil: "Lurker", nacionalidade: "Dinamarca" },
    ],
  },
  {
    nome: "Lemondogs",
    pais: "Suécia",
    logo: "/images/teams/lemondogs.png",
    jogadores: [
      { nome: "twist", perfil: "AWPer", nacionalidade: "Suécia" },
      { nome: "znajder", perfil: "Entry", nacionalidade: "Suécia" },
      { nome: "MODDII", perfil: "IGL", nacionalidade: "Suécia" },
      { nome: "Jumpy", perfil: "Support", nacionalidade: "Suécia" },
      { nome: "KAB0M", perfil: "Lurker", nacionalidade: "Suécia" },
    ],
  },
  {
    nome: "Astana Dragons",
    pais: "Cazaquistão",
    logo: "/images/teams/astana-dragons.png",
    jogadores: [
      { nome: "AdreN", perfil: "Entry", nacionalidade: "Cazaquistão" },
      { nome: "ANGE1", perfil: "IGL", nacionalidade: "Ucrânia" },
      { nome: "Dosia", perfil: "Lurker", nacionalidade: "Rússia" },
      { nome: "markeloff", perfil: "AWPer", nacionalidade: "Ucrânia" },
      { nome: "kucher", perfil: "Support", nacionalidade: "Ucrânia" },
    ],
  },
  {
    nome: "LGB eSports",
    pais: "Suécia",
    logo: "/images/teams/lgb-esports.png",
    jogadores: [
      { nome: "dennis", perfil: "Entry", nacionalidade: "Suécia" },
      { nome: "olofmeister", perfil: "AWPer", nacionalidade: "Suécia" },
      { nome: "KRiMZ", perfil: "Support", nacionalidade: "Suécia" },
      { nome: "cype", perfil: "IGL", nacionalidade: "Suécia" },
      { nome: "twist", perfil: "Lurker", nacionalidade: "Suécia" },
    ],
  },
]

// Template de configuração do WCG 2011
const wcgTemplate = {
  nome: "World Cyber Games 2011",
  descricao: "Template oficial do World Cyber Games 2011 para Counter-Strike 1.6",
  configuracao: {
    modoPartida: "MR15",
    tempoRound: 105,
    tempoBomba: 35,
    tempoFreeze: 15,
    maxRounds: 30,
    overtime: true,
    overtimeRounds: 6,
    friendlyFire: true,
    autoKick: false,
    forceCamera: true,
    ghostFreq: false,
    hltv: {
      habilitado: true,
      ip: "127.0.0.1",
      porta: 27020,
      senha: "wcg2011",
      delay: 90,
    },
    servidor: {
      tickrate: 100,
      fps_max: 300,
      sv_maxrate: 25000,
      sv_minrate: 5000,
      sv_maxupdaterate: 101,
      sv_minupdaterate: 10,
      sv_maxcmdrate: 101,
      sv_mincmdrate: 10,
    },
    mapas: ["de_dust2", "de_inferno", "de_nuke", "de_train", "de_tuscan"],
    formatoMapas: "bo3",
    banPick: true,
    pausas: {
      habilitadas: true,
      maxPausasPorTime: 3,
      tempoPausa: 180,
    },
    substitutos: {
      habilitados: true,
      maxSubstitutos: 1,
    },
  },
}

// Torneio WCG 2011
const wcgTorneio = {
  nome: "World Cyber Games 2011",
  descricao: "Campeonato mundial de Counter-Strike 1.6 realizado em Busan, Coreia do Sul",
  premiacao: "US$ 50.000 (1º: $25.000, 2º: $15.000, 3º: $10.000)",
  regulamento: "Regras oficiais do WCG 2011",
  data_inicio: "2011-12-08T00:00:00Z",
  data_fim: "2011-12-11T23:59:59Z",
  status: "finalizado",
  configuracao: wcgTemplate.configuracao,
}

// Grupos do WCG 2011
const wcgGrupos = [
  { nome: "Grupo A" },
  { nome: "Grupo B" },
  { nome: "Grupo C" },
  { nome: "Grupo D" },
  { nome: "Grupo E" },
  { nome: "Grupo F" },
]

async function seedWCG2011Data() {
  console.log("Inserindo dados do WCG 2011 no Supabase...")

  try {
    // 1. Inserir template do WCG 2011
    console.log("Inserindo template do WCG 2011...")
    const { data: templateData, error: templateError } = await supabase
      .from("templates_torneio")
      .insert(wcgTemplate)
      .select()

    if (templateError) {
      console.error("Erro ao inserir template:", templateError)
      return
    }
    console.log("Template inserido com sucesso:", templateData[0].id)

    // 2. Inserir torneio WCG 2011
    console.log("Inserindo torneio WCG 2011...")
    const { data: torneioData, error: torneioError } = await supabase.from("torneios").insert(wcgTorneio).select()

    if (torneioError) {
      console.error("Erro ao inserir torneio:", torneioError)
      return
    }
    console.log("Torneio inserido com sucesso:", torneioData[0].id)

    const torneioId = torneioData[0].id

    // 3. Inserir grupos do WCG 2011
    console.log("Inserindo grupos do WCG 2011...")
    const gruposWithTorneioId = wcgGrupos.map((grupo) => ({
      ...grupo,
      torneio_id: torneioId,
    }))

    const { data: gruposData, error: gruposError } = await supabase.from("grupos").insert(gruposWithTorneioId).select()

    if (gruposError) {
      console.error("Erro ao inserir grupos:", gruposError)
      return
    }
    console.log(`${gruposData.length} grupos inseridos com sucesso`)

    // 4. Inserir times e jogadores
    console.log("Inserindo times e jogadores do WCG 2011...")

    for (const team of wcgTeams) {
      // Inserir time
      const { data: timeData, error: timeError } = await supabase
        .from("times")
        .insert({
          nome: team.nome,
          logo: team.logo,
          pais: team.pais,
        })
        .select()

      if (timeError) {
        console.error(`Erro ao inserir time ${team.nome}:`, timeError)
        continue
      }

      const timeId = timeData[0].id
      console.log(`Time ${team.nome} inserido com ID: ${timeId}`)

      // Inserir jogadores e associá-los ao time
      for (const jogador of team.jogadores) {
        // Inserir jogador
        const { data: jogadorData, error: jogadorError } = await supabase
          .from("jogadores")
          .insert({
            nome: jogador.nome,
            tipo: "humano",
            perfil: jogador.perfil,
            nacionalidade: jogador.nacionalidade,
            avatar: `/images/players/${jogador.nome.toLowerCase().replace(/\s+/g, "-")}.png`,
          })
          .select()

        if (jogadorError) {
          console.error(`Erro ao inserir jogador ${jogador.nome}:`, jogadorError)
          continue
        }

        const jogadorId = jogadorData[0].id
        console.log(`Jogador ${jogador.nome} inserido com ID: ${jogadorId}`)

        // Associar jogador ao time
        const { error: relacaoError } = await supabase.from("time_jogadores").insert({
          time_id: timeId,
          jogador_id: jogadorId,
        })

        if (relacaoError) {
          console.error(`Erro ao associar jogador ${jogador.nome} ao time ${team.nome}:`, relacaoError)
        }
      }

      // Distribuir times nos grupos (4 times por grupo)
      if (timeData && timeData[0]) {
        const grupoIndex = Math.floor(wcgTeams.indexOf(team) % gruposData.length)
        const grupoId = gruposData[grupoIndex].id

        const { error: grupoTimeError } = await supabase.from("grupo_times").insert({
          grupo_id: grupoId,
          time_id: timeId,
        })

        if (grupoTimeError) {
          console.error(`Erro ao associar time ${team.nome} ao grupo:`, grupoTimeError)
        } else {
          console.log(`Time ${team.nome} associado ao grupo ${gruposData[grupoIndex].nome}`)
        }
      }
    }

    console.log("Dados do WCG 2011 inseridos com sucesso!")
  } catch (error) {
    console.error("Erro ao inserir dados do WCG 2011:", error)
  }
}

seedWCG2011Data().catch((err) => {
  console.error("Erro ao executar script:", err)
  process.exit(1)
})
