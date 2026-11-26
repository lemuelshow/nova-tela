import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessao } from '../context/SessaoContext.jsx';
import { cpfValido, mascaraCpf } from '../utils/formatos.js';

function IconeDocumento() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="2.5" y="5" width="19" height="14" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="8.5" cy="11" r="2.2" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path d="M5.2 16.2c.6-1.6 1.9-2.4 3.3-2.4s2.7.8 3.3 2.4" fill="none" stroke="currentColor"
        strokeWidth="1.7" strokeLinecap="round" />
      <path d="M14.5 10h4.2M14.5 13.5h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function IconeInfo() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 11v5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="7.6" r="1.2" fill="currentColor" />
    </svg>
  );
}

function IconeUsuarioConfig() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="9.5" cy="7.5" r="3.6" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M2.8 20c.4-3.9 3.2-6.2 6.7-6.2 1.1 0 2.1.2 3 .7" fill="none" stroke="currentColor"
        strokeWidth="1.8" strokeLinecap="round" />
      <g transform="translate(17.6 17.4)" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <circle r="1.6" />
        <path d="M0-4.3V-3M0 3V4.3M-4.3 0H-3M3 0H4.3M-3-3l.9.9M2.1 2.1l.9.9M-3 3l.9-.9M2.1-2.1l.9-.9" />
      </g>
    </svg>
  );
}

function NavbarLogin() {
  return (
    <header className="lg-navbar">
      <img className="lg-navbar-logo" src="/logo.png" alt="Lorem Ipsum" />
      <div className="lg-navbar-acoes">
        <button type="button" className="lg-navbar-btn" aria-label="Informações" title="Informações">
          <IconeInfo />
        </button>
        <button type="button" className="lg-navbar-btn" aria-label="Usuário e configurações" title="Usuário e configurações">
          <IconeUsuarioConfig />
        </button>
      </div>
    </header>
  );
}

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
    <div className="lg-pagina">
    <NavbarLogin />
    <main className="lg-container">
      <div className="lg-cabecalho">
        <img className="lg-logo-central" src="/logo.png" alt="Lorem Ipsum" />
        <p className="lg-subtitulo">Identifique-se no sistema com:</p>
      </div>

      <div className="lg-card-id">
        <span className="lg-card-icone"><IconeDocumento /></span>
        <h1 className="lg-card-titulo">Identificação por CPF</h1>
      </div>

      <p className="lg-orientacao">
        Informe seu CPF para <strong>criar</strong> seu cadastro ou <strong>acessar</strong> sua
        conta.
      </p>

      <form className="lg-form" onSubmit={enviar} noValidate>
        <div className="lg-campo-grupo">
          <label className="lg-label" htmlFor="cpf">CPF</label>
          <input
            type="text"
            id="cpf"
            className={'lg-input' + (erro ? ' invalido' : '')}
            inputMode="numeric"
            autoComplete="username"
            placeholder="000.000.000-00"
            maxLength={14}
            value={cpf}
            autoFocus
            aria-invalid={!!erro}
            aria-describedby={erro ? 'cpf-erro' : undefined}
            onChange={(e) => { setCpf(mascaraCpf(e.target.value)); setErro(''); }}
          />
          {erro && <p className="lg-erro" id="cpf-erro">{erro}</p>}
        </div>

        <button type="submit" className="lg-botao" disabled={!completo || carregando}>
          {carregando ? 'Acessando...' : 'Continuar'}
        </button>
      </form>
    </main>
    </div>
  );
}
