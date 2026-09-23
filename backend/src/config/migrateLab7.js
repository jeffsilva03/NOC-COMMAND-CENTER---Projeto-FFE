import db from './database.js';

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) {
        reject(err);
        return;
      }

      resolve({
        lastID: this.lastID,
        changes: this.changes,
      });
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(rows);
    });
  });
}

async function migrate() {
  try {
    console.log('🔄 Iniciando migração do Lab 7...');

    // ========================================
    // NOVO CAMPO NA FROTA
    // ========================================

    const colunasFrota = await all(
      'PRAGMA table_info(frota)'
    );

    const possuiEnergia =
      colunasFrota.some(
        (coluna) =>
          coluna.name === 'energia'
      );

    if (!possuiEnergia) {
      await run(`
        ALTER TABLE frota
        ADD COLUMN energia INTEGER
      `);

      // Preenche combustível/bateria
      // dos veículos já existentes.
      await run(`
        UPDATE frota
        SET energia =
          70 + ABS(RANDOM() % 31)
        WHERE energia IS NULL
      `);

      console.log(
        '✅ Campo energia adicionado à frota.'
      );
    }

    // ========================================
    // LINKS DE COMUNICAÇÃO
    // ========================================

    await run(`
      CREATE TABLE IF NOT EXISTS links (
        id INTEGER PRIMARY KEY,
        nome TEXT NOT NULL,
        tipo TEXT NOT NULL,
        destino TEXT NOT NULL,
        latencia_ms INTEGER NOT NULL,
        trafego_percent INTEGER NOT NULL,
        online INTEGER NOT NULL DEFAULT 1,
        ultima_atualizacao DATETIME
          DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const links = [
      [
        1,
        'Link VSAT (Hub Principal)',
        'VSAT',
        'Satélite Star One D2',
        580,
        78,
      ],

      [
        2,
        'Link VSAT (BGAN Backup)',
        'BGAN',
        'Satélite Inmarsat',
        850,
        76,
      ],

      [
        3,
        'Roteamento OSPF',
        'OSPF',
        'Core Interno (10.0.0.1)',
        2,
        91,
      ],

      [
        4,
        'Sessão BGP',
        'BGP',
        'Operadora AS-1042',
        12,
        84,
      ],

      [
        5,
        'Link LTE-Móvel',
        'LTE',
        'Antena Celular ERB',
        45,
        92,
      ],
    ];

    for (const link of links) {
      await run(
        `
          INSERT OR IGNORE INTO links (
            id,
            nome,
            tipo,
            destino,
            latencia_ms,
            trafego_percent,
            online
          )
          VALUES (?, ?, ?, ?, ?, ?, 1)
        `,
        link
      );
    }

    // ========================================
    // INCIDENTES
    // ========================================

    await run(`
      CREATE TABLE IF NOT EXISTS incidentes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nivel TEXT NOT NULL,
        mensagem TEXT NOT NULL,
        link_id INTEGER,
        criado_em DATETIME
          DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (link_id)
          REFERENCES links(id)
      )
    `);

    // ========================================
    // LOGS REAIS DA API
    // ========================================

    await run(`
      CREATE TABLE IF NOT EXISTS api_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        metodo TEXT NOT NULL,
        endpoint TEXT NOT NULL,
        status INTEGER NOT NULL,
        latencia_ms INTEGER NOT NULL,
        criado_em DATETIME
          DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // ========================================
    // HISTÓRICO DE TELEMETRIA
    // ========================================

    await run(`
      CREATE TABLE IF NOT EXISTS telemetry_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        velocidade_media REAL NOT NULL,
        veiculos_online INTEGER NOT NULL,
        alertas INTEGER NOT NULL,
        criado_em DATETIME
          DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // ========================================
    // ÍNDICES
    // ========================================

    await run(`
      CREATE INDEX IF NOT EXISTS
      idx_incidentes_data
      ON incidentes(criado_em)
    `);

    await run(`
      CREATE INDEX IF NOT EXISTS
      idx_logs_data
      ON api_logs(criado_em)
    `);

    await run(`
      CREATE INDEX IF NOT EXISTS
      idx_telemetry_data
      ON telemetry_history(criado_em)
    `);

    console.log(
      '✅ Migração Lab 7 concluída.'
    );

  } catch (error) {
    console.error(
      '❌ Erro na migração:',
      error
    );
  } finally {
    db.close();
  }
}

migrate();