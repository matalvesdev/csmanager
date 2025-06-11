-- Inserir times históricos do WCG 2011

INSERT INTO times (nome, tag, logo, pais, cidade, fundacao, website, conquistas) VALUES
('Made in Brazil', 'MIBR', '/placeholder.svg?height=40&width=40', 'Brasil', 'São Paulo', '2003-01-01', 'https://mibr.gg', 
 ARRAY['WCG 2006 Champion', 'CPL World Tour 2005', 'ESWC 2006 Champion']),

('SK Gaming', 'SK', '/placeholder.svg?height=40&width=40', 'Suécia', 'Estocolmo', '1997-01-01', 'https://sk-gaming.com',
 ARRAY['CPL Winter 2005', 'WCG 2003 Champion', 'Multiple Major Titles']),

('Virtus.pro', 'VP', '/placeholder.svg?height=40&width=40', 'Polônia', 'Varsóvia', '2003-01-01', 'https://virtus.pro',
 ARRAY['WCG 2004 Champion', 'CPL Summer 2004', 'ESWC 2005']),

('VeryGames', 'VG', '/placeholder.svg?height=40&width=40', 'França', 'Paris', '2007-01-01', 'https://verygames.net',
 ARRAY['ESWC 2011 Champion', 'DreamHack Winter 2011', 'Multiple French Titles']),

('mousesports', 'mouz', '/placeholder.svg?height=40&width=40', 'Alemanha', 'Berlim', '2002-01-01', 'https://mousesports.com',
 ARRAY['CPL Germany 2005', 'WCG Germany Champion', 'ESL Major Series']),

('mTw', 'mTw', '/placeholder.svg?height=40&width=40', 'Dinamarca', 'Copenhague', '2005-01-01', 'https://mtw.dk',
 ARRAY['CPL Denmark Champion', 'Nordic Championship', 'WCG Denmark']),

('Team3D', '3D', '/placeholder.svg?height=40&width=40', 'Estados Unidos', 'Nova York', '2003-01-01', 'https://team3d.com',
 ARRAY['CPL Summer 2005', 'WCG USA Champion', 'CAL-I Multiple Seasons']),

('Natus Vincere', 'NAVI', '/placeholder.svg?height=40&width=40', 'Ucrânia', 'Kiev', '2009-01-01', 'https://navi.gg',
 ARRAY['WCG 2010 Champion', 'Intel Extreme Masters', 'ESWC 2010']),

('Tyloo', 'TyLoo', '/placeholder.svg?height=40&width=40', 'China', 'Pequim', '2007-01-01', 'https://tyloo.gg',
 ARRAY['WCG China Champion', 'Asian Championship', 'ESWC Asia']),

('WeMade FOX', 'FOX', '/placeholder.svg?height=40&width=40', 'Coreia do Sul', 'Seul', '2006-01-01', 'https://wemade.com',
 ARRAY['WCG Korea Champion', 'Asian Games', 'Korean e-Sports League']),

('x6tence', 'x6', '/placeholder.svg?height=40&width=40', 'Espanha', 'Barcelona', '2008-01-01', 'https://x6tence.com',
 ARRAY['WCG Spain Champion', 'ESWC Spain', 'Spanish National Championship']),

('69°N-28°E', '69N', '/placeholder.svg?height=40&width=40', 'Finlândia', 'Helsinki', '2005-01-01', 'https://69n-28e.fi',
 ARRAY['WCG Finland Champion', 'Nordic Championship', 'Assembly Tournament']),

('Fnatic', 'fnatic', '/placeholder.svg?height=40&width=40', 'Suécia', 'Londres', '2004-01-01', 'https://fnatic.com',
 ARRAY['CPL World Tour', 'DreamHack Masters', 'WCG Multiple Years']),

('eoLithic', 'eoL', '/placeholder.svg?height=40&width=40', 'Noruega', 'Oslo', '2006-01-01', 'https://eolithic.no',
 ARRAY['WCG Norway Champion', 'Nordic Championship', 'Gathering Tournament']),

