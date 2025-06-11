-- Inserir dados de exemplo
INSERT INTO jogadores (nome, tipo, perfil, avatar) VALUES
('HeadHunter', 'bot', 'Entry', '/placeholder.svg?height=40&width=40'),
('Sniper', 'bot', 'AWPer', '/placeholder.svg?height=40&width=40'),
('Tactician', 'bot', 'IGL', '/placeholder.svg?height=40&width=40'),
('Shadow', 'bot', 'Lurker', '/placeholder.svg?height=40&width=40'),
('Guardian', 'bot', 'Support', '/placeholder.svg?height=40&width=40'),
('Player1', 'humano', NULL, '/placeholder.svg?height=40&width=40'),
('Player2', 'humano', NULL, '/placeholder.svg?height=40&width=40'),
('Player3', 'humano', NULL, '/placeholder.svg?height=40&width=40')
ON CONFLICT DO NOTHING;

INSERT INTO times (nome, logo) VALUES
('Alpha Squad', '/placeholder.svg?height=40&width=40'),
('Beta Force', '/placeholder.svg?height=40&width=40'),
('Gamma Team', '/placeholder.svg?height=40&width=40'),
('Delta Ops', '/placeholder.svg?height=40&width=40'),
('Epsilon Elite', '/placeholder.svg?height=40&width=40'),
('Zeta Squad', '/placeholder.svg?height=40&width=40'),
('Omega Team', '/placeholder.svg?height=40&width=40'),
('Sigma Force', '/placeholder.svg?height=40&width=40')
ON CONFLICT DO NOTHING;

-- Associar jogadores aos times
INSERT INTO time_jogadores (time_id, jogador_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5),
(2, 1), (2, 2), (2, 3), (2, 6), (2, 7),
(3, 1), (3, 2), (3, 3), (3, 4), (3, 5),
(4, 1), (4, 2), (4, 3), (4, 4), (4, 5),
(5, 1), (5, 2), (5, 3), (5, 4), (5, 5),
(6, 1), (6, 2), (6, 3), (6, 4), (6, 5),
(7, 1), (7, 2), (7, 3), (7, 4), (5, 5),
(8, 1), (8, 2), (8, 3), (8, 4), (8, 5)
ON CONFLICT DO NOTHING;

-- Inserir torneio de exemplo
INSERT INTO torneios (nome, descricao, premiacao, data_inicio, data_fim, status, configuracao) VALUES
('Campeonato CS 1.6 2023', 'Campeonato oficial de Counter-Strike 1.6', 'R$ 10.000 para o primeiro lugar', 
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '7 days', 'em_andamento',
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
   }
 }'::jsonb)
ON CONFLICT DO NOTHING;

-- Criar grupos para o torneio
INSERT INTO grupos (torneio_id, nome) VALUES
(1, 'Grupo A'),
(1, 'Grupo B')
ON CONFLICT DO NOTHING;

-- Associar times aos grupos
INSERT INTO grupo_times (grupo_id, time_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 4),
(2, 5), (2, 6), (2, 7), (2, 8)
ON CONFLICT DO NOTHING;
