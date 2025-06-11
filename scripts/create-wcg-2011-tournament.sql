-- Inserir template WCG 2011
INSERT INTO templates_torneio (nome, descricao, configuracao) VALUES
('WCG 2011 Official', 'Configuração oficial do World Cyber Games 2011', '{
  "modoPartida": "MR15",
  "tempoRound": 115,
  "tempoBomba": 35,
  "tempoFreeze": 6,
  "maxRounds": 30,
  "overtime": true,
  "overtimeRounds": 6,
  "friendlyFire": false,
  "autoKick": true,
  "forceCamera": true,
  "ghostFreq": false,
  "hltv": {
    "habilitado": true,
    "ip": "127.0.0.1",
    "porta": 27020,
    "senha": "",
    "delay": 90
  },
  "servidor": {
    "tickrate": 100,
    "fps_max": 300,
    "sv_maxrate": 25000,
    "sv_minrate": 5000,
    "sv_maxupdaterate": 101,
    "sv_minupdaterate": 10,
    "sv_maxcmdrate": 101,
    "sv_mincmdrate": 10
  },
  "mapas": ["de_dust2", "de_inferno", "de_nuke", "de_train", "de_mirage", "de_cache", "de_overpass"],
  "formatoMapas": "bo3",
  "banPick": true,
  "pausas": {
    "habilitadas": true,
    "maxPausasPorTime": 4,
    "tempoPausa": 300
  },
  "substitutos": {
    "habilitados": true,
    "maxSubstitutos": 2
  },
  "premio": {
    "primeiro": "$100,000",
    "segundo": "$50,000",
    "terceiro": "$25,000",
    "quarto": "$15,000"
  }
}'::jsonb);

-- Inserir torneio WCG 2011
INSERT INTO torneios (nome, descricao, premiacao, regulamento, data_inicio, data_fim, status, configuracao) VALUES
('World Cyber Games 2011', 
'O maior torneio de Counter-Strike 1.6 do mundo em 2011, realizado em Busan, Coreia do Sul. Reunindo as melhores equipes de todos os continentes.',
'Premiação total de $190,000 USD - 1º lugar: $100,000 | 2º lugar: $50,000 | 3º lugar: $25,000 | 4º lugar: $15,000',
'Regulamento oficial WCG 2011:
- Formato: Eliminação dupla
- Mapas: de_dust2, de_inferno, de_nuke, de_train, de_mirage, de_cache, de_overpass
- Modo: MR15 (Máximo 30 rounds)
- Overtime: MR6 até decisão
- Tempo por round: 1:55
- Tempo da bomba: 35 segundos
- Friendly Fire: Desabilitado
- Pausas: Máximo 4 por time, 5 minutos cada
- Substitutos: Máximo 2 por equipe
- HLTV: Obrigatório para todas as partidas
- Anti-cheat: Obrigatório
- Equipamentos: Fornecidos pela organização',
CURRENT_TIMESTAMP, 
CURRENT_TIMESTAMP + INTERVAL '10 days', 
'finalizado',
'{
  "modoPartida": "MR15",
  "tempoRound": 115,
  "tempoBomba": 35,
  "tempoFreeze": 6,
  "maxRounds": 30,
  "overtime": true,
  "overtimeRounds": 6,
  "friendlyFire": false,
  "autoKick": true,
  "forceCamera": true,
  "ghostFreq": false,
  "hltv": {
    "habilitado": true,
    "ip": "127.0.0.1",
    "porta": 27020,
    "senha": "",
    "delay": 90
  },
  "servidor": {
    "tickrate": 100,
    "fps_max": 300,
    "sv_maxrate": 25000,
    "sv_minrate": 5000,
    "sv_maxupdaterate": 101,
    "sv_minupdaterate": 10,
    "sv_maxcmdrate": 101,
    "sv_mincmdrate": 10
  },
  "mapas": ["de_dust2", "de_inferno", "de_nuke", "de_train", "de_mirage", "de_cache", "de_overpass"],
  "formatoMapas": "bo3",
  "banPick": true,
  "pausas": {
    "habilitadas": true,
    "maxPausasPorTime": 4,
    "tempoPausa": 300
  },
  "substitutos": {
    "habilitados": true,
    "maxSubstitutos": 2
  },
  "premio": {
    "primeiro": "$100,000",
    "segundo": "$50,000",
    "terceiro": "$25,000",
    "quarto": "$15,000"
  }
}'::jsonb);

