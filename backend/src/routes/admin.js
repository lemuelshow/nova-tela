import { Router } from 'express';
import crypto from 'node:crypto';
import { resumoAcessos, obterGateway, salvarGateway } from '../services/db.js';

const router = Router();

// Credenciais do administrador (defina ADMIN_USUARIO e ADMIN_SENHA em producao)
const ADMIN_USUARIO = process.env.ADMIN_USUARIO || 'admin';
const ADMIN_SENHA = process.env.ADMIN_SENHA || 'admin123';
if (!process.env.ADMIN_SENHA) {
  console.warn('[admin] ADMIN_SENHA nao definida - usando senha padrao "admin123".');
}

const sessoesAdmin = new Map();
const VALIDADE_MS = 8 * 60 * 60 * 1000;

function iguais(a, b) {
  const ha = crypto.createHash('sha256').update(String(a)).digest();
  const hb = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb);
}

function autenticarAdmin(req, res, next) {
  const [tipo, token] = (req.headers.authorization || '').split(' ');
  const sessao = tipo === 'Bearer' ? sessoesAdmin.get(token) : null;
  if (!sessao || sessao.expiraEm < Date.now()) {
    if (sessao) sessoesAdmin.delete(token);
    return res.status(401).json({ erro: 'Sessão de administrador inválida ou expirada.' });
  }
  req.adminToken = token;
  next();
}

function mascarar(valor) {
  if (!valor) return '';
  return valor.length <= 4 ? '****' : '*'.repeat(Math.min(valor.length - 4, 20)) + valor.slice(-4);
}

function gatewayPublico(g) {
  if (!g) return null;
  const { chaveSecreta, ...resto } = g;
  return { ...resto, chaveSecretaMascarada: mascarar(chaveSecreta), possuiChaveSecreta: Boolean(chaveSecreta) };
}

router.post('/login', (req, res) => {
  const { usuario = '', senha = '' } = req.body || {};
  const ok = iguais(usuario, ADMIN_USUARIO) & iguais(senha, ADMIN_SENHA);
  if (!ok) return res.status(401).json({ erro: 'Usuário ou senha inválidos.' });
  const token = crypto.randomUUID();
  sessoesAdmin.set(token, { usuario, expiraEm: Date.now() + VALIDADE_MS });
  res.json({ token, usuario });
});

router.post('/logout', autenticarAdmin, (req, res) => {
  sessoesAdmin.delete(req.adminToken);
  res.status(204).end();
});

router.get('/acessos', autenticarAdmin, (_req, res) => {
  res.json(resumoAcessos());
});

router.get('/gateway', autenticarAdmin, (_req, res) => {
  res.json(gatewayPublico(obterGateway()));
});

router.put('/gateway', autenticarAdmin, (req, res) => {
  const { urlBase, chavePublica, chaveSecreta, webhookUrl, ambiente, ativo } = req.body || {};
  const atual = obterGateway() || {};

  const erros = [];
  const url = String(urlBase || '').trim();
  if (!/^https:\/\/\S+$/i.test(url)) erros.push('Informe a URL base da API (https://...).');
  if (!String(chavePublica || '').trim()) erros.push('Informe a chave pública.');
  if (!String(chaveSecreta || '').trim() && !atual.chaveSecreta) erros.push('Informe a chave secreta.');
  const hook = String(webhookUrl || '').trim();
  if (hook && !/^https?:\/\/\S+$/i.test(hook)) erros.push('URL de webhook inválida.');
  if (erros.length) return res.status(400).json({ erro: erros.join(' ') });

  const salvo = salvarGateway({
    provedor: 'AmploPay',
    urlBase: url.replace(/\/+$/, ''),
    chavePublica: String(chavePublica).trim(),
    // chave secreta em branco = mantem a atual
    chaveSecreta: String(chaveSecreta || '').trim() || atual.chaveSecreta,
    webhookUrl: hook,
    ambiente: ambiente === 'producao' ? 'producao' : 'sandbox',
    ativo: Boolean(ativo),
    atualizadoEm: new Date().toISOString(),
  });
  res.json(gatewayPublico(salvo));
});

export default router;