('Dark Passage', 'DP', '/placeholder.svg?height=40&width=40', 'Turquia', 'Istambul', '2008-01-01', 'https://dp.gg',
 ARRAY['WCG Turkey Champion', 'Turkish Championship', 'ESWC Turkey']),

('Immunity', 'iM', '/placeholder.svg?height=40&width=40', 'Austrália', 'Sydney', '2009-01-01', 'https://immunity.gg',
 ARRAY['WCG Australia Champion', 'Oceanic Championship', 'Australian Cyber League']);

-- Associar jogadores aos times
-- MIBR (Time 1) - Jogadores 1-5
INSERT INTO time_jogadores (time_id, jogador_id, posicao, data_entrada) VALUES
(1, 1, 'AWPer', '2011-01-01'),
(1, 2, 'Entry Fragger', '2011-01-01'),
(1, 3, 'In-Game Leader', '2011-01-01'),
(1, 4, 'Support', '2011-01-01'),
(1, 5, 'Lurker', '2011-01-01');

-- SK Gaming (Time 2) - Jogadores 6-10
INSERT INTO time_jogadores (time_id, jogador_id, posicao, data_entrada) VALUES
(2, 6, 'Entry Fragger', '2011-01-01'),
(2, 7, 'Lurker', '2011-01-01'),
(2, 8, 'Support', '2011-01-01'),
(2, 9, 'In-Game Leader', '2011-01-01'),
(2, 10, 'AWPer', '2011-01-01');

-- Virtus.pro (Time 3) - Jogadores 11-15
INSERT INTO time_jogadores (time_id, jogador_id, posicao, data_entrada) VALUES
(3, 11, 'Entry Fragger', '2011-01-01'),
(3, 12, 'In-Game Leader', '2011-01-01'),
(3, 13, 'Support', '2011-01-01'),
(3, 14, 'Lurker', '2011-01-01'),
(3, 15, 'AWPer', '2011-01-01');

-- VeryGames (Time 4) - Jogadores 16-20
INSERT INTO time_jogadores (time_id, jogador_id, posicao, data_entrada) VALUES
(4, 16, 'Entry Fragger', '2011-01-01'),
(4, 17, 'AWPer', '2011-01-01'),
(4, 18, 'In-Game Leader', '2011-01-01'),
(4, 19, 'Support', '2011-01-01'),
(4, 20, 'Rifler', '2011-01-01');

-- mousesports (Time 5) - Jogadores 21-25
INSERT INTO time_jogadores (time_id, jogador_id, posicao, data_entrada) VALUES
(5, 21, 'In-Game Leader', '2011-01-01'),
(5, 22, 'AWPer', '2011-01-01'),
(5, 23, 'Entry Fragger', '2011-01-01'),
(5, 24, 'Support', '2011-01-01'),
(5, 25, 'Lurker', '2011-01-01');

-- mTw (Time 6) - Jogadores 26-30
INSERT INTO time_jogadores (time_id, jogador_id, posicao, data_entrada) VALUES
(6, 26, 'Support', '2011-01-01'),
(6, 27, 'Support', '2011-01-01'),
(6, 28, 'In-Game Leader', '2011-01-01'),
(6, 29, 'AWPer', '2011-01-01'),
(6, 30, 'Entry Fragger', '2011-01-01');

-- Team3D (Time 7) - Jogadores 31-35
INSERT INTO time_jogadores (time_id, jogador_id, posicao, data_entrada) VALUES
(7, 31, 'Entry Fragger', '2011-01-01'),
(7, 32, 'AWPer', '2011-01-01'),
(7, 33, 'In-Game Leader', '2011-01-01'),
(7, 34, 'Support', '2011-01-01'),
(7, 35, 'Lurker', '2011-01-01');

