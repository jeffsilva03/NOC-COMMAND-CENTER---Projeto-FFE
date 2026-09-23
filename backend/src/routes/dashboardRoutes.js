import express
  from 'express';

import dashboardController
  from '../controllers/dashboardController.js';

const router =
  express.Router();


// Dashboard completo

router.get(
  '/',
  (req, res) =>
    dashboardController
      .painel(
        req,
        res
      )
);


// Alterar um link

router.put(
  '/links/:id',
  (req, res) =>
    dashboardController
      .atualizarLink(
        req,
        res
      )
);


// Restaurar todos

router.post(
  '/links/restaurar-todos',
  (req, res) =>
    dashboardController
      .restaurarTodos(
        req,
        res
      )
);


// Contingência

router.post(
  '/links/alternados',
  (req, res) =>
    dashboardController
      .alternados(
        req,
        res
      )
);


export default router;