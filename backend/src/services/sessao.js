import crypto from 'node:crypto';

// Armazenamento em memoria (reinicia junto com o servidor)
const sessoes = new Map();
const cobrancas = new Map();

export function criarSessao(cliente) {
  const token = crypto.randomUUID();
  sessoes.set(token, { ...cliente, criadoEm: Date.now() });
  return token;
}

export function obterSessao(token) {
  return sessoes.get(token);
}

export function encerrarSessao(token) {
  sessoes.delete(token);
}

export function salvarCobranca(cobranca) {
  cobrancas.set(cobranca.txid, cobranca);
}

export function obterCobranca(txid) {
  return cobrancas.get(txid);
}
