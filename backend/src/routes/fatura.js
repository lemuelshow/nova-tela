import { Router } from 'express';
import { autenticar } from '../middleware/auth.js';
import { fatura } from '../data/mock.js';

const router = Router();

// Valores gerados no login e guardados na sessao do cliente
router.get('/', autenticar, (req, res) => {
  res.json({ ...fatura, ...req.cliente.valores });
});

export default router;
