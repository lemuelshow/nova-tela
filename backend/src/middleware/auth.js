import { obterSessao } from '../services/sessao.js';

export function autenticar(req, res, next) {
  const [tipo, token] = (req.headers.authorization || '').split(' ');
  const sessao = tipo === 'Bearer' && token ? obterSessao(token) : null;
  if (!sessao) return res.status(401).json({ erro: 'Sessão inválida ou expirada.' });
  req.token = token;
  req.cliente = sessao;
  next();
}
