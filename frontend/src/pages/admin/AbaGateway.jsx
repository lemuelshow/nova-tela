import { useEffect, useState } from 'react';
import { adminApi } from '../../services/api.js';
import { formatarDataHora } from '../../utils/formatos.js';

const VAZIO = {
  urlBase: '',
  chavePublica: '',
  chaveSecreta: '',
  webhookUrl: '',
  ambiente: 'sandbox',
  ativo: false,
};

export default function AbaGateway({ token, onExpirar }) {
  const [form, setForm] = useState(VAZIO);
  const [salvo, setSalvo] = useState(null);
  const [erro, setErro] = useState('');
  const [msg, setMsg] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  function tratarErro(err) {
    if (err.status === 401) onExpirar();
    else setErro(err.message);
  }

  useEffect(() => {
    adminApi.gateway(token)
      .then((g) => {
        if (g) {
          setSalvo(g);
          setForm({ ...VAZIO, ...g, chaveSecreta: '' });
        }
      })
      .catch(tratarErro)
      .finally(() => setCarregando(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  function alterar(campo, valor) {
    setForm((f) => ({ ...f, [campo]: valor }));
    setErro('');
    setMsg('');
  }

  async function salvar(e) {
    e.preventDefault();
    setSalvando(true);
    setErro('');
    setMsg('');
    try {
      const g = await adminApi.salvarGateway(token, form);
      setSalvo(g);
      setForm({ ...VAZIO, ...g, chaveSecreta: '' });
      setMsg('Gateway salvo com sucesso.');
    } catch (err) {
      tratarErro(err);
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) return <section className="card"><p className="carregando">Carregando...</p></section>;

  return (
    <section className="card">
      <div className="admin-cabecalho-card">
        <h2>Gateway de pagamento</h2>
        <span className={'status ' + (salvo?.ativo ? 'status-ativo' : 'status-inativo')}>
          {salvo ? (salvo.ativo ? 'Ativo' : 'Inativo') : 'Não cadastrado'}
        </span>
      </div>

      <p className="instrucao">
        Provedor: <strong>AmploPay</strong> &middot;{' '}
        <a href="https://app.amplopay.com/docs/v1" target="_blank" rel="noreferrer">documentação da API</a>
      </p>

      <form onSubmit={salvar} noValidate className="form-admin">
        <label className="rotulo" htmlFor="gw-url">URL base da API</label>
        <input id="gw-url" className="campo campo-menor" value={form.urlBase}
          onChange={(e) => alterar('urlBase', e.target.value)} placeholder="Confirme na documentação da AmploPay" />

        <label className="rotulo" htmlFor="gw-ambiente">Ambiente</label>
        <select id="gw-ambiente" className="campo campo-menor" value={form.ambiente}
          onChange={(e) => alterar('ambiente', e.target.value)}>
          <option value="sandbox">Sandbox (testes)</option>
          <option value="producao">Produção</option>
        </select>

        <label className="rotulo" htmlFor="gw-pub">Chave pública</label>
        <input id="gw-pub" className="campo campo-menor" value={form.chavePublica} autoComplete="off"
          onChange={(e) => alterar('chavePublica', e.target.value)} />

        <label className="rotulo" htmlFor="gw-sec">Chave secreta</label>
        <input id="gw-sec" type="password" className="campo campo-menor" value={form.chaveSecreta}
          autoComplete="new-password" onChange={(e) => alterar('chaveSecreta', e.target.value)}
          placeholder={salvo?.possuiChaveSecreta ? `Atual: ${salvo.chaveSecretaMascarada} (deixe em branco para manter)` : ''} />

        <label className="rotulo" htmlFor="gw-hook">URL de webhook (opcional)</label>
        <input id="gw-hook" className="campo campo-menor" value={form.webhookUrl}
          onChange={(e) => alterar('webhookUrl', e.target.value)} placeholder="https://seu-dominio.com/api/webhooks/amplopay" />

        <label className="check">
          <input type="checkbox" checked={form.ativo} onChange={(e) => alterar('ativo', e.target.checked)} />
          <span>Usar este gateway para os pagamentos Pix</span>
        </label>

        {erro && <p className="erro">{erro}</p>}
        {msg && <p className="sucesso-msg">{msg}</p>}

        <button type="submit" className="btn-continuar" disabled={salvando}>
          {salvando ? 'Salvando...' : 'Salvar gateway'}
        </button>

        {salvo?.atualizadoEm && (
          <p className="login-rodape">Última atualização: {formatarDataHora(salvo.atualizadoEm)}</p>
        )}
      </form>
    </section>
  );
}
