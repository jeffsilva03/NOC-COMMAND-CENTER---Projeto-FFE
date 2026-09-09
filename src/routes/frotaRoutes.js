import express from 'express';
import frotaController from '../controllers/frotaController.js';

const router = express.Router();

// READ - lista 500 veículos
router.get('/', (req, res) =>
  frotaController.listar(req, res)
);

// READ - busca um veículo
router.get('/:id', (req, res) =>
  frotaController.buscarDetalhes(req, res)
);

// CREATE - cria veículo
router.post('/', (req, res) =>
  frotaController.registrar(req, res)
);

// UPDATE - atualiza veículo
router.put('/:id', (req, res) =>
  frotaController.atualizarTelemetria(req, res)
);

// DELETE - remove veículo
router.delete('/:id', (req, res) =>
  frotaController.remover(req, res)
);

export default router;