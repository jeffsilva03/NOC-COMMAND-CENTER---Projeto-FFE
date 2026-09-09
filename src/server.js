import express from 'express';
import cors from 'cors';
import frotaRoutes from './routes/frotaRoutes.js';

const app = express();

const PORT = 3000;

// Permite comunicação com outros endereços,
// como o Front-end React
app.use(cors());

// Permite receber JSON nas requisições
app.use(express.json());

// Todas as rotas da frota começam por /api/frota
app.use('/api/frota', frotaRoutes);

// Inicia o servidor
app.listen(PORT, () => {
  console.log(
    `🚀 Servidor operando em http://localhost:${PORT}`
  );
});