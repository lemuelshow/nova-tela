import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Persistencia simples em arquivo JSON (backend/data/db.json, ou $DATA_DIR/db.json)
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIRETORIO = process.env.DATA_DIR || path.resolve(__dirname, '../../data');
const ARQUIVO = path.join(DIRETORIO, 'db.json');

const PADRAO = { acessos: [], gateway: null };

function carregar() {
  try {
    return { ...PADRAO, ...JSON.parse(fs.readFileSync(ARQUIVO, 'utf8')) };
  } catch {
    return structuredClone(PADRAO);
  }
}

let dados = carregar();

function gravar() {
  fs.mkdirSync(path.dirname(ARQUIVO), { recursive: true });
  const tmp = ARQUIVO + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(dados, null, 2));
  fs.renameSync(tmp, ARQUIVO);
}

export function registrarAcesso(cpf, valores) {
  dados.acessos.push({ cpf, data: new Date().toISOString(), valorPagar: valores?.valorPagar });
  gravar();
}

export function resumoAcessos() {
  const porCpf = new Map();
  for (const a of dados.acessos) {
    const atual = porCpf.get(a.cpf) || { cpf: a.cpf, acessos: 0, primeiroAcesso: a.data, ultimoAcesso: a.data };
    atual.acessos += 1;
    if (a.data >= atual.ultimoAcesso) {
      atual.ultimoAcesso = a.data;
      atual.ultimoValor = a.valorPagar ?? null;
    }
    if (a.data < atual.primeiroAcesso) atual.primeiroAcesso = a.data;
    porCpf.set(a.cpf, atual);
  }
  const hoje = new Date().toISOString().slice(0, 10);
  const cpfsHoje = new Set(dados.acessos.filter((a) => a.data.startsWith(hoje)).map((a) => a.cpf));
  return {
    totalCpfs: porCpf.size,
    totalAcessos: dados.acessos.length,
    cpfsHoje: cpfsHoje.size,
    cpfs: [...porCpf.values()].sort((a, b) => b.ultimoAcesso.localeCompare(a.ultimoAcesso)),
  };
}

export function obterGateway() {
  return dados.gateway;
}

export function salvarGateway(gateway) {
  dados.gateway = gateway;
  gravar();
  return gateway;
}
