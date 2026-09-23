import sqlite3 from 'sqlite3';
import path from 'path';
import {
  fileURLToPath
} from 'url';

const __filename =
  fileURLToPath(
    import.meta.url
  );

const __dirname =
  path.dirname(
    __filename
  );

const sqlite =
  sqlite3.verbose();

const dbPath =
  path.resolve(
    __dirname,
    '../../noc_bigdata.sqlite'
  );

const db =
  new sqlite.Database(
    dbPath
  );


// ==========================================
// HELPERS
// ==========================================

function run(
  sql,
  params = []
) {
  return new Promise(
    (resolve, reject) => {

      db.run(
        sql,
        params,
        function (error) {

          if (error) {
            reject(error);
            return;
          }

          resolve({
            changes:
              this.changes,

            lastID:
              this.lastID,
          });
        }
      );
    }
  );
}


function all(
  sql,
  params = []
) {
  return new Promise(
    (resolve, reject) => {

      db.all(
        sql,
        params,
        (
          error,
          rows
        ) => {

          if (error) {
            reject(error);
            return;
          }

          resolve(rows);
        }
      );
    }
  );
}

function get(
  sql,
  params = []
) {
  return new Promise(
    (resolve, reject) => {
      db.get(
        sql,
        params,
        (error, row) => {
          if (error) {
            reject(error);
            return;
          }

          resolve(row);
        }
      );
    }
  );
}

// ==========================================
// MIGRAÇÃO DA TABELA LINKS ANTIGA
// ==========================================

async function recriarTabelaLinksLegada() {
  const colunas =
    await all(
      'PRAGMA table_info(links)'
    );

  // Se a tabela ainda não existir,
  // não existe nada para migrar.
  if (colunas.length === 0) {
    return;
  }

  // A versão antiga possuía
  // a coluna "tipo".
  const colunaTipo =
    colunas.find(
      (coluna) =>
        coluna.name === 'tipo'
    );

  // Se não possui "tipo",
  // já está no formato novo.
  if (!colunaTipo) {
    return;
  }

  console.log(
    '🔄 Estrutura antiga da tabela links encontrada.'
  );

  console.log(
    '🔧 Recriando somente a tabela links...'
  );

  // IMPORTANTE:
  // não toca na tabela frota.
  await run(`
    DROP TABLE IF EXISTS links
  `);

  console.log(
    '✅ Tabela links antiga removida.'
  );
}

async function popularFrotaSeVazia() {
  const resultado =
    await get(`
      SELECT COUNT(*) AS total
      FROM frota
    `);

  if (
    Number(resultado.total) > 0
  ) {
    console.log(
      `✅ Frota existente: ${resultado.total} veículos.`
    );

    return;
  }

  console.log(
    '🚚 Banco vazio. Gerando 100.000 veículos...'
  );

  const categorias = [
    'Ônibus',
    'Caminhão',
    'Moto',
    'Carro',
    'Caminhonete',
    'Van',
    'SUV',
    'Esportivo',
    'Trator',
    'Ambulância',
  ];

  await new Promise(
    (resolve, reject) => {
      db.serialize(() => {
        db.run(
          'BEGIN TRANSACTION',
          (beginError) => {
            if (beginError) {
              reject(beginError);
              return;
            }

            const statement =
              db.prepare(`
                INSERT INTO frota
                (
                  id,
                  modelo,
                  tipo,
                  vel,
                  latitude,
                  longitude
                )
                VALUES (?, ?, ?, ?, ?, ?)
              `);

            let insertError =
              null;

            for (
              let i = 1;
              i <= 100000;
              i++
            ) {
              const categoria =
                categorias[
                  (i - 1) %
                  categorias.length
                ];

              const modelo =
                `${categoria} Modelo ${
                  (
                    (i - 1) %
                    20
                  ) + 1
                }`;

              const velocidade =
                String(
                  30 +
                  (
                    i * 7
                  ) %
                  91
                );

              const latitude =
                (
                  -23 -
                  (
                    (
                      i * 37
                    ) %
                    10000
                  ) /
                  10000
                ).toFixed(6);

              const longitude =
                (
                  -46 -
                  (
                    (
                      i * 53
                    ) %
                    10000
                  ) /
                  10000
                ).toFixed(6);

              statement.run(
                [
                  `V-${String(i)
                    .padStart(
                      6,
                      '0'
                    )}`,

                  modelo,

                  categoria,

                  velocidade,

                  latitude,

                  longitude,
                ],
                (error) => {
                  if (
                    error &&
                    !insertError
                  ) {
                    insertError =
                      error;
                  }
                }
              );
            }

            statement.finalize(
              (finalizeError) => {
                const error =
                  finalizeError ||
                  insertError;

                if (error) {
                  db.run(
                    'ROLLBACK',
                    () => {
                      reject(
                        error
                      );
                    }
                  );

                  return;
                }

                db.run(
                  'COMMIT',
                  (commitError) => {
                    if (
                      commitError
                    ) {
                      reject(
                        commitError
                      );

                      return;
                    }

                    console.log(
                      '✅ 100.000 veículos inseridos no SQLite.'
                    );

                    resolve();
                  }
                );
              }
            );
          }
        );
      });
    }
  );

  await run(`
    CREATE INDEX
    IF NOT EXISTS
    idx_frota_tipo
    ON frota(tipo)
  `);
}

