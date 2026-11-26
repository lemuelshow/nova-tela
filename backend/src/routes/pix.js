import { Router } from 'express';
import crypto from 'node:crypto';
import { autenticar } from '../middleware/auth.js';
import { gerarPix } from '../services/pix.js';
import { salvarCobranca, obterCobranca } from '../services/sessao.js';
import { recebedor, PIX_VALIDADE_MIN } from '../data/mock.js';

const router = Router();

// Gera uma nova cobranca Pix para o cliente logado
router.post('/', autenticar, (req, res) => {
  const txid = 'LOREM' + crypto.randomBytes(6).toString('hex').toUpperCase();
  const codigo = gerarPix({
    chave: recebedor.chave,
    nome: recebedor.nome,
    cidade: recebedor.cidade,
    valor: req.cliente.valores.valorPagar,
    txid,
  });
  const cobranca = {
    txid,
    codigo,
    valor: req.cliente.valores.valorPagar,
    beneficiario: recebedor.nome,
    chave: recebedor.chave,
    expiraEm: new Date(Date.now() + PIX_VALIDADE_MIN * 60 * 1000).toISOString(),
    status: 'PENDENTE',
    cpf: req.cliente.cpf,
  };
  salvarCobranca(cobranca);
  res.status(201).json(cobranca);
});

// Simula a confirmacao do pagamento
router.post('/:txid/pagar', autenticar, (req, res) => {
  const cobranca = obterCobranca(req.params.txid);
  if (!cobranca || cobranca.cpf !== req.cliente.cpf) {
    return res.status(404).json({ erro: 'Cobrança não encontrada.' });
  }
  if (cobranca.status === 'PENDENTE' && new Date(cobranca.expiraEm) < new Date()) {
    return res.status(410).json({ erro: 'Cobrança expirada. Gere um novo Pix.' });
  }
  if (cobranca.status !== 'PAGO') {
    cobranca.status = 'PAGO';
    cobranca.pagoEm = new Date().toISOString();
    cobranca.autenticacao = crypto.randomBytes(4).toString('hex').toUpperCase();
  }
  res.json({
    txid: cobranca.txid,
    valor: cobranca.valor,
    formaPagamento: 'Pix',
    pagoEm: cobranca.pagoEm,
    autenticacao: cobranca.autenticacao,
  });
});

export default router;
