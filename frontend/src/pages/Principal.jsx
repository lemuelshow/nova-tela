import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopoLogo from '../components/TopoLogo.jsx';
import { useCopiar } from '../components/useCopiar.js';
import { useSessao } from '../context/SessaoContext.jsx';
import { api } from '../services/api.js';
import { formatarMoeda } from '../utils/formatos.js';

const OPCOES = ['Lorem ipsum A', 'Lorem ipsum B', 'Lorem ipsum C', 'Lorem ipsum D'];

const ITENS = [
  ['1. LOREM IPSUM DOLOR:', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.'],
  ['2. CONSECTETUR ADIPISCING:', 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.'],
  ['3. SED DO EIUSMOD:', 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'],
];

const LISTA = [
  'Lorem ipsum dolor sit amet',
  'Consectetur adipiscing elit',
  'Sed do eiusmod tempor incididunt',
  'Ut labore et dolore magna aliqua',
];

function IconeBanner() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 10.8v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="7.4" r="1.25" fill="currentColor" />
    </svg>
  );
}

function IconeUsuario() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="8.2" r="4" fill="currentColor" />
      <path d="M4.5 20.5c.5-4.2 3.6-6.8 7.5-6.8s7 2.6 7.5 6.8z" fill="currentColor" />
    </svg>
  );
}

export default function Principal() {
  const { cliente, expirar, logout } = useSessao();
  const navigate = useNavigate();
  const [fatura, setFatura] = useState(null);
  const [erro, setErro] = useState('');
  const [marcados, setMarcados] = useState(OPCOES.map(() => false));
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
    <div className="pr-pagina">
      <div className="pr-header">
        <TopoLogo icones />
      </div>

      <main className="pr-conteudo">
        {/* 3.1 Banner informativo */}
        <section className="pr-banner">
          <h2 className="pr-banner-faixa">LOREM IPSUM DOLOR</h2>
          <div className="pr-banner-corpo">
            <span className="pr-banner-icone"><IconeBanner /></span>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
              labore et dolore magna aliqua.
            </p>
          </div>
        </section>

        {/* 3.2 Card de conteudo textual */}
        <section className="pr-card">
          <h2 className="pr-titulo">LOREM IPSUM DOLOR SIT AMET</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
            labore et dolore magna aliqua.
          </p>
          <p>
            <strong>Lorem ipsum:</strong> Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
            nisi ut aliquip ex ea commodo consequat.
          </p>
          <ul className="pr-lista">
            {LISTA.map((t) => <li key={t}>{t}</li>)}
          </ul>
        </section>

        {/* 4.1 Card de identificacao */}
        <section className="pr-ident">
          <p className="pr-ident-intro">Lorem ipsum dolor sit amet, consectetur adipiscing elit:</p>
          <p><strong>Lorem:</strong> {cliente?.nome || 'Ipsum Dolor'}</p>
          <p><strong>Ipsum:</strong> {cliente?.cpf || 'XXXXXXXX'}</p>
        </section>

        {/* 4.2 Card de documento demonstrativo */}
        <section className="pr-card">
          <p className="pr-doc-etiqueta">MODELO DEMONSTRATIVO</p>
          <article className="pr-doc">
            <div className="pr-doc-topo">
              <span className="pr-doc-selo" aria-hidden="true">LI</span>
              <strong>LOREM IPSUM DOLOR</strong>
              <span>CONSECTETUR ADIPISCING</span>
            </div>
            <p className="pr-doc-corpo">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
              labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
            </p>
            <div className="pr-doc-rodape">
              <span className="pr-doc-assinatura" />
              <strong>Lorem ipsum dolor sit amet</strong>
              <span>Exemplo de documento fictício</span>
            </div>
          </article>
        </section>

        {/* 5.1 Cabecalho do perfil */}
        <section className="pr-perfil">
          <div>
            <h1 className="pr-titulo">LOREM IPSUM DOLOR</h1>
            <p><strong>Lorem:</strong> {cliente?.nome || 'Ipsum Dolor'}</p>
            <p><strong>Ipsum:</strong> {cliente?.cpf || 'XXXXXXXX'}</p>
            <button type="button" className="pr-link-sair" onClick={logout}>Sair</button>
          </div>
          <span className="pr-avatar" aria-hidden="true"><IconeUsuario /></span>
        </section>

        {/* 5.2 Card de resumo e selecao */}
        <section className="pr-resumo-card">
          {erro && <p className="erro">{erro}</p>}
          {!fatura && !erro && <p className="carregando">Carregando...</p>}

          {fatura && (
            <>
              <h2 className="pr-titulo">{fatura.titulo}</h2>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit:</p>

              <div className="pr-resumo">
                <p><strong>Lorem ipsum:</strong> {formatarMoeda(fatura.valorTotal)}</p>
                <p><strong>Lorem ipsum dolor:</strong> {valorPagar}</p>
              </div>

              <p className="pr-aviso">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit no valor de{' '}
                <strong>{formatarMoeda(fatura.valorAlerta)}</strong>.
              </p>

              <form onSubmit={(e) => { e.preventDefault(); navigate('/pix'); }}>
                <p className="pr-subtitulo">Lorem ipsum dolor sit amet:</p>
                <div className="pr-opcoes">
                  {OPCOES.map((texto, i) => (
                    <label className="pr-check" key={texto}>
                      <input type="checkbox" checked={marcados[i]} onChange={() => alternar(i)} />
                      <span>{texto}</span>
                    </label>
                  ))}
                </div>

                <div className="pr-botoes">
                  <button type="submit" className="pr-btn pr-btn-primario" disabled={!todosMarcados}>
                    Lorem ipsum
                  </button>
                  <button type="button" className="pr-btn pr-btn-secundario"
                    onClick={() => setMarcados(OPCOES.map(() => false))}>
                    Dolor sit amet
                  </button>
                </div>
              </form>

              <p className="pr-resultado">Lorem ipsum: {valorPagar}</p>

              <div className="pr-campos">
                <input type="text" ref={valorRef} value={valorPagar} readOnly aria-label="Valor" />
                <button type="button" onClick={() => copiar(valorPagar, valorRef.current)}>
                  {copiado ? 'Copiado!' : 'Lorem'}
                </button>
              </div>
            </>
          )}
        </section>
      </main>

      {/* Conteudo original da tela */}
      <div className="pagina pr-legado">
        <section className="card">
          {fatura && (
            <>
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
                <p className="pr-texto-continuar">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                  labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <button type="submit" className="btn-continuar">GERAR PAGAMENTO PIX</button>
              </form>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
