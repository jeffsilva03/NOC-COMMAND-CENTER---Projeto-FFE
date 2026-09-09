import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

// Como estamos usando ES Modules, precisamos criar o equivalente ao __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ativa recursos adicionais do sqlite3
const sqlite = sqlite3.verbose();

// Define onde o banco será criado
const dbPath = path.resolve(__dirname, '../../noc_bigdata.sqlite');

// Abre/cria o banco de dados
const db = new sqlite.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.message);
  } else {
    console.log('Conexão estabelecida com o SQLite.');
  }
});

// Cria a tabela frota caso ela ainda não exista
db.run(`
  CREATE TABLE IF NOT EXISTS frota (
    id TEXT PRIMARY KEY,
    modelo TEXT,
    tipo TEXT,
    vel TEXT,
    latitude TEXT,
    longitude TEXT,
    ultima_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Exporta a conexão para outros arquivos utilizarem
export default db;