# MAINTENANCE — RKMMax (Atualizado)

> Runbook de operação e manutenção (5–10 min/dia).  
> **Fonte de verdade:** repositório GitHub (`main`). Deploy 100% no **Netlify**.

## 0) Visão geral
- **Frontend:** React (CRA) no **Netlify**.
- **Serverless Functions:** **Netlify** (`/netlify/functions/*`).
- **Billing:** Stripe (checkout em `/.netlify/functions/checkout`; webhooks futuros).
- **Banco:** Supabase.

## 1) Rotina rápida (diária)
- ✅ Netlify → Deploys: último deploy verde no `main`.
- ✅ Netlify → Functions logs: `_usage`, `guardAndBill`, `chat`, `checkout`, `status`.
- ✅ Stripe → Payments / Logs (Live/Test).
- ✅ Supabase → usuários novos e flag de plano (por enquanto manual).

## 2) Variáveis (Netlify → Site settings → Environment variables)
Frontend:
- `REACT_APP_SUPABASE_URL`
- `REACT_APP_SUPABASE_ANON_KEY`

Functions:
- `STRIPE_SECRET_KEY_RKMMAX`
- `STRIPE_WEBHOOK_SECRET` *(quando ativar webhook)*
- `OPENAI_API_KEY` *(se usado em `chat.js`)*

Obs.: `SITE_URL`/`URL` o Netlify injeta em produção (usado em `checkout.js`).  
Após mudar envs → **trigger deploy**.

## 3) Deploy
- Automático ao commitar em `main`.
- Build (CRA):
  - **Command:** `npm run build`
  - **Publish directory:** `build`
  - **Functions:** `netlify/functions`
- SPA redirect: `public/_redirects` com `/*  /index.html  200`.

### Local
```bash
npm install
npm start
# ou:
# netlify dev   # precisa do Netlify CLI
