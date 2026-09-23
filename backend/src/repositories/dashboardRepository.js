import db from '../config/database.js';

class DashboardRepository {

  // =====================================
  // RESUMO DA FROTA
  // =====================================

  obterResumoFrota() {
    return new Promise(
      (resolve, reject) => {

        const query = `
          SELECT
            COUNT(*) AS total,

            ROUND(
              AVG(
                CAST(vel AS REAL)
              ),
              1
            ) AS velocidade_media

          FROM frota
        `;

        db.get(
          query,
          [],
          (err, row) => {

            if (err) {
              reject(err);
              return;
            }

            resolve(row);
          }
        );
      }
    );
  }


  // =====================================
  // DADOS POR CATEGORIA
  // =====================================

  obterCategorias() {
    return new Promise(
      (resolve, reject) => {

        const query = `
          SELECT
            tipo,

            COUNT(*) AS total,

            ROUND(
              AVG(
                CAST(vel AS REAL)
              ),
              1
            ) AS velocidade_media

          FROM frota

          GROUP BY tipo

          ORDER BY tipo
        `;

        db.all(
          query,
          [],
          (err, rows) => {

            if (err) {
              reject(err);
              return;
            }

            resolve(rows);
          }
        );
      }
    );
  }


  // =====================================
  // LINKS
  // =====================================

  obterLinks() {
    return new Promise(
      (resolve, reject) => {

        db.all(
          `
            SELECT *
            FROM links
            ORDER BY id
          `,
          [],
          (err, rows) => {

            if (err) {
              reject(err);
              return;
            }

            resolve(rows);
          }
        );
      }
    );
  }


  buscarLink(id) {
    return new Promise(
      (resolve, reject) => {

        db.get(
          `
            SELECT *
            FROM links
            WHERE id = ?
          `,
          [id],
          (err, row) => {

            if (err) {
              reject(err);
              return;
            }

            resolve(row);
          }
        );
      }
    );
  }


  atualizarLink(
    id,
    online
  ) {
    return new Promise(
      (resolve, reject) => {

        db.run(
          `
            UPDATE links

            SET
              online = ?,

              ultima_atualizacao =
                CURRENT_TIMESTAMP

            WHERE id = ?
          `,
          [
            online ? 1 : 0,
            id
          ],
          function (err) {

            if (err) {
              reject(err);
              return;
            }

            resolve(
              this.changes
            );
          }
        );
      }
    );
  }


  restaurarTodosLinks() {
    return new Promise(
      (resolve, reject) => {

        db.run(
          `
            UPDATE links

            SET
              online = 1,

              ultima_atualizacao =
                CURRENT_TIMESTAMP
          `,
          [],
          function (err) {

            if (err) {
              reject(err);
              return;
            }

            resolve(
              this.changes
            );
          }
        );
      }
    );
  }


  definirLinksAlternados() {
    return new Promise(
      (resolve, reject) => {

        db.run(
          `
            UPDATE links

            SET
              online =
                CASE
                  WHEN id IN (2, 4)
                    THEN 0
                  ELSE 1
                END,

              ultima_atualizacao =
                CURRENT_TIMESTAMP
          `,
          [],
          function (err) {

            if (err) {
              reject(err);
              return;
            }

            resolve(
              this.changes
            );
          }
        );
      }
    );
  }


  // =====================================
  // INCIDENTES
  // =====================================

  registrarIncidente(
    nivel,
    mensagem,
    linkId = null
  ) {
    return new Promise(
      (resolve, reject) => {

        db.run(
          `
            INSERT INTO incidentes
            (
              nivel,
              mensagem,
              link_id
            )

            VALUES (?, ?, ?)
          `,
          [
            nivel,
            mensagem,
            linkId
          ],
          function (err) {

            if (err) {
              reject(err);
              return;
            }

            resolve(
              this.lastID
            );
          }
        );
      }
    );
  }


  obterIncidentes(
    limite = 20
  ) {
    return new Promise(
      (resolve, reject) => {

        db.all(
          `
            SELECT
              i.*,

              l.nome AS link_nome

            FROM incidentes i

            LEFT JOIN links l
              ON l.id =
                i.link_id

            ORDER BY
              i.id DESC

            LIMIT ?
          `,
          [limite],
          (err, rows) => {

            if (err) {
              reject(err);
              return;
            }

            resolve(rows);
          }
        );
      }
    );
  }


  // =====================================
  // LOGS
  // =====================================

  registrarLog(
    metodo,
    endpoint,
    status,
    latenciaMs
  ) {
    return new Promise(
      (resolve, reject) => {

        db.run(
          `
            INSERT INTO api_logs
            (
              metodo,
              endpoint,
              status,
              latencia_ms
            )

            VALUES (?, ?, ?, ?)
          `,
          [
            metodo,
            endpoint,
            status,
            latenciaMs
          ],
          function (err) {

            if (err) {
              reject(err);
              return;
            }

            resolve(
              this.lastID
            );
          }
        );
      }
    );
  }


  obterLogs(
    limite = 30
  ) {
    return new Promise(
      (resolve, reject) => {

        db.all(
          `
            SELECT *
            FROM api_logs

            ORDER BY id DESC

            LIMIT ?
          `,
          [limite],
          (err, rows) => {

            if (err) {
              reject(err);
              return;
            }

            resolve(rows);
          }
        );
      }
    );
  }


  // =====================================
  // HISTÓRICO
  // =====================================

  registrarSnapshot(
    velocidadeMedia
  ) {
    return new Promise(
      (resolve, reject) => {

        db.run(
          `
            INSERT INTO
              telemetria_historico
            (
              velocidade_media
            )

            VALUES (?)
          `,
          [velocidadeMedia],
          function (err) {

            if (err) {
              reject(err);
              return;
            }

            resolve(
              this.lastID
            );
          }
        );
      }
    );
  }


  obterHistorico(
    limite = 20
  ) {
    return new Promise(
      (resolve, reject) => {

        db.all(
          `
            SELECT *
            FROM
              telemetria_historico

            ORDER BY id DESC

            LIMIT ?
          `,
          [limite],
          (err, rows) => {

            if (err) {
              reject(err);
              return;
            }

            // devolve em ordem
            // cronológica
            resolve(
              rows.reverse()
            );
          }
        );
      }
    );
  }
}

export default new DashboardRepository();