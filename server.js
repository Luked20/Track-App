const express = require('express');
const cors = require('cors');
const { query } = require('./config/database');
const moment = require('moment');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rotas para Categorias
app.get('/api/categorias', async (req, res) => {
  try {
    const result = await query('SELECT * FROM categorias');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rotas para Hábitos
app.post('/api/habitos', async (req, res) => {
  const { nome, frequencia, dias_semana, hora_notificacao, categoria_id, meta_dias } = req.body;
  try {
    const result = await query(
      'INSERT INTO habitos (nome, frequencia, dias_semana, hora_notificacao, categoria_id, meta_dias) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [nome, frequencia, dias_semana, hora_notificacao, categoria_id, meta_dias]
    );
    
    // Cria registro inicial de estatísticas
    await query(
      'INSERT INTO estatisticas (habito_id, dias_consecutivos, melhor_sequencia, total_dias) VALUES ($1, 0, 0, 0)',
      [result.rows[0].id]
    );
    
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/habitos', async (req, res) => {
  console.log('Iniciando busca de hábitos...');
  try {
    // Primeiro, verifica se a tabela habitos existe
    console.log('Verificando existência da tabela habitos...');
    const checkTable = await query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'habitos'
      );
    `);

    console.log('Resultado da verificação da tabela:', checkTable.rows[0]);

    if (!checkTable.rows[0].exists) {
      console.error('Tabela de hábitos não encontrada');
      throw new Error('Tabela de hábitos não encontrada');
    }

    // Busca os hábitos com suas estatísticas
    console.log('Buscando hábitos e estatísticas...');
    const result = await query(`
      SELECT 
        h.id,
        h.nome,
        h.frequencia,
        h.dias_semana,
        h.hora_notificacao,
        h.categoria_id,
        h.meta_dias,
        h.data_criacao,
        COALESCE(e.dias_consecutivos, 0) as dias_consecutivos,
        COALESCE(e.total_dias, 0) as total_dias
      FROM habitos h
      LEFT JOIN estatisticas e ON h.id = e.habito_id
      ORDER BY h.data_criacao DESC
    `);

    console.log('Número de hábitos encontrados:', result.rows.length);
    console.log('Primeiro hábito (se existir):', result.rows[0]);

    res.json(result.rows);
  } catch (err) {
    console.error('Erro detalhado ao buscar hábitos:', err);
    console.error('Stack trace:', err.stack);
    res.status(500).json({ 
      error: 'Erro ao carregar hábitos',
      details: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});

// Rota para marcar hábito como feito
app.post('/api/habitos/:id/registro', async (req, res) => {
  const { id } = req.params;
  const hoje = moment().format('YYYY-MM-DD');
  
  try {
    // Verifica se já existe registro para hoje
    const check = await query(
      'SELECT * FROM registros_habitos WHERE habito_id = $1 AND data_registro = $2',
      [id, hoje]
    );

    if (check.rows.length > 0) {
      // Atualiza registro existente
      const result = await query(
        'UPDATE registros_habitos SET status = $1 WHERE habito_id = $2 AND data_registro = $3 RETURNING *',
        [true, id, hoje]
      );
      
      // Atualiza estatísticas
      await query(
        `UPDATE estatisticas 
         SET total_dias = total_dias + 1,
             dias_consecutivos = dias_consecutivos + 1,
             melhor_sequencia = GREATEST(melhor_sequencia, dias_consecutivos + 1)
         WHERE habito_id = $1`,
        [id]
      );
      
      res.json(result.rows[0]);
    } else {
      // Cria novo registro
      const result = await query(
        'INSERT INTO registros_habitos (habito_id, data_registro, status) VALUES ($1, $2, $3) RETURNING *',
        [id, hoje, true]
      );
      
      // Atualiza estatísticas
      await query(
        `UPDATE estatisticas 
         SET total_dias = total_dias + 1,
             dias_consecutivos = dias_consecutivos + 1,
             melhor_sequencia = GREATEST(melhor_sequencia, dias_consecutivos + 1)
         WHERE habito_id = $1`,
        [id]
      );
      
      res.json(result.rows[0]);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rota para obter estatísticas
app.get('/api/habitos/:id/estatisticas', async (req, res) => {
  const { id } = req.params;
  try {
    // Verifica se existe registro na tabela estatisticas
    const check = await query(
      'SELECT * FROM estatisticas WHERE habito_id = $1',
      [id]
    );
    
    if (check.rows.length === 0) {
      // Se não existir, cria um novo registro
      const result = await query(
        'INSERT INTO estatisticas (habito_id, dias_consecutivos, melhor_sequencia, total_dias) VALUES ($1, 0, 0, 0) RETURNING *',
        [id]
      );
      res.json(result.rows[0]);
    } else {
      res.json(check.rows[0]);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
}); 