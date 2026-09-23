import db from './database.js';

const categorias = [
  { tipo: 'Ônibus', modelo: '🚌' },
  { tipo: 'Caminhão', modelo: '🚚' },
  { tipo: 'Moto', modelo: '🏍' },
  { tipo: 'Carro', modelo: '🚗' },
  { tipo: 'Caminhonete', modelo: '🛻' },
  { tipo: 'Van', modelo: '🚐' },
  { tipo: 'SUV', modelo: '🚙' },
  { tipo: 'Esportivo', modelo: '🏎' },
  { tipo: 'Trator', modelo: '🚜' },
  { tipo: 'Ambulância', modelo: '🚑' }
];

// Gera uma coordenada aleatória
function gerarCoordenada(base, variancia) {
  return (
    base +
    (Math.random() * variancia - variancia / 2)
  ).toFixed(4);
}

db.serialize(() => {
  console.log('Iniciando geração de carga de Big Data. Aguarde...');

  // Inicia uma transação
  db.run('BEGIN TRANSACTION');

  const stmt = db.prepare(`
    INSERT OR REPLACE INTO frota
    (id, modelo, tipo, vel, latitude, longitude)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  let count = 1;

  // 10 categorias × 10.000 = 100.000 veículos
  const volumePorCategoria = 10000;

  categorias.forEach((cat) => {
    for (let i = 0; i < volumePorCategoria; i++) {
      const id = `V-${count.toString().padStart(6, '0')}`;

      const vel = Math
        .floor(Math.random() * 120)
        .toString();

      const lat = gerarCoordenada(-14.23, 30);
      const lng = gerarCoordenada(-51.92, 30);

      stmt.run([
        id,
        cat.modelo,
        cat.tipo,
        vel,
        lat,
        lng
      ]);

      count++;
    }
  });

  stmt.finalize();

  // Confirma todas as inserções
  db.run('COMMIT', () => {
    console.log(
      `Sucesso! ${count - 1} veículos foram inseridos no banco de dados.`
    );

    db.close();
  });
});