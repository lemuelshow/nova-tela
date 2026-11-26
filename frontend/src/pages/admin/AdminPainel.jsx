import { useState } from 'react';
import TopoLogo from '../../components/TopoLogo.jsx';
import AbaAcessos from './AbaAcessos.jsx';
import AbaGateway from './AbaGateway.jsx';

export default function AdminPainel({ token, onSair, onExpirar }) {
  const [aba, setAba] = useState('acessos');

  return (
    <main className="pagina pagina-admin">
      <div className="admin-topo">
        <TopoLogo />
        <button type="button" className="link-sair" onClick={onSair}>Sair</button>
      </div>

      <h1 className="admin-titulo">Painel do administrador</h1>

      <div className="abas" role="tablist">
        <button type="button" role="tab" className={'aba' + (aba === 'acessos' ? ' ativa' : '')}
          aria-selected={aba === 'acessos'} onClick={() => setAba('acessos')}>Acessos</button>
        <button type="button" role="tab" className={'aba' + (aba === 'gateway' ? ' ativa' : '')}
          aria-selected={aba === 'gateway'} onClick={() => setAba('gateway')}>Gateway de pagamento</button>
      </div>

      {aba === 'acessos'
        ? <AbaAcessos token={token} onExpirar={onExpirar} />
        : <AbaGateway token={token} onExpirar={onExpirar} />}
    </main>
  );
}
