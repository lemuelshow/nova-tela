import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo.jsx';
import { useSessao } from '../context/SessaoContext.jsx';
import { cpfValido, mascaraCpf } from '../utils/formatos.js';

export default function Login() {
  const { login } = useSessao();
  const navigate = useNavigate();
  const [cpf, setCpf] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const completo = cpf.replace(/\D/g, '').length === 11;

  async function enviar(e) {
    e.preventDefault();
    if (!cpfValido(cpf)) {
      setErro('CPF inválido. Verifique os números digitados.');
      return;
    }
    setCarregando(true);
    try {
      await login(cpf);
      navigate('/principal');
    } catch (err) {
      setErro(err.message);
      setCarregando(false);
    }
  }

  return (
    <main className="pagina tela-login">
      <div className="login-topo">
        <Logo grande />
        <h1>LOREM IPSUM</h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      </div>

      <section className="card">
        <h2>Acesse sua conta</h2>
        <form onSubmit={enviar} noValidate>
          <label className="rotulo" htmlFor="cpf">CPF</label>
          <input
            type="text"
            id="cpf"
            className={'campo' + (erro ? ' invalido' : '')}
            inputMode="numeric"
            autoComplete="username"
            placeholder="000.000.000-00"
            maxLength={14}
            value={cpf}
            autoFocus
            onChange={(e) => { setCpf(mascaraCpf(e.target.value)); setErro(''); }}
          />
          {erro && <p className="erro">{erro}</p>}
          <button type="submit" className="btn-continuar" disabled={!completo || carregando}>
            {carregando ? 'Acessando...' : 'Acessar'}
          </button>
        </form>
      </section>

      <p className="login-rodape">Lorem ipsum dolor sit amet &middot; Consectetur adipiscing</p>
    </main>
  );
}
