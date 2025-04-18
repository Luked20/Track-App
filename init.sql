-- Criar tabela de Categorias
CREATE TABLE IF NOT EXISTS categorias (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL
);

-- Criar tabela de Hábitos
CREATE TABLE IF NOT EXISTS habitos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    frequencia VARCHAR(20) NOT NULL,
    dias_semana VARCHAR(50),
    hora_notificacao TIME,
    categoria_id INTEGER REFERENCES categorias(id),
    meta_dias INTEGER,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela de Registros de Hábitos
CREATE TABLE IF NOT EXISTS registros_habitos (
    id SERIAL PRIMARY KEY,
    habito_id INTEGER REFERENCES habitos(id),
    data_registro DATE NOT NULL,
    status BOOLEAN DEFAULT FALSE
);

-- Criar tabela de Estatísticas
CREATE TABLE IF NOT EXISTS estatisticas (
    id SERIAL PRIMARY KEY,
    habito_id INTEGER REFERENCES habitos(id),
    dias_consecutivos INTEGER DEFAULT 0,
    melhor_sequencia INTEGER DEFAULT 0,
    total_dias INTEGER DEFAULT 0
);

-- Inserir algumas categorias iniciais
INSERT INTO categorias (nome) VALUES 
('Saúde'),
('Estudo'),
('Trabalho'),
('Lazer'),
('Fitness');