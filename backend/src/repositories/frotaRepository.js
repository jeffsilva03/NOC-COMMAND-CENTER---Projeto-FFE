import db from '../config/database.js';

class FrotaRepository {

  // =========================
  // READ - LISTAR
  // =========================

  listarTodos(limite = 500) {
    return new Promise((resolve, reject) => {

      const query = `
        SELECT *
        FROM frota
        ORDER BY RANDOM()
        LIMIT ?
      `;

      db.all(query, [limite], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(rows);
      });
    });
  }


  // =========================
  // READ - BUSCAR POR ID
  // =========================

  buscarPorId(id) {
    return new Promise((resolve, reject) => {

      const query = `
        SELECT *
        FROM frota
        WHERE id = ?
      `;

      db.get(query, [id], (err, row) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(row);
      });
    });
  }


  // =========================
  // CREATE
  // =========================

  criar(veiculo) {
    return new Promise((resolve, reject) => {

      const {
        id,
        modelo,
        tipo,
        vel,
        latitude,
        longitude
      } = veiculo;

      const query = `
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
      `;

      db.run(
        query,
        [
          id,
          modelo,
          tipo,
          vel,
          latitude,
          longitude
        ],
        function (err) {

          if (err) {
            reject(err);
            return;
          }

          resolve({
            id,
            modelo,
            tipo,
            vel,
            latitude,
            longitude
          });
        }
      );
    });
  }


  // =========================
  // UPDATE
  // =========================

  atualizar(id, dados) {
    return new Promise((resolve, reject) => {

      const {
        vel,
        latitude,
        longitude
      } = dados;

      const query = `
        UPDATE frota

        SET
          vel = ?,
          latitude = ?,
          longitude = ?,
          ultima_atualizacao = CURRENT_TIMESTAMP

        WHERE id = ?
      `;

      db.run(
        query,
        [
          vel,
          latitude,
          longitude,
          id
        ],
        function (err) {

          if (err) {
            reject(err);
            return;
          }

          resolve(this.changes);
        }
      );
    });
  }


  // =========================
  // DELETE
  // =========================

  deletar(id) {
    return new Promise((resolve, reject) => {

      const query = `
        DELETE FROM frota
        WHERE id = ?
      `;

      db.run(
        query,
        [id],
        function (err) {

          if (err) {
            reject(err);
            return;
          }

          resolve(this.changes);
        }
      );
    });
  }
}

export default new FrotaRepository();