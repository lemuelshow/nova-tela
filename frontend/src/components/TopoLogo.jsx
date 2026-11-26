function IconeLupa() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" strokeWidth="2.2" />
      <path d="M15.5 15.5 21 21" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

function IconeAjuda() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M9.2 9.3a2.9 2.9 0 0 1 5.6 1c0 2-2.8 2.4-2.8 4.2" fill="none" stroke="currentColor"
        strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="17.6" r="1.25" fill="currentColor" />
    </svg>
  );
}

function IconeMeiaBola() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#fff" />
      <path d="M12 2a10 10 0 0 1 0 20z" fill="currentColor" />
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export default function TopoLogo({ icones = false }) {
  return (
    <div className="topo-logo">
      <img src="/logo.png" alt="Lorem Ipsum" />
      {icones && (
        <div className="topo-icones">
          <button type="button" className="icone-btn" aria-label="Pesquisar" title="Pesquisar"><IconeLupa /></button>
          <button type="button" className="icone-btn" aria-label="Ajuda" title="Ajuda"><IconeAjuda /></button>
          <button type="button" className="icone-btn" aria-label="Contraste" title="Contraste"><IconeMeiaBola /></button>
        </div>
      )}
    </div>
  );
}
