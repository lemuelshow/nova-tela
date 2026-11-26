import { Router } from 'express';
import { cpfValido, formatarCpf } from '../services/cpf.js';
import { criarSessao, encerrarSessao } from '../services/sessao.js';
import { autenticar } from '../middleware/auth.js';
import { clientes, gerarValores } from '../data/mock.js';
import { registrarAcesso } from '../services/db.js';

const router = Router();

router.post('/login', (req, res) => {
  const { cpf } = req.body || {};
  if (!cpfValido(cpf)) {
    return res.status(400).json({ erro: 'CPF inválido. Verifique os números digitados.' });
  }
  const cliente = { cpf: formatarCpf(cpf), nome: clientes.padrao.nome };
  const valores = gerarValores();
  const token = criarSessao({ ...cliente, valores });
  registrarAcesso(cliente.cpf, valores);
  res.json({ token, cliente });
});

router.get('/me', autenticar, (req, res) => {
  res.json({ cliente: { cpf: req.cliente.cpf, nome: req.cliente.nome } });
});

router.post('/logout', autenticar, (req, res) => {
  encerrarSessao(req.token);
  res.status(204).end();
});

export default router;
