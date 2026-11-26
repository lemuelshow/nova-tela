export function somenteDigitos(v = '') {
  return String(v).replace(/\D/g, '');
}

export function formatarCpf(v) {
  return somenteDigitos(v).replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

export function cpfValido(v) {
  const c = somenteDigitos(v);
  if (c.length !== 11 || /^(\d)\1{10}$/.test(c)) return false;
  for (let t = 9; t < 11; t++) {
    let soma = 0;
    for (let i = 0; i < t; i++) soma += Number(c[i]) * (t + 1 - i);
    const dig = ((soma * 10) % 11) % 10;
    if (dig !== Number(c[t])) return false;
  }
  return true;
}
