-- Inserir template oficial do WCG 2011
INSERT INTO templates_torneio (nome, descricao, categoria, configuracao, publico, criado_por, versao, tags) VALUES
('WCG 2011 Official Configuration', 
'Configuração oficial do World Cyber Games 2011 Counter-Strike 1.6 realizado em Busan, Coreia do Sul',
'Oficial',
'{
  "servidor": {
    "tickrate": 100,
    "fps_max": 300,
    "sv_maxrate": 25000,
    "sv_minrate": 5000,
    "sv_maxupdaterate": 101,
    "sv_minupdaterate": 10,
    "sv_maxcmdrate": 101,
    "sv_mincmdrate": 10,
    "sv_lan": 1,
    "sv_region": 3
  },
  "partida": {
    "modo": "MR15",
    "tempoRound": 115,
    "tempoBomba": 35,
    "tempoFreeze": 6,
    "maxRounds": 30,
    "overtime": true,
    "overtimeRounds": 6,
    "overtimeMoney": 10000,
    "startMoney": 800,
    "friendlyFire": false,
    "autoKick": true,
    "forceCamera": true,
    "ghostFreq": false
  },
  "mapas": {
    "pool": ["de_dust2", "de_inferno", "de_nuke", "de_train", "de_mirage", "de_cache", "de_overpass"],
    "formato": "bo3",
    "banPick": true,
    "sequencia": ["ban", "ban", "pick", "pick", "ban", "ban", "pick"]
  },
  "hltv": {
    "habilitado": true,
    "ip": "127.0.0.1",
    "porta": 27020,
    "senha": "wcg2011",
    "delay": 90,
    "autoRecord": true,
    "demoPath": "/demos/wcg2011/"
  },
  "pausas": {
    "habilitadas": true,
    "maxPausasPorTime": 4,
    "tempoPausa": 300,
    "pausaTecnica": true
  },
  "substitutos": {
    "habilitados": true,
    "maxSubstitutos": 2,
    "substituicaoRound": false
  },
  "anticheat": {
    "obrigatorio": true,
    "sistema": "VAC + ESL Wire",
    "screenshots": true,
    "verificacaoHardware": true
  },
  "equipamentos": {
    "mouse": "Fornecido pela organização",
    "teclado": "Fornecido pela organização",
    "headset": "Fornecido pela organização",
    "monitor": "CRT 19 polegadas",
    "configuracaoPersonal": false
  },
  "premio": {
    "total": "$190,000",
    "primeiro": "$100,000",
    "segundo": "$50,000",
    "terceiro": "$25,000",
    "quarto": "$15,000"
  }
}'::jsonb,
true,
'WCG Organization',
'1.0',
ARRAY['WCG', '2011', 'Official', 'Counter-Strike', 'Championship']);

