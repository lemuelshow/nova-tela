import { useCallback, useEffect, useState } from 'react';
import { adminApi } from '../../services/api.js';
import { formatarDataHora, formatarMoeda } from '../../utils/formatos.js';

export default function AbaAcessos({ token, onExpirar }) {
  const [dados, setDados] = useState(null);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro('');
    try {
      setDados(await adminApi.acessos(token));
    } catch (err) {
      if (err.status === 401) onExpirar();
      else setErro(err.message);
    } finally {
      setCarregando(false);
    }
  }, [token, onExpirar]);

  useEffect(() => { carregar(); }, [carregar]);

  return (
    <section className="card">
      <div className="admin-cabecalho-card">
        <h2>Acessos ao sistema</h2>
        <button type="button" className="link-sair" onClick={carregar} disabled={carregando}>
          {carregando ? 'Atualizando...' : 'Atualizar'}
        </button>
      </div>

      {erro && <p className="erro">{erro}</p>}
      {!dados && !erro && <p className="carregando">Carregando...</p>}

      {dados && (
        <>
          <div className="admin-kpis">
            <div className="kpi kpi-destaque">
              <strong>{dados.totalCpfs}</strong>
              <span>CPFs que acessaram</span>
            </div>
            <div className="kpi">
              <strong>{dados.totalAcessos}</strong>
              <span>Acessos no total</span>
            </div>
            <div className="kpi">
              <strong>{dados.cpfsHoje}</strong>
              <span>CPFs hoje</span>
            </div>
          </div>

          {dados.cpfs.length === 0 ? (
            <p className="carregando">Nenhum acesso registrado ainda.</p>
          ) : (
            <div className="tabela-wrap">
              <table className="tabela">
                <thead>
                  <tr><th>CPF</th><th>Acessos</th><th>Último acesso</th><th>Último valor</th></tr>
                </thead>
                <tbody>
                  {dados.cpfs.map((c) => (
                    <tr key={c.cpf}>
                      <td>{c.cpf}</td>
                      <td className="num">{c.acessos}</td>
                      <td>{formatarDataHora(c.ultimoAcesso)}</td>
                      <td className="num">{c.ultimoValor != null ? formatarMoeda(c.ultimoValor) : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </section>
  );
}
