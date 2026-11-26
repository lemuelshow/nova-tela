// Dados ficticios usados pela API (substituir por banco/integracao real)
export const clientes = {
  padrao: { nome: 'Fulano de Tal' },
};

export const fatura = {
  titulo: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod:',
};

function sortear(min, max) {
  return min + Math.random() * (max - min);
}

function centavos(valor) {
  return Math.round(valor * 100) / 100;
}

// Valores aleatorios gerados a cada acesso (login)
export function gerarValores() {
  const valorTotal = centavos(sortear(150, 1500));
  const valorPagar = centavos(valorTotal * sortear(0.2, 0.5));
  const valorAlerta = Math.round(sortear(800, 5000));
  return { valorTotal, valorPagar, valorAlerta };
}

export const recebedor = {
  nome: 'Lorem Ipsum Ltda',
  chave: 'lorem@ipsum.com.br',
  cidade: 'SAO PAULO',
};

export const PIX_VALIDADE_MIN = 30;
