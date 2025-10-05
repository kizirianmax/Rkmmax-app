# RKMMax App

Aplicação web do **RKMMax Infinity | Matrix/Study** (React + Vercel), com billing via **Stripe** e dados no **Supabase**.  
Back-end leve em **Netlify Functions** (webhooks e utilidades).

---

## Operação e Manutenção

- Runbook rápido: **[MAINTENANCE.md](./MAINTENANCE.md)**
- Progresso geral do projeto: **[CHECKLIST.md](./CHECKLIST.md)**

---

## Como rodar localmente

> Pré-requisitos: Node 18+ e npm.

```bash
# 1) Dependências
npm install

# 2) Variáveis de ambiente
# Crie um arquivo .env.local na raiz com:
# REACT_APP_SUPABASE_URL=coloque_a_url_do_seu_projeto
# REACT_APP_SUPABASE_ANON_KEY=coloque_a_sua_anon_key

# 3) Subir o app
npm start
