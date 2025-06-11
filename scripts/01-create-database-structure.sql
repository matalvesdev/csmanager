-- Limpar tabelas existentes (ordem importante devido às foreign keys)
DROP TABLE IF EXISTS partidas CASCADE;
DROP TABLE IF EXISTS grupo_times CASCADE;
DROP TABLE IF EXISTS time_jogadores CASCADE;
DROP TABLE IF EXISTS grupos CASCADE;
DROP TABLE IF EXISTS templates_torneio CASCADE;
DROP TABLE IF EXISTS torneios CASCADE;
DROP TABLE IF EXISTS times CASCADE;
DROP TABLE IF EXISTS jogadores CASCADE;

-- Criar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de jogadores
CREATE TABLE jogadores (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE,
    nome VARCHAR(255) NOT NULL,
    nick VARCHAR(100) UNIQUE,
    tipo VARCHAR(50) DEFAULT 'humano' CHECK (tipo IN ('humano', 'bot')),
    perfil VARCHAR(50) CHECK (perfil IN ('Entry', 'AWPer', 'IGL', 'Support', 'Lurker', 'Rifler')),
    avatar TEXT DEFAULT '/placeholder.svg?height=40&width=40',
    nacionalidade VARCHAR(100),
    idade INTEGER,
    steam_id VARCHAR(100),
    biografia TEXT,
    estatisticas JSONB DEFAULT '{}',
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de times
CREATE TABLE times (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE,
    nome VARCHAR(255) NOT NULL,
    tag VARCHAR(20),
    logo TEXT DEFAULT '/placeholder.svg?height=40&width=40',
    pais VARCHAR(100),
    cidade VARCHAR(100),
    fundacao DATE,
    website VARCHAR(255),
    twitter VARCHAR(100),
    instagram VARCHAR(100),
    patrocinadores TEXT[],
    conquistas TEXT[],
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de relacionamento time-jogadores
CREATE TABLE time_jogadores (
    id SERIAL PRIMARY KEY,
    time_id INTEGER REFERENCES times(id) ON DELETE CASCADE,
    jogador_id INTEGER REFERENCES jogadores(id) ON DELETE CASCADE,
    posicao VARCHAR(50) DEFAULT 'Jogador',
    data_entrada DATE DEFAULT CURRENT_DATE,
    data_saida DATE,
    ativo BOOLEAN DEFAULT true,
    UNIQUE(time_id, jogador_id)
);

-- Tabela de torneios
CREATE TABLE torneios (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    premiacao TEXT,
    regulamento TEXT,
    data_inicio TIMESTAMP NOT NULL,
    data_fim TIMESTAMP NOT NULL,
    local_evento VARCHAR(255),
    pais_evento VARCHAR(100),
    organizador VARCHAR(255),
    patrocinadores TEXT[],
    status VARCHAR(50) DEFAULT 'agendado' CHECK (status IN ('agendado', 'em_andamento', 'finalizado', 'cancelado')),
    formato VARCHAR(50) DEFAULT 'eliminacao_simples',
    max_times INTEGER DEFAULT 16,
    configuracao JSONB NOT NULL DEFAULT '{}',
    imagem_banner TEXT,
    stream_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de grupos
CREATE TABLE grupos (
    id SERIAL PRIMARY KEY,
    torneio_id INTEGER REFERENCES torneios(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    ordem INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de relacionamento grupo-times
CREATE TABLE grupo_times (
    id SERIAL PRIMARY KEY,
    grupo_id INTEGER REFERENCES grupos(id) ON DELETE CASCADE,
    time_id INTEGER REFERENCES times(id) ON DELETE CASCADE,
    pontos INTEGER DEFAULT 0,
    vitorias INTEGER DEFAULT 0,
    derrotas INTEGER DEFAULT 0,
    rounds_favor INTEGER DEFAULT 0,
    rounds_contra INTEGER DEFAULT 0,
    UNIQUE(grupo_id, time_id)
);

-- Tabela de partidas
CREATE TABLE partidas (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE,
    torneio_id INTEGER REFERENCES torneios(id) ON DELETE CASCADE,
    grupo_id INTEGER REFERENCES grupos(id) ON DELETE SET NULL,
    time_a_id INTEGER REFERENCES times(id),
    time_b_id INTEGER REFERENCES times(id),
    mapa VARCHAR(100),
    fase VARCHAR(50) DEFAULT 'grupos' CHECK (fase IN ('grupos', 'oitavas', 'quartas', 'semifinal', 'terceiro_lugar', 'final')),
    round_number INTEGER DEFAULT 1,
    position_number INTEGER DEFAULT 1,
    inicio_previsto TIMESTAMP NOT NULL,
    inicio_real TIMESTAMP,
    fim_real TIMESTAMP,
    status VARCHAR(50) DEFAULT 'agendada' CHECK (status IN ('agendada', 'ao_vivo', 'pausada', 'finalizada', 'cancelada', 'adiada')),
    placar_time_a INTEGER DEFAULT 0,
    placar_time_b INTEGER DEFAULT 0,
    overtime BOOLEAN DEFAULT false,
    rounds_overtime INTEGER DEFAULT 0,
    vencedor_id INTEGER REFERENCES times(id),
    hltv_demo_url TEXT,
    stream_url TEXT,
    logs TEXT[],
    estatisticas JSONB DEFAULT '{}',
    observacoes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de templates
CREATE TABLE templates_torneio (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    categoria VARCHAR(100) DEFAULT 'Geral',
    configuracao JSONB NOT NULL DEFAULT '{}',
    publico BOOLEAN DEFAULT true,
    criado_por VARCHAR(255),
    versao VARCHAR(20) DEFAULT '1.0',
    tags TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar índices para performance
CREATE INDEX idx_torneios_status ON torneios(status);
CREATE INDEX idx_torneios_data ON torneios(data_inicio, data_fim);
CREATE INDEX idx_partidas_torneio ON partidas(torneio_id);
CREATE INDEX idx_partidas_status ON partidas(status);
CREATE INDEX idx_partidas_fase ON partidas(fase);
CREATE INDEX idx_partidas_data ON partidas(inicio_previsto);
CREATE INDEX idx_grupos_torneio ON grupos(torneio_id);
CREATE INDEX idx_jogadores_tipo ON jogadores(tipo);
CREATE INDEX idx_jogadores_nacionalidade ON jogadores(nacionalidade);
CREATE INDEX idx_jogadores_ativo ON jogadores(ativo);
CREATE INDEX idx_times_pais ON times(pais);
CREATE INDEX idx_times_ativo ON times(ativo);
CREATE INDEX idx_time_jogadores_ativo ON time_jogadores(ativo);
CREATE INDEX idx_templates_categoria ON templates_torneio(categoria);
CREATE INDEX idx_templates_publico ON templates_torneio(publico);

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_torneios_updated_at BEFORE UPDATE ON torneios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_times_updated_at BEFORE UPDATE ON times FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_jogadores_updated_at BEFORE UPDATE ON jogadores FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_partidas_updated_at BEFORE UPDATE ON partidas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON templates_torneio FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Função para calcular estatísticas de grupo
CREATE OR REPLACE FUNCTION atualizar_estatisticas_grupo()
RETURNS TRIGGER AS $$
BEGIN
    -- Atualizar estatísticas do time A
    UPDATE grupo_times SET
        vitorias = (
            SELECT COUNT(*) FROM partidas 
            WHERE (time_a_id = NEW.time_a_id OR time_b_id = NEW.time_a_id) 
            AND vencedor_id = NEW.time_a_id 
            AND grupo_id = NEW.grupo_id
        ),
        derrotas = (
            SELECT COUNT(*) FROM partidas 
            WHERE (time_a_id = NEW.time_a_id OR time_b_id = NEW.time_a_id) 
            AND vencedor_id != NEW.time_a_id 
            AND status = 'finalizada'
            AND grupo_id = NEW.grupo_id
        ),
        rounds_favor = (
            SELECT COALESCE(SUM(
                CASE 
                    WHEN time_a_id = NEW.time_a_id THEN placar_time_a 
                    ELSE placar_time_b 
                END
            ), 0) FROM partidas 
            WHERE (time_a_id = NEW.time_a_id OR time_b_id = NEW.time_a_id) 
            AND status = 'finalizada'
            AND grupo_id = NEW.grupo_id
        ),
        rounds_contra = (
            SELECT COALESCE(SUM(
                CASE 
                    WHEN time_a_id = NEW.time_a_id THEN placar_time_b 
                    ELSE placar_time_a 
                END
            ), 0) FROM partidas 
            WHERE (time_a_id = NEW.time_a_id OR time_b_id = NEW.time_a_id) 
            AND status = 'finalizada'
            AND grupo_id = NEW.grupo_id
        )
    WHERE grupo_id = NEW.grupo_id AND time_id = NEW.time_a_id;

    -- Atualizar estatísticas do time B
    UPDATE grupo_times SET
        vitorias = (
            SELECT COUNT(*) FROM partidas 
            WHERE (time_a_id = NEW.time_b_id OR time_b_id = NEW.time_b_id) 
            AND vencedor_id = NEW.time_b_id 
            AND grupo_id = NEW.grupo_id
        ),
        derrotas = (
            SELECT COUNT(*) FROM partidas 
            WHERE (time_a_id = NEW.time_b_id OR time_b_id = NEW.time_b_id) 
            AND vencedor_id != NEW.time_b_id 
            AND status = 'finalizada'
            AND grupo_id = NEW.grupo_id
        ),
        rounds_favor = (
            SELECT COALESCE(SUM(
                CASE 
                    WHEN time_a_id = NEW.time_b_id THEN placar_time_a 
                    ELSE placar_time_b 
                END
            ), 0) FROM partidas 
            WHERE (time_a_id = NEW.time_b_id OR time_b_id = NEW.time_b_id) 
            AND status = 'finalizada'
            AND grupo_id = NEW.grupo_id
        ),
        rounds_contra = (
            SELECT COALESCE(SUM(
                CASE 
                    WHEN time_a_id = NEW.time_b_id THEN placar_time_b 
                    ELSE placar_time_a 
                END
            ), 0) FROM partidas 
            WHERE (time_a_id = NEW.time_b_id OR time_b_id = NEW.time_b_id) 
            AND status = 'finalizada'
            AND grupo_id = NEW.grupo_id
        )
    WHERE grupo_id = NEW.grupo_id AND time_id = NEW.time_b_id;

    -- Calcular pontos (3 por vitória, 1 por empate)
    UPDATE grupo_times SET pontos = (vitorias * 3) WHERE grupo_id = NEW.grupo_id;

    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar estatísticas quando partida é finalizada
CREATE TRIGGER trigger_atualizar_estatisticas_grupo 
    AFTER UPDATE ON partidas 
    FOR EACH ROW 
    WHEN (NEW.status = 'finalizada' AND OLD.status != 'finalizada')
    EXECUTE FUNCTION atualizar_estatisticas_grupo();
