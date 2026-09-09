import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';

const app = express();
const porta = 3000;

app.use(cors());
app.use(express.json());

const banco = new sqlite3.Database('./backend/noc_database.sqlite', (erro) => {
  if (erro) {
    console.error('Erro ao abrir o banco:', erro.message);
    return;
  }

  console.log('Banco conectado com sucesso.');
});

app.get('/api/dados', (requisicao, resposta) => {
  const dados = {
    infraestrutura: [],
    frota: [],
    noc: {},
  };

  banco.all(
    'SELECT * FROM infraestrutura WHERE id > 0',
    [],
    (erro, links) => {
      if (erro) {
        return resposta.status(500).json({ erro: erro.message });
      }

      dados.infraestrutura = links;

      banco.get(
        'SELECT latitude, longitude FROM infraestrutura WHERE id = 0',
        [],
        (erro, noc) => {
          if (!erro && noc) {
            dados.noc = noc;
          }

          banco.all('SELECT * FROM frota', [], (erro, veiculos) => {
            if (erro) {
              return resposta.status(500).json({ erro: erro.message });
            }

            dados.frota = veiculos;

            return resposta.json(dados);
          });
        },
      );
    },
  );
});

app.put('/api/telemetria/:id', (requisicao, resposta) => {
  const { id } = requisicao.params;
  const { latitude, longitude, vel } = requisicao.body;

  const comando = `
    UPDATE frota
    SET
      latitude = ?,
      longitude = ?,
      vel = ?,
      ultima_atualizacao = CURRENT_TIMESTAMP
    WHERE id = ?
  `;

  banco.run(comando, [latitude, longitude, vel, id], function (erro) {
    if (erro) {
      return resposta.status(500).json({ erro: erro.message });
    }

    return resposta.json({
      mensagem: 'Telemetria atualizada com sucesso.',
      linhasAfetadas: this.changes,
    });
  });
});

app.listen(porta, () => {
  console.log(`API rodando em: http://localhost:${porta}`);
});