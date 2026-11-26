import { useState } from 'react';
import { adminApi } from '../../services/api.js';

export default function AdminLogin({ onEntrar }) {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function enviar(e) {
    e.preventDefault();
    setCarregando(true);
    setErro('');
    try {
      const { token } = await adminApi.login(usuario.trim(), senha);
      onEntrar(token);
    } catch (err) {
      setErro(err.message);
      setCarregando(false);
    }
  }

  return (
    <main className="pagina tela-login">
      <div className="login-topo">
        <img src="/logo.png" alt="Lorem Ipsum" className="admin-logo-login" />
        <h1>Administrador</h1>
        <p>Acesso restrito à administração do sistema.</p>
      </div>

      <section className="card">
        <h2>Entrar como administrador</h2>
        <form onSubmit={enviar} noValidate>
          <label className="rotulo" htmlFor="adm-usuario">Usuário</label>
          <input id="adm-usuario" className={'campo' + (erro ? ' invalido' : '')} autoComplete="username"
            value={usuario} autoFocus onChange={(e) => { setUsuario(e.target.value); setErro(''); }} />

          <label className="rotulo rotulo-espaco" htmlFor="adm-senha">Senha</label>
          <input id="adm-senha" type="password" className={'campo' + (erro ? ' invalido' : '')}
            autoComplete="current-password" value={senha}
            onChange={(e) => { setSenha(e.target.value); setErro(''); }} />

          {erro && <p className="erro">{erro}</p>}
          <button type="submit" className="btn-continuar" disabled={!usuario || !senha || carregando}>
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </section>
    </main>
  );
}
