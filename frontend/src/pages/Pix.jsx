import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import { useCopiar } from '../components/useCopiar.js';
import TopoLogo from '../components/TopoLogo.jsx';
import { useSessao } from '../context/SessaoContext.jsx';
import { api } from '../services/api.js';
import { formatarMoeda } from '../utils/formatos.js';

function useContagem(expiraEm) {
  const [restante, setRestante] = useState(0);
  useEffect(() => {
    if (!expiraEm) return undefined;
    const calc = () => Math.max(0, Math.round((new Date(expiraEm) - Date.now()) / 1000));
    setRestante(calc());
    const id = setInterval(() => {
      const r = calc();
      setRestante(r);
      if (r <= 0) clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
  }, [expiraEm]);
  return restante;
}

export default function Pix() {
  const navigate = useNavigate();
  const { expirar } = useSessao();
  const [cobranca, setCobranca] = useState(null);
  const [aba, setAba] = useState('copia');
  const [erro, setErro] = useState('');
  const [pagando, setPagando] = useState(false);
  const [copiado, copiar] = useCopiar();
  const codigoRef = useRef();
  const restante = useContagem(cobranca?.expiraEm);

  useEffect(() => {
    let ativo = true;
    api.gerarPix()
      .then((c) => ativo && setCobranca(c))
      .catch((err) => {
        if (err.status === 401) expirar();
        else if (ativo) setErro(err.message);
      });
    return () => { ativo = false; };
  }, [expirar]);

  async function pagar() {
    setPagando(true);
    setErro('');
    try {
      const comprovante = await api.pagarPix(cobranca.txid);
      navigate('/pago', { replace: true, state: comprovante });
    } catch (err) {
      setErro(err.message);
      setPagando(false);
    }
  }

  const mm = String(Math.floor(restante / 60)).padStart(2, '0');
  const ss = String(restante % 60).padStart(2, '0');

  return (
    <main className="pagina">
      <TopoLogo icones />
      <button type="button" className="link-voltar" onClick={() => navigate(-1)}>&larr; Voltar</button>

      <section className="card pix">
        <h2>Pagamento via Pix</h2>

        {!cobranca && !erro && <p className="carregando">Gerando cobrança...</p>}
        {erro && <p className="erro">{erro}</p>}

        {cobranca && (
          <>
            <div className="pix-valor">
              <span>Valor a pagar</span>
              <strong>{formatarMoeda(cobranca.valor)}</strong>
            </div>

            <div className="abas" role="tablist">
              <button type="button" role="tab" className={'aba' + (aba === 'copia' ? ' ativa' : '')}
                aria-selected={aba === 'copia'} onClick={() => setAba('copia')}>Pix Copia e Cola</button>
              <button type="button" role="tab" className={'aba' + (aba === 'qr' ? ' ativa' : '')}
                aria-selected={aba === 'qr'} onClick={() => setAba('qr')}>QR Code</button>
            </div>

            {aba === 'qr' ? (
              <div className="painel">
                <p className="instrucao">Abra o app do seu banco, escolha <strong>Pagar com Pix</strong> e escaneie o código abaixo.</p>
                <div className="qr-box">
                  <QRCodeCanvas value={cobranca.codigo} size={200} level="M" />
                </div>
              </div>
            ) : (
              <div className="painel">
                <p className="instrucao">Copie o código abaixo e cole no app do seu banco, na opção <strong>Pix Copia e Cola</strong>.</p>
                <textarea className="pix-codigo" ref={codigoRef} value={cobranca.codigo} readOnly rows={5} />
                <button type="button" className="btn-secundario" onClick={() => copiar(cobranca.codigo, codigoRef.current)}>
                  {copiado ? 'Copiado!' : 'Copiar código Pix'}
                </button>
              </div>
            )}

            <div className="pix-info">
              <p><span>Beneficiário</span><strong>{cobranca.beneficiario}</strong></p>
              <p><span>Chave Pix</span><strong>{cobranca.chave}</strong></p>
              <p><span>Validade</span><strong>{mm}:{ss}</strong></p>
            </div>

            <button type="button" className="btn-continuar" onClick={pagar} disabled={pagando || restante <= 0}>
              {pagando ? 'Processando...' : restante <= 0 ? 'Pix expirado' : 'Realizar pagamento'}
            </button>
          </>
        )}
      </section>
    </main>
  );
}
