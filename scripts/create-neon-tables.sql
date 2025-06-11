-- Limpar tabelas existentes (cuidado em produção)
DROP TABLE IF EXISTS partidas CASCADE;
DROP TABLE IF EXISTS grupo_times CASCADE;
DROP TABLE IF EXISTS time_jogadores CASCADE;
DROP TABLE IF EXISTS grupos CASCADE;
DROP TABLE IF EXISTS templates_torneio CASCADE;
DROP TABLE IF EXISTS torneios CASCADE;
DROP TABLE IF EXISTS times CASCADE;
DROP TABLE IF EXISTS jogadores CASCADE;

-- Criar tabela de jogadores
CREATE TABLE jogadores (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    tipo VARCHAR(50) DEFAULT 'humano',
    perfil VARCHAR(50),
    avatar TEXT,
    nacionalidade VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela de times
CREATE TABLE times (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    logo TEXT,
    pais VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela de relacionamento time-jogadores
CREATE TABLE time_jogadores (
    time_id INTEGER REFERENCES times(id) ON DELETE CASCADE,
    jogador_id INTEGER REFERENCES jogadores(id) ON DELETE CASCADE,
    PRIMARY KEY (time_id, jogador_id)
);

-- Criar tabela de torneios
CREATE TABLE torneios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    premiacao TEXT,
    regulamento TEXT,
    data_inicio TIMESTAMP NOT NULL,
    data_fim TIMESTAMP NOT NULL,
    status VARCHAR(50) DEFAULT 'agendado',
    configuracao JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela de grupos
CREATE TABLE grupos (
    id SERIAL PRIMARY KEY,
    torneio_id INTEGER REFERENCES torneios(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela de relacionamento grupo-times
CREATE TABLE grupo_times (
    grupo_id INTEGER REFERENCES grupos(id) ON DELETE CASCADE,
    time_id INTEGER REFERENCES times(id) ON DELETE CASCADE,
    PRIMARY KEY (grupo_id, time_id)
);

-- Criar tabela de partidas
CREATE TABLE partidas (
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

-- Criar tabela de templates
CREATE TABLE templates_torneio (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    configuracao JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar índices para performance
CREATE INDEX idx_torneios_status ON torneios(status);
CREATE INDEX idx_partidas_torneio ON partidas(torneio_id);
CREATE INDEX idx_partidas_status ON partidas(status);
CREATE INDEX idx_grupos_torneio ON grupos(torneio_id);
CREATE INDEX idx_jogadores_tipo ON jogadores(tipo);
CREATE INDEX idx_jogadores_nacionalidade ON jogadores(nacionalidade);
CREATE INDEX idx_times_pais ON times(pais);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_torneios_updated_at BEFORE UPDATE ON torneios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_times_updated_at BEFORE UPDATE ON times FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_jogadores_updated_at BEFORE UPDATE ON jogadores FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_partidas_updated_at BEFORE UPDATE ON partidas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON templates_torneio FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