-- Inserir o torneio WCG 2011
INSERT INTO torneios (nome, descricao, premiacao, regulamento, data_inicio, data_fim, local_evento, pais_evento, organizador, patrocinadores, status, formato, max_times, configuracao, imagem_banner) VALUES
('World Cyber Games 2011 - Counter-Strike 1.6', 
'O maior e mais prestigioso torneio de Counter-Strike 1.6 do mundo em 2011. Realizado em Busan, Coreia do Sul, reunindo as 16 melhores equipes de todos os continentes para disputar o título mundial e a maior premiação da história do CS 1.6.',
'Premiação total de $190,000 USD
🥇 1º lugar: $100,000 USD
🥈 2º lugar: $50,000 USD  
🥉 3º lugar: $25,000 USD
🏅 4º lugar: $15,000 USD

Além da premiação em dinheiro, os campeões recebem:
- Troféu oficial WCG 2011
- Medalhas de ouro personalizadas
- Reconhecimento mundial como melhores do CS 1.6',

'REGULAMENTO OFICIAL WCG 2011 - COUNTER-STRIKE 1.6

📋 FORMATO DO TORNEIO:
- 16 equipes qualificadas de suas respectivas regiões
- Fase de grupos: 4 grupos de 4 times cada
- Sistema round-robin dentro dos grupos
- 2 melhores de cada grupo avançam para playoffs
- Playoffs: Eliminação simples (quartas, semi, final)

🎮 CONFIGURAÇÕES DE JOGO:
- Modo: MR15 (máximo 30 rounds)
- Overtime: MR6 até decisão
- Tempo por round: 1:55 minutos
- Tempo da bomba: 35 segundos
- Dinheiro inicial: $800
- Friendly Fire: DESABILITADO
- Force Camera: HABILITADO

🗺️ MAPAS OFICIAIS:
- de_dust2, de_inferno, de_nuke, de_train
- de_mirage, de_cache, de_overpass
- Sistema de ban/pick para Bo3
- Sequência: ban-ban-pick-pick-ban-ban-pick

⏸️ PAUSAS E TIMEOUTS:
- Máximo 4 pausas por equipe
- Duração máxima: 5 minutos cada
- Pausas técnicas permitidas
- Substituições apenas entre rounds

🛡️ ANTI-CHEAT E SEGURANÇA:
- VAC + ESL Wire obrigatório
- Screenshots automáticos
- Verificação de hardware
- Configurações bloqueadas

🎧 EQUIPAMENTOS:
- Mouse, teclado e headset fornecidos
- Monitores CRT 19" padronizados
- Configurações pessoais não permitidas
- Periféricos próprios mediante aprovação

📺 TRANSMISSÃO:
- HLTV obrigatório para todas as partidas
- Delay de 90 segundos
- Demos gravados automaticamente
- Transmissão ao vivo oficial

🏆 PREMIAÇÃO E RECONHECIMENTO:
- Cerimônia oficial de premiação
- Entrevistas com campeões
- Cobertura da mídia internacional
- Ranking mundial atualizado',

'2011-12-08 09:00:00',
'2011-12-11 20:00:00',
'BEXCO (Busan Exhibition & Convention Center)',
'Coreia do Sul',
'World Cyber Games Organization',
ARRAY['Samsung', 'Intel', 'Microsoft', 'NVIDIA', 'Coca-Cola', 'Korean Air'],
'finalizado',
'grupos_eliminacao',
16,
'{
  "servidor": {
    "tickrate": 100,
    "fps_max": 300,
    "sv_maxrate": 25000,
    "sv_minrate": 5000,
    "sv_maxupdaterate": 101,
    "sv_minupdaterate": 10,
    "sv_maxcmdrate": 101,
    "sv_mincmdrate": 10,
    "sv_lan": 1,
    "sv_region": 3
  },
  "partida": {
    "modo": "MR15",
    "tempoRound": 115,
    "tempoBomba": 35,
    "tempoFreeze": 6,
    "maxRounds": 30,
    "overtime": true,
    "overtimeRounds": 6,
    "overtimeMoney": 10000,
    "startMoney": 800,
    "friendlyFire": false,
    "autoKick": true,
    "forceCamera": true,
    "ghostFreq": false
  },
  "mapas": {
    "pool": ["de_dust2", "de_inferno", "de_nuke", "de_train", "de_mirage", "de_cache", "de_overpass"],
    "formato": "bo3",
    "banPick": true,
    "sequencia": ["ban", "ban", "pick", "pick", "ban", "ban", "pick"]
  },
  "hltv": {
    "habilitado": true,
    "ip": "127.0.0.1",
    "porta": 27020,
    "senha": "wcg2011",
    "delay": 90,
    "autoRecord": true,
    "demoPath": "/demos/wcg2011/"
  },
  "pausas": {
    "habilitadas": true,
    "maxPausasPorTime": 4,
    "tempoPausa": 300,
    "pausaTecnica": true
  },
  "substitutos": {
    "habilitados": true,
    "maxSubstitutos": 2,
    "substituicaoRound": false
  },
  "anticheat": {
    "obrigatorio": true,
    "sistema": "VAC + ESL Wire",
    "screenshots": true,
    "verificacaoHardware": true
  },
  "equipamentos": {
    "mouse": "Fornecido pela organização",
    "teclado": "Fornecido pela organização", 
    "headset": "Fornecido pela organização",
    "monitor": "CRT 19 polegadas",
    "configuracaoPersonal": false
  },
  "premio": {
    "total": "$190,000",
    "primeiro": "$100,000",
    "segundo": "$50,000",
    "terceiro": "$25,000",
    "quarto": "$15,000"
  }
}'::jsonb,
'/placeholder.svg?height=200&width=800');

-- Criar grupos do WCG 2011
INSERT INTO grupos (torneio_id, nome, descricao, ordem) VALUES
(1, 'Grupo A', 'Grupo A - Americas & Europe', 1),
(1, 'Grupo B', 'Grupo B - Europe & Asia', 2),
(1, 'Grupo C', 'Grupo C - Mixed Regions', 3),
(1, 'Grupo D', 'Grupo D - Asia & Oceania', 4);

-- Distribuir times nos grupos (4 times por grupo)
-- Grupo A: MIBR (Brasil), mousesports (Alemanha), WeMade FOX (Coreia), eoLithic (Noruega)
INSERT INTO grupo_times (grupo_id, time_id) VALUES
(1, 1),  -- MIBR
(1, 5),  -- mousesports  
(1, 10), -- WeMade FOX
(1, 14); -- eoLithic

-- Grupo B: SK Gaming (Suécia), Team3D (EUA), x6tence (Espanha), Dark Passage (Turquia)
INSERT INTO grupo_times (grupo_id, time_id) VALUES
(2, 2),  -- SK Gaming
(2, 7),  -- Team3D
(2, 11), -- x6tence
(2, 15); -- Dark Passage

-- Grupo C: Virtus.pro (Polônia), Natus Vincere (Ucrânia), 69°N-28°E (Finlândia), Immunity (Austrália)
INSERT INTO grupo_times (grupo_id, time_id) VALUES
(3, 3),  -- Virtus.pro
(3, 8),  -- Natus Vincere
(3, 12), -- 69°N-28°E
(3, 16); -- Immunity

-- Grupo D: VeryGames (França), mTw (Dinamarca), Tyloo (China), Fnatic (Suécia)
INSERT INTO grupo_times (grupo_id, time_id) VALUES
(4, 4),  -- VeryGames
(4, 6),  -- mTw
(4, 9),  -- Tyloo
(4, 13); -- Fnatic
