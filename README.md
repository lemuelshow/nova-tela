# Modelo Tela

Projeto com **backend em Node.js (Express)** e **frontend em React (Vite)**, baseado no `index.html` original (mantido na raiz como referência).

## Estrutura

```
modelo-tela/
├── backend/                 API Node.js + Express (porta 3001)
│   └── src/
│       ├── server.js
│       ├── data/mock.js       dados ficticios (cliente, fatura, recebedor)
│       ├── middleware/auth.js valida token Bearer
│       ├── routes/            auth, fatura, pix
│       └── services/          cpf, pix (BR Code + CRC16), sessao (memoria)
├── frontend/                React + Vite (porta 5173, proxy /api -> 3001)
│   └── src/
│       ├── pages/             Login, Principal, Pix, Pago
│       ├── components/        Logo, useCopiar
│       ├── context/           SessaoContext (token em sessionStorage)
│       ├── services/api.js    chamadas HTTP
│       └── utils/formatos.js  mascara/validacao CPF, moeda, data
└── index.html               modelo original (referencia)
```

## Como rodar

```bash
npm run install:all   # instala raiz, backend e frontend
npm run dev           # sobe API (3001) e React (5173) juntos
```

Acesse http://localhost:5173

### Producao

```bash
npm run build   # gera frontend/dist
npm start       # Express serve a API e o build em http://localhost:3001
```

## Endpoints

| Metodo | Rota                     | Descricao                          |
|--------|--------------------------|------------------------------------|
| POST   | `/api/auth/login`        | `{ cpf }` -> `{ token, cliente }`  |
| GET    | `/api/auth/me`           | dados do cliente logado            |
| POST   | `/api/auth/logout`       | encerra a sessao                   |
| GET    | `/api/fatura`            | valores exibidos na tela principal |
| POST   | `/api/pix`               | gera cobranca Pix (codigo + txid)  |
| POST   | `/api/pix/:txid/pagar`   | simula a confirmacao do pagamento  |

Rotas (exceto login) exigem `Authorization: Bearer <token>`.
Sessoes e cobrancas ficam em memoria — reiniciar a API desloga os usuarios.

## Administrador (`/administrador`)

- Login com `ADMIN_USUARIO` / `ADMIN_SENHA` (variaveis de ambiente). Padrao em dev: `admin` / `admin123`.
- Aba **Acessos**: quantidade de CPFs distintos que acessaram, total de acessos, CPFs do dia e lista por CPF.
- Aba **Gateway de pagamento**: cadastro da AmploPay (URL base, ambiente, chave publica, chave secreta, webhook, ativo).
  A chave secreta nunca volta para o navegador (so mascarada).
- Dados gravados em `backend/data/db.json` (fora do git).

| Metodo | Rota                  | Descricao                          |
|--------|-----------------------|------------------------------------|
| POST   | `/api/admin/login`    | `{ usuario, senha }` -> `{ token }`|
| POST   | `/api/admin/logout`   | encerra a sessao admin             |
| GET    | `/api/admin/acessos`  | resumo de acessos por CPF          |
| GET    | `/api/admin/gateway`  | configuracao do gateway            |
| PUT    | `/api/admin/gateway`  | salva configuracao do gateway      |

## Deploy no Render

Configurado via `render.yaml` (Blueprint): **um unico Web Service** Node que builda o React e sobe o Express,
servindo a API (`/api/*`) e o front no mesmo dominio (sem CORS, sem URL de API para configurar).

1. Suba o projeto para um repositorio Git (GitHub/GitLab).
2. No Render: **New > Blueprint** e selecione o repositorio (ele le o `render.yaml`).
3. Ajuste `ADMIN_USUARIO` / `ADMIN_SENHA` em **Environment** (a senha e gerada aleatoriamente no primeiro deploy).

| Item          | Valor                       |
|---------------|-----------------------------|
| Build Command | `npm run render-build`      |
| Start Command | `npm start`                 |
| Health check  | `/api/health`               |
| Node          | 22 (`NODE_VERSION`)         |

Variaveis de ambiente: `PORT` (o Render define), `ADMIN_USUARIO`, `ADMIN_SENHA`, `DATA_DIR` (opcional, pasta do `db.json`).

> **Persistencia:** no plano free o disco e efemero — acessos e gateway (`db.json`) zeram a cada deploy/restart,
> e o servico "dorme" apos ~15 min sem acesso. Para manter os dados, use plano pago com disco
> (bloco `disk` comentado no `render.yaml`) e `DATA_DIR=/var/data`.
