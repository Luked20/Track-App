const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  user: 'postgres',
  password: 'lucas2006',
  host: 'localhost',
  port: 5432,
  database: 'Track'
});

async function initDatabase() {
  try {
    console.log('Iniciando inicialização do banco de dados...');
    
    // Lê o arquivo init.sql
    const initSql = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8');
    
    // Executa cada comando SQL separadamente
    const commands = initSql.split(';').filter(cmd => cmd.trim());
    
    for (const command of commands) {
      if (command.trim()) {
        console.log('Executando comando:', command.trim());
        await pool.query(command);
      }
    }
    
    console.log('Banco de dados inicializado com sucesso!');
  } catch (err) {
    console.error('Erro ao inicializar banco de dados:', err);
  } finally {
    await pool.end();
  }
}

initDatabase(); 