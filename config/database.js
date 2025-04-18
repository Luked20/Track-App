const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: 'postgres',
  password: 'lucas2006',
  host: 'localhost',
  port: 5432,
  database: 'Track'
});

// Adicionando logs para conexão
pool.on('connect', () => {
  console.log('Conexão com o banco de dados estabelecida');
});

pool.on('error', (err) => {
  console.error('Erro inesperado na conexão com o banco:', err);
});

module.exports = {
  query: async (text, params) => {
    try {
      console.log('Executando query:', text);
      console.log('Parâmetros:', params);
      const result = await pool.query(text, params);
      return result;
    } catch (err) {
      console.error('Erro ao executar query:', err);
      throw err;
    }
  },
  pool
}; 