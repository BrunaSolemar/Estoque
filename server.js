const express = require('express');
const path = require('path');
const db = require('./database');
const app = express();
const port = 3001;

// Middleware para permitir envio de JSON
app.use(express.json());

// Servir arquivos estáticos da pasta atual (exemplo: HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Rota para listar alimentos
app.get('/alimentos', (req, res) => {
  db.all('SELECT * FROM alimentos', (err, rows) => {
    if (err) {
      res.status(500).send("Erro ao buscar alimentos");
    } else {
      res.json(rows);
    }
  });
});

// Rota para atualizar alimento
app.put('/alimentos/:id', (req, res) => {
  const { quantidade, peguei, valor_unitario, valor_atual } = req.body;
  const id = req.params.id;

  db.run(`
    UPDATE alimentos 
    SET quantidade = ?, peguei = ?, valor_unitario = ?, valor_atual = ? 
    WHERE id = ?
  `, [quantidade, peguei, valor_unitario, valor_atual, id], function(err) {
    if (err) {
      res.status(500).send("Erro ao atualizar o alimento");
    } else {
      res.sendStatus(200);
    }
  });
});

// Rota para adicionar alimento
app.post('/alimentos', (req, res) => {
  const { nome, quantidade, valor_unitario, valor_atual } = req.body;
  db.run(`
    INSERT INTO alimentos (nome, quantidade, valor_unitario, valor_atual) 
    VALUES (?, ?, ?, ?)
  `, [nome, quantidade, valor_unitario, valor_atual], function(err) {
    if (err) {
      res.status(500).send("Erro ao adicionar o alimento");
    } else {
      res.status(201).send("Alimento adicionado com sucesso");
    }
  });
});

// Rota para deletar um alimento
app.delete('/alimentos/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM alimentos WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).send("Erro ao deletar o alimento");
    } else {
      res.sendStatus(200);
    }
  });
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
