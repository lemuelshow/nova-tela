import { useCallback, useEffect, useRef, useState } from 'react';

// Copia um texto para a area de transferencia e sinaliza "copiado" por 1,5s
export function useCopiar() {
  const [copiado, setCopiado] = useState(false);
  const timer = useRef();

  useEffect(() => () => clearTimeout(timer.current), []);

  const copiar = useCallback(async (texto, campoEl) => {
    try {
      await navigator.clipboard.writeText(texto);
    } catch {
      campoEl?.select();
      document.execCommand('copy');
    }
    setCopiado(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopiado(false), 1500);
  }, []);

  return [copiado, copiar];
}