// ==========================================
// INICIALIZAÇÃO DO BANCO
// ==========================================

async function inicializarBanco() {

  // ========================================
  // FROTA
  // ========================================

  await run(`
    CREATE TABLE IF NOT EXISTS frota (
      id TEXT PRIMARY KEY,

      modelo TEXT,

      tipo TEXT,

      vel TEXT,

      latitude TEXT,

      longitude TEXT,

      ultima_atualizacao
        DATETIME
        DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await run(`
  CREATE TABLE IF NOT EXISTS frota (
    id TEXT PRIMARY KEY,

    modelo TEXT,

    tipo TEXT,

    vel TEXT,

    latitude TEXT,

    longitude TEXT,

    ultima_atualizacao
      DATETIME
      DEFAULT CURRENT_TIMESTAMP
  )
`);

await popularFrotaSeVazia();

await recriarTabelaLinksLegada();

  // ========================================
  // VERIFICA VERSÃO ANTIGA DOS LINKS
  // ========================================

  await recriarTabelaLinksLegada();


  // ========================================
  // LINKS
  // ========================================

  await run(`
    CREATE TABLE IF NOT EXISTS links (
      id INTEGER PRIMARY KEY,

      nome TEXT NOT NULL,

      target TEXT NOT NULL,

      latencia_ms INTEGER
        NOT NULL
        DEFAULT 0,

      trafego_percentual INTEGER
        NOT NULL
        DEFAULT 0,

      online INTEGER
        NOT NULL
        DEFAULT 1,

      ultima_atualizacao
        DATETIME
        DEFAULT CURRENT_TIMESTAMP
    )
  `);


  // ========================================
  // DADOS DOS 5 LINKS
  // ========================================

  const linksIniciais = [

    {
      id: 1,

      nome:
        'Link VSAT (Hub Principal)',

      target:
        'Satélite Star One D2',

      latencia:
        582,

      trafego:
        78,
    },

    {
      id: 2,

      nome:
        'Link VSAT (BGAN Backup)',

      target:
        'Satélite Inmarsat',

      latencia:
        850,

      trafego:
        76,
    },

    {
      id: 3,

      nome:
        'Roteamento OSPF',

      target:
        'Core Interno (10.0.0.1)',

      latencia:
        2,

      trafego:
        91,
    },

    {
      id: 4,

      nome:
        'Sessão BGP',

      target:
        'Operadora AS-1042',

      latencia:
        12,

      trafego:
        84,
    },

    {
      id: 5,

      nome:
        'Link LTE-Móvel',

      target:
        'Antena Celular ERB',

      latencia:
        45,

      trafego:
        92,
    },

  ];


  for (
    const link
    of linksIniciais
  ) {

    await run(
      `
        INSERT INTO links
        (
          id,
          nome,
          target,
          latencia_ms,
          trafego_percentual,
          online
        )

        VALUES
        (?, ?, ?, ?, ?, 1)

        ON CONFLICT(id)
        DO UPDATE SET

          nome =
            excluded.nome,

          target =
            excluded.target,

          latencia_ms =
            excluded.latencia_ms,

          trafego_percentual =
            excluded.trafego_percentual
      `,
      [
        link.id,

        link.nome,

        link.target,

        link.latencia,

        link.trafego,
      ]
    );
  }


  // ========================================
  // INCIDENTES
  // ========================================

  await run(`
    CREATE TABLE IF NOT EXISTS incidentes (
      id INTEGER
        PRIMARY KEY
        AUTOINCREMENT,

      nivel TEXT
        NOT NULL,

      mensagem TEXT
        NOT NULL,

      link_id INTEGER,

      criado_em
        DATETIME
        DEFAULT CURRENT_TIMESTAMP,

      FOREIGN KEY (
        link_id
      )
      REFERENCES links(id)
    )
  `);


  // ========================================
  // LOGS DA API
  // ========================================

  await run(`
    CREATE TABLE IF NOT EXISTS api_logs (
      id INTEGER
        PRIMARY KEY
        AUTOINCREMENT,

      metodo TEXT
        NOT NULL,

      endpoint TEXT
        NOT NULL,

      status INTEGER
        NOT NULL,

      latencia_ms INTEGER
        NOT NULL,

      criado_em
        DATETIME
        DEFAULT CURRENT_TIMESTAMP
    )
  `);


  // ========================================
  // HISTÓRICO DE TELEMETRIA
  // ========================================

  await run(`
    CREATE TABLE IF NOT EXISTS
      telemetria_historico
    (
      id INTEGER
        PRIMARY KEY
        AUTOINCREMENT,

      velocidade_media REAL
        NOT NULL,

      criado_em
        DATETIME
        DEFAULT CURRENT_TIMESTAMP
    )
  `);


  console.log(
    '✅ SQLite conectado e estrutura validada.'
  );
}


// ==========================================
// INICIALIZA O BANCO ANTES DE EXPORTAR
// ==========================================

await inicializarBanco();

export default db;