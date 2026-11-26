import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import TopoLogo from '../components/TopoLogo.jsx';
import { useSessao } from '../context/SessaoContext.jsx';
import { formatarDataHora, formatarMoeda } from '../utils/formatos.js';

export default function Pago() {
  const { state: comprovante } = useLocation();
  const navigate = useNavigate();
  const { logout } = useSessao();

  async function voltarAoInicio() {
    await logout();
    navigate('/login', { replace: true });
  }

  if (!comprovante) return <Navigate to="/principal" replace />;

  return (
    <main className="pagina">
      <TopoLogo icones />
      <section className="card sucesso">
        <svg width="72" height="72" viewBox="0 0 64 64" aria-hidden="true">
          <circle cx="32" cy="32" r="30" fill="#1f9d55" />
          <path d="M19 33l9 9 17-19" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <h2>Pagamento realizado!</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Seu pagamento foi confirmado.</p>

        <div className="pix-info comprovante">
          <p><span>Valor pago</span><strong>{formatarMoeda(comprovante.valor)}</strong></p>
          <p><span>Forma de pagamento</span><strong>{comprovante.formaPagamento}</strong></p>
          <p><span>Data</span><strong>{formatarDataHora(comprovante.pagoEm)}</strong></p>
          <p><span>Autenticação</span><strong>{comprovante.autenticacao}</strong></p>
        </div>

        <button type="button" className="btn-voltar" onClick={voltarAoInicio}>
          Voltar ao início
        </button>
      </section>
    </main>
  );
}
