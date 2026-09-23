import express
  from 'express';

import cors
  from 'cors';

import frotaRoutes
  from './routes/frotaRoutes.js';

import dashboardRoutes
  from './routes/dashboardRoutes.js';

import {
  apiLogger
} from './middlewares/apiLogger.js';


const app =
  express();

const PORT =
  process.env.PORT || 3000;


// CORS

app.use(
  cors()
);


// JSON

app.use(
  express.json()
);


// ====================================
// LOG REAL DE TODA REQUISIÇÃO /api
// ====================================

app.use(
  '/api',
  apiLogger
);


// ====================================
// ROTAS
// ====================================

app.use(
  '/api/frota',
  frotaRoutes
);


app.use(
  '/api/dashboard',
  dashboardRoutes
);


// ====================================
// SERVIDOR
// ====================================

app.listen(
  PORT,
  '0.0.0.0',
  () => {
    console.log(
      `🚀 Servidor operando na porta ${PORT}`
    );
  }
);