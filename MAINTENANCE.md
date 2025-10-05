# MAINTENANCE — RKMMax

> Runbook de operação e manutenção (5–10 min por dia).

## 0) Visão geral
- Frontend: React (CRA) no Vercel.
- Functions: Netlify (`/netlify/functions/*`).
- Billing: Stripe (Payment Links + Webhooks futuros).
- Banco: Supabase.

## 1) Rotina rápida (diária)
- ✅ Vercel > Deploys: tudo verde? Último deploy é o esperado?
- ✅ Netlify > Functions: erros nas funções `_usage`, `guardAndBill`, `chat`?
- ✅ Stripe > Payments/Webhooks: pagamentos falhando?
- ✅ Supabase > Tabelas: usuários novos / flag de plano correta?

## 2) Ambientes / Variáveis
- **Vercel (.env)**
  - `REACT_APP_SUPABASE_URL`
  - `REACT_APP_SUPABASE_ANON_KEY`
- **Stripe**
  - Payment Links colados em `src/components/Subscribe.jsx`
  - (futuro) Webhook secret no provedor escolhido (Vercel ou Netlify)
- **Netlify**
  - Configure variáveis se migrar as functions para lá/usar webhooks.

## 3) Deploy
- Deploy automático ao fazer commit no `main` (Vercel).
- Para testar local:  
  ```bash
  npm install
  npm start
