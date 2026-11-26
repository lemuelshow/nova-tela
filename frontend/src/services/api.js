let token = null;

export function setToken(t) {
  token = t || null;
}

export class ApiError extends Error {
  constructor(mensagem, status) {
    super(mensagem);
    this.status = status;
  }
}

async function request(metodo, url, body, tokenUsado = token) {
  const resp = await fetch('/api' + url, {
    method: metodo,
    headers: {
      'Content-Type': 'application/json',
      ...(tokenUsado ? { Authorization: `Bearer ${tokenUsado}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (resp.status === 204) return null;
  const dados = await resp.json().catch(() => ({}));
  if (!resp.ok) throw new ApiError(dados.erro || 'Falha na comunicação com o servidor.', resp.status);
  return dados;
}

export const api = {
  login: (cpf) => request('POST', '/auth/login', { cpf }),
  logout: () => request('POST', '/auth/logout'),
  fatura: () => request('GET', '/fatura'),
  gerarPix: () => request('POST', '/pix'),
  pagarPix: (txid) => request('POST', `/pix/${txid}/pagar`),
};

export const adminApi = {
  login: (usuario, senha) => request('POST', '/admin/login', { usuario, senha }, null),
  logout: (t) => request('POST', '/admin/logout', null, t),
  acessos: (t) => request('GET', '/admin/acessos', null, t),
  gateway: (t) => request('GET', '/admin/gateway', null, t),
  salvarGateway: (t, dados) => request('PUT', '/admin/gateway', dados, t),
};
