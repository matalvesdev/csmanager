-- Criar tabelas para o sistema de torneios
CREATE TABLE IF NOT EXISTS torneios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    premiacao TEXT,
    regulamento TEXT,
    data_inicio TIMESTAMP NOT NULL,
    data_fim TIMESTAMP NOT NULL,
    status VARCHAR(50) DEFAULT 'agendado',
    configuracao JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS grupos (
    id SERIAL PRIMARY KEY,
    torneio_id INTEGER REFERENCES torneios(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS times (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    logo TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS jogadores (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    tipo VARCHAR(50) DEFAULT 'humano',
    perfil VARCHAR(50),
    avatar TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS time_jogadores (
    time_id INTEGER REFERENCES times(id) ON DELETE CASCADE,
    jogador_id INTEGER REFERENCES jogadores(id) ON DELETE CASCADE,
    PRIMARY KEY (time_id, jogador_id)
);

CREATE TABLE IF NOT EXISTS grupo_times (
    grupo_id INTEGER REFERENCES grupos(id) ON DELETE CASCADE,
    time_id INTEGER REFERENCES times(id) ON DELETE CASCADE,
    PRIMARY KEY (grupo_id, time_id)
);

CREATE TABLE IF NOT EXISTS partidas (
    id SERIAL PRIMARY KEY,
    torneio_id INTEGER REFERENCES torneios(id) ON DELETE CASCADE,
    time_a_id INTEGER REFERENCES times(id),
    time_b_id INTEGER REFERENCES times(id),
    mapa VARCHAR(100),
    fase VARCHAR(50) DEFAULT 'grupos',
    round_number INTEGER DEFAULT 1,
    position_number INTEGER DEFAULT 1,
    inicio_previsto TIMESTAMP NOT NULL,
    status VARCHAR(50) DEFAULT 'agendada',
    placar_time_a INTEGER DEFAULT 0,
    placar_time_b INTEGER DEFAULT 0,
    hltv_demo_url TEXT,
    logs TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_torneios_status ON torneios(status);
CREATE INDEX IF NOT EXISTS idx_partidas_torneio ON partidas(torneio_id);
CREATE INDEX IF NOT EXISTS idx_partidas_status ON partidas(status);
CREATE INDEX IF NOT EXISTS idx_grupos_torneio ON grupos(torneio_id);