-- Criar grupos do WCG 2011
INSERT INTO grupos (torneio_id, nome) VALUES
(1, 'Grupo A'),
(1, 'Grupo B'),
(1, 'Grupo C'),
(1, 'Grupo D');

-- Distribuir times nos grupos (4 times por grupo)
-- Grupo A
INSERT INTO grupo_times (grupo_id, time_id) VALUES
(1, 1),  -- MIBR
(1, 5),  -- mTw
(1, 9),  -- WeMade FOX
(1, 13); -- eoLithic

-- Grupo B
INSERT INTO grupo_times (grupo_id, time_id) VALUES
(2, 2),  -- SK Gaming
(2, 6),  -- Team3D
(2, 10), -- x6tence
(2, 14); -- Dark Passage

-- Grupo C
INSERT INTO grupo_times (grupo_id, time_id) VALUES
(3, 3),  -- VeryGames
(3, 7),  -- Moscow Five
(3, 11), -- 69°N-28°E
(3, 15); -- Immunity

-- Grupo D
INSERT INTO grupo_times (grupo_id, time_id) VALUES
(4, 4),  -- mousesports
(4, 8),  -- Tyloo
(4, 12), -- Fnatic
(4, 16); -- Team Mexico

-- Criar algumas partidas históricas do WCG 2011
INSERT INTO partidas (torneio_id, time_a_id, time_b_id, mapa, fase, round_number, position_number, inicio_previsto, status, placar_time_a, placar_time_b) VALUES
-- Fase de Grupos - Grupo A
(1, 1, 5, 'de_dust2', 'grupos', 1, 1, CURRENT_TIMESTAMP - INTERVAL '9 days', 'finalizada', 16, 12),
(1, 9, 13, 'de_inferno', 'grupos', 1, 2, CURRENT_TIMESTAMP - INTERVAL '9 days', 'finalizada', 14, 16),
(1, 1, 9, 'de_nuke', 'grupos', 1, 3, CURRENT_TIMESTAMP - INTERVAL '8 days', 'finalizada', 16, 8),
(1, 5, 13, 'de_train', 'grupos', 1, 4, CURRENT_TIMESTAMP - INTERVAL '8 days', 'finalizada', 16, 11),

-- Fase de Grupos - Grupo B
(1, 2, 6, 'de_dust2', 'grupos', 1, 5, CURRENT_TIMESTAMP - INTERVAL '9 days', 'finalizada', 16, 14),
(1, 10, 14, 'de_inferno', 'grupos', 1, 6, CURRENT_TIMESTAMP - INTERVAL '9 days', 'finalizada', 12, 16),
(1, 2, 10, 'de_mirage', 'grupos', 1, 7, CURRENT_TIMESTAMP - INTERVAL '8 days', 'finalizada', 16, 9),
(1, 6, 14, 'de_cache', 'grupos', 1, 8, CURRENT_TIMESTAMP - INTERVAL '8 days', 'finalizada', 13, 16),

-- Quartas de Final
(1, 1, 2, 'de_dust2', 'quartas', 2, 1, CURRENT_TIMESTAMP - INTERVAL '5 days', 'finalizada', 16, 19),
(1, 3, 7, 'de_inferno', 'quartas', 2, 2, CURRENT_TIMESTAMP - INTERVAL '5 days', 'finalizada', 16, 12),
(1, 4, 5, 'de_nuke', 'quartas', 2, 3, CURRENT_TIMESTAMP - INTERVAL '5 days', 'finalizada', 14, 16),
(1, 6, 14, 'de_train', 'quartas', 2, 4, CURRENT_TIMESTAMP - INTERVAL '5 days', 'finalizada', 16, 11),

-- Semifinais
(1, 1, 3, 'de_dust2', 'semifinal', 3, 1, CURRENT_TIMESTAMP - INTERVAL '3 days', 'finalizada', 16, 13),
(1, 5, 6, 'de_inferno', 'semifinal', 3, 2, CURRENT_TIMESTAMP - INTERVAL '3 days', 'finalizada', 12, 16),

-- Final
(1, 1, 6, 'de_dust2', 'final', 4, 1, CURRENT_TIMESTAMP - INTERVAL '1 day', 'finalizada', 16, 14);
