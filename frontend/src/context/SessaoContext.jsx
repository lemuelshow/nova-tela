import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { api, setToken } from '../services/api.js';

const SessaoContext = createContext(null);
const CHAVE = 'modelo-tela:sessao';

function lerSessao() {
  try {
    return JSON.parse(sessionStorage.getItem(CHAVE)) || {};
  } catch {
    return {};
  }
}

export function SessaoProvider({ children }) {
  const [sessao, setSessao] = useState(() => {
    const s = lerSessao();
    setToken(s.token);
    return s;
  });

  const salvar = useCallback((nova) => {
    setToken(nova.token);
    setSessao(nova);
    try {
      if (nova.token) sessionStorage.setItem(CHAVE, JSON.stringify(nova));
      else sessionStorage.removeItem(CHAVE);
    } catch {
      /* storage indisponivel */
    }
  }, []);

  const login = useCallback(async (cpf) => {
    const { token, cliente } = await api.login(cpf);
    salvar({ token, cliente });
  }, [salvar]);

  const logout = useCallback(async () => {
    try { await api.logout(); } catch { /* ignora */ }
    salvar({});
  }, [salvar]);

  const valor = useMemo(
    () => ({ token: sessao.token, cliente: sessao.cliente, login, logout, expirar: () => salvar({}) }),
    [sessao, login, logout, salvar]
  );

  return <SessaoContext.Provider value={valor}>{children}</SessaoContext.Provider>;
}

export function useSessao() {
  return useContext(SessaoContext);
}
