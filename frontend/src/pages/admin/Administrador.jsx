import { useCallback, useState } from 'react';
import { adminApi } from '../../services/api.js';
import AdminLogin from './AdminLogin.jsx';
import AdminPainel from './AdminPainel.jsx';

const CHAVE = 'modelo-tela:admin';

function lerToken() {
  try { return sessionStorage.getItem(CHAVE); } catch { return null; }
}
function gravarToken(t) {
  try {
    if (t) sessionStorage.setItem(CHAVE, t);
    else sessionStorage.removeItem(CHAVE);
  } catch { /* storage indisponivel */ }
}

export default function Administrador() {
  const [token, setToken] = useState(lerToken);

  const entrar = useCallback((t) => { gravarToken(t); setToken(t); }, []);
  const sair = useCallback(async () => {
    try { await adminApi.logout(token); } catch { /* ignora */ }
    gravarToken(null);
    setToken(null);
  }, [token]);
  const expirar = useCallback(() => { gravarToken(null); setToken(null); }, []);

  return token
    ? <AdminPainel token={token} onSair={sair} onExpirar={expirar} />
    : <AdminLogin onEntrar={entrar} />;
}
