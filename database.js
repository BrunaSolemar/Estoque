const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Caminho para o arquivo de banco de dados
const dbPath = path.resolve(__dirname, 'estoque.db');

// Conectar ao banco de dados SQLite
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
  } else {
    console.log('Conectado ao banco de dados SQLite.');
  }
});

// Criar a tabela de alimentos se não existir
db.run(`
  CREATE TABLE IF NOT EXISTS alimentos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    quantidade INTEGER NOT NULL,
    peguei INTEGER NOT NULL,
    valor_unitario REAL NOT NULL,
    valor_atual REAL NOT NULL
  )
`, (err) => {
  if (err) {
    console.error('Erro ao criar a tabela de alimentos:', err);
  } else {
    console.log('Tabela de alimentos criada ou já existe.');
  }
});

module.exports = db;
