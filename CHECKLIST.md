# ✅ Checklist do Projeto RKMMAX

Status: acompanhamento dos arquivos já conferidos/ajustados e dos próximos passos.

---

## 1) Infra / Deploy
- [x] `netlify.toml` — presente e OK (funções em `/netlify/functions`).
- [x] `.gitignore` — ignora `node_modules/`, `.env`, e `src/config/plans.json`.
- [x] `.env.local` — 6 variáveis (BR/US) confirmadas.
- [x] `README.md` — existe (revisar depois com instruções finais).
- [x] `public/index.html` — SEO + OG/Twitter + PWA + SW register.
- [x] `public/manifest.json` — PWA (Android/iOS) com tema `#0f172a`.
- [x] `public/service-worker.js` — cache estático e runtime (v1.1).

---

## 2) Stripe / Planos
- [x] `src/config/plans.json` — **6 planos** (BR: básico/intermediário/premium • US: basic/intermediate/premium).
- [x] `netlify/functions/prices.js` — lista preços ativos por região/tier (com `expand: ["data.product"]`).
- [x] `netlify/functions/plans.js` — helpers (`getPlanByKey`, `getPlanById`, `ALLOWED_LOOKUP_KEYS`).
- [x] `netlify/functions/checkout.js` — **único** endpoint de checkout (via `lookup_key`).
- [x] `netlify/functions/stripe-webhook.js` — valida assinatura e faz upsert na Supabase (status/período).

---

## 3) Controle de uso / Billing interno
- [x] `netlify/functions/_usage.js` — `getUsage` / `setUsage` (tabelas `usage_daily` e `usage_monthly_5`).
- [x] `netlify/functions/guardAndBill.js` — aplica limites por plano/modelo (diário + mensal GPT-5).
- [x] `netlify/functions/chat.js` — escolhe modelo (`src/lib/modelPicker.js`), chama `guardAndBill` e OpenAI Responses API.

---

## 4) Utilidades / Outros
- [x] `netlify/functions/cors.js` — CORS básico (usa `ORIGIN` se definido).
- [x] `netlify/functions/contact.js` — endpoint simples de contato (CORS habilitado).
- [x] `netlify/functions/status.js` — healthcheck (uptime/timestamp).
- [x] `src/components/Logout.jsx` — corrigido.
- [ ] `src/README` de arquitetura — (pendente) explicar fluxo Stripe → Webhook → Supabase → Guard/Billing.
- [x] `src/pages/Home.jsx` — corrigido (cards: Serginho + Planos → links `/agents` e `/pricing`).
- [x] `src/App.jsx` — rotas configuradas (Home, Agents, Pricing).
- [x] `src/pages/Pricing.jsx` — atualizado com links reais do Stripe.
- [x] `src/pages/Agents.jsx` — criado e funcional.

---

## 5) Avatares / Branding (próximos)
- [ ] `public/avatars/` — **13 SVGs** (Serginho + 12 agentes) dentro do repo.
- [ ] `src/data/avatars.json` — mapeamento `{ agente: "/avatars/arquivo.svg" }`.
- [ ] Integração no UI — usar `avatars[agent]` onde exibe cada agente.

---

## 6) Testes / Qualidade (próximos)
- [ ] Testar PWA (Android/iOS) — splash, ícones, offline básico.
- [ ] Testar Checkout (BR/US) com `lookup_key` real e cupons.
- [ ] Testar Webhook em produção (Netlify) com `endpoint secret`.
- [ ] Revisar políticas de CORS (produção) e headers de segurança.
- [ ] Documentar variáveis `.env` no `README`.

---

## Observações rápidas
- O endpoint de **checkout oficial** é `netlify/functions/checkout.js`.
- O **webhook Stripe** requer `STRIPE_WEBHOOK_SECRET` e **raw body** (já tratado no handler).
- **Supabase no backend** deve usar **SERVICE ROLE KEY** (nunca no frontend).
