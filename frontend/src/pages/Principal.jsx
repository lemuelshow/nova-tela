import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopoLogo from '../components/TopoLogo.jsx';
import { useCopiar } from '../components/useCopiar.js';
import { useSessao } from '../context/SessaoContext.jsx';
import { api } from '../services/api.js';
import { formatarMoeda } from '../utils/formatos.js';

const ACEITES = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.',
  'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.',
  'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.',
];

const ITENS = [
  ['1. LOREM IPSUM DOLOR:', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.'],
  ['2. CONSECTETUR ADIPISCING:', 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.'],
  ['3. SED DO EIUSMOD:', 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'],
];

export default function Principal() {
  const { cliente, expirar, logout } = useSessao();
  const navigate = useNavigate();
  const [fatura, setFatura] = useState(null);
  const [erro, setErro] = useState('');
  const [marcados, setMarcados] = useState(ACEITES.map(() => false));
  const [copiado, copiar] = useCopiar();
  const valorRef = useRef();

  useEffect(() => {
    api.fatura().then(setFatura).catch((err) => {
      if (err.status === 401) expirar();
      else setErro(err.message);
    });
  }, [expirar]);

  const todosMarcados = marcados.every(Boolean);
  const valorPagar = fatura ? formatarMoeda(fatura.valorPagar) : '';

  function alternar(i) {
    setMarcados((m) => m.map((v, j) => (j === i ? !v : v)));
  }

  return (
    <main className="pagina">
      <TopoLogo icones />
      <header className="cabecalho">
        <div>
          <h1>LOREM IPSUM</h1>
          <p className="linha">Lorem: <span>{cliente?.cpf}</span></p>
          <p className="linha">Ipsum: <span>{cliente?.nome}</span></p>
          <button type="button" className="link-sair" onClick={logout}>Sair</button>
        </div>
      </header>

      <section className="card">
        {erro && <p className="erro">{erro}</p>}
        {!fatura && !erro && <p className="carregando">Carregando...</p>}

        {fatura && (
          <>
            <h2>{fatura.titulo}</h2>

            <div className="resumo">
              <p>Lorem ipsum dolor sit: &nbsp;{formatarMoeda(fatura.valorTotal)}</p>
              <p className="total">Lorem ipsum dolor: {valorPagar}</p>
            </div>

            <div className="linha-copiar">
              <button type="button" onClick={() => copiar(valorPagar, valorRef.current)}>
                {copiado ? 'Copiado!' : 'Lorem'}
              </button>
              <input type="text" ref={valorRef} value={valorPagar} readOnly />
            </div>

            <div className="alerta" role="alert">
              <h3>
                <svg width="24" height="22" viewBox="0 0 24 22" aria-hidden="true">
                  <path d="M12 1.5 23 20.5H1z" fill="#ffc400" stroke="#e0a800" strokeWidth="1" strokeLinejoin="round" />
                  <rect x="11" y="7.5" width="2" height="7" rx="1" fill="#111" />
                  <circle cx="12" cy="17.2" r="1.2" fill="#111" />
                </svg>
                <span>LOREM IPSUM DOLOR SIT AMET - CONSECTETUR ADIPISCING</span>
              </h3>

              <ul>
                <li>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                  labore et dolore magna aliqua no valor de <strong>{formatarMoeda(fatura.valorAlerta)}</strong>, ut
                  enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </li>
              </ul>

              <hr />

              {ITENS.map(([titulo, texto]) => (
                <div className="item" key={titulo}>
                  <h4>{titulo}</h4>
                  <p>{texto}</p>
                </div>
              ))}
            </div>

            <form className="aceites" onSubmit={(e) => { e.preventDefault(); navigate('/pix'); }}>
              {ACEITES.map((texto, i) => (
                <label className="check" key={i}>
                  <input type="checkbox" checked={marcados[i]} onChange={() => alternar(i)} />
                  <span>{texto}</span>
                </label>
              ))}
              <button type="submit" className="btn-continuar" disabled={!todosMarcados}>Continuar</button>
            </form>
          </>
        )}
      </section>
    </main>
  );
}