-- Natus Vincere (Time 8) - Jogadores 36-40
INSERT INTO time_jogadores (time_id, jogador_id, posicao, data_entrada) VALUES
(8, 36, 'AWPer', '2011-01-01'),
(8, 37, 'Entry Fragger', '2011-01-01'),
(8, 38, 'In-Game Leader', '2011-01-01'),
(8, 39, 'Support', '2011-01-01'),
(8, 40, 'AWPer', '2011-01-01');

-- Tyloo (Time 9) - Jogadores 41-45
INSERT INTO time_jogadores (time_id, jogador_id, posicao, data_entrada) VALUES
(9, 41, 'Entry Fragger', '2011-01-01'),
(9, 42, 'AWPer', '2011-01-01'),
(9, 43, 'In-Game Leader', '2011-01-01'),
(9, 44, 'Support', '2011-01-01'),
(9, 45, 'Lurker', '2011-01-01');

-- WeMade FOX (Time 10) - Jogadores 46-50
INSERT INTO time_jogadores (time_id, jogador_id, posicao, data_entrada) VALUES
(10, 46, 'Entry Fragger', '2011-01-01'),
(10, 47, 'AWPer', '2011-01-01'),
(10, 48, 'In-Game Leader', '2011-01-01'),
(10, 49, 'Support', '2011-01-01'),
(10, 50, 'Lurker', '2011-01-01');

-- x6tence (Time 11) - Jogadores 51-55 (usando bots para completar)
INSERT INTO time_jogadores (time_id, jogador_id, posicao, data_entrada) VALUES
(11, 51, 'Entry Fragger', '2011-01-01'),
(11, 52, 'AWPer', '2011-01-01'),
(11, 53, 'In-Game Leader', '2011-01-01'),
(11, 54, 'Support', '2011-01-01'),
(11, 55, 'Lurker', '2011-01-01');

-- 69°N-28°E (Time 12) - Jogadores 56-60 (usando bots)
INSERT INTO time_jogadores (time_id, jogador_id, posicao, data_entrada) VALUES
(12, 56, 'Entry Fragger', '2011-01-01'),
(12, 57, 'AWPer', '2011-01-01'),
(12, 58, 'In-Game Leader', '2011-01-01'),
(12, 59, 'Support', '2011-01-01'),
(12, 60, 'Lurker', '2011-01-01');

-- Fnatic (Time 13) - Usando bots para completar
INSERT INTO time_jogadores (time_id, jogador_id, posicao, data_entrada) VALUES
(13, 61, 'Entry Fragger', '2011-01-01'),
(13, 62, 'AWPer', '2011-01-01'),
(13, 63, 'In-Game Leader', '2011-01-01'),
(13, 64, 'Support', '2011-01-01'),
(13, 65, 'Lurker', '2011-01-01');

-- eoLithic (Time 14) - Usando bots
INSERT INTO time_jogadores (time_id, jogador_id, posicao, data_entrada) VALUES
(14, 66, 'Entry Fragger', '2011-01-01'),
(14, 67, 'AWPer', '2011-01-01'),
(14, 68, 'In-Game Leader', '2011-01-01'),
(14, 69, 'Support', '2011-01-01'),
(14, 70, 'Lurker', '2011-01-01');

-- Dark Passage (Time 15) - Usando bots
INSERT INTO time_jogadores (time_id, jogador_id, posicao, data_entrada) VALUES
(15, 71, 'Entry Fragger', '2011-01-01'),
(15, 72, 'AWPer', '2011-01-01'),
(15, 73, 'In-Game Leader', '2011-01-01'),
(15, 74, 'Support', '2011-01-01'),
(15, 75, 'Lurker', '2011-01-01');

-- Immunity (Time 16) - Usando bots
INSERT INTO time_jogadores (time_id, jogador_id, posicao, data_entrada) VALUES
(16, 76, 'Entry Fragger', '2011-01-01'),
(16, 77, 'AWPer', '2011-01-01'),
(16, 78, 'In-Game Leader', '2011-01-01'),
(16, 79, 'Support', '2011-01-01'),
(16, 80, 'Lurker', '2011-01-01');
