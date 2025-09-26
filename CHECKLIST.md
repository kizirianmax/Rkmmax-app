# ✅ Checklist Projeto RKMMAX

## 1) Infra / Deploy
- [x] `netlify.toml` — presente e OK.
- [x] `.gitignore` — ignora `node_modules/`, `.env`, `src/config/plans.json`.
- [x] `.env.local` — 6 variáveis (BR/US) confirmadas.
- [x] `README.md` — existe (pendente revisão final).
- [x] `public/index.html` — SEO + OG/Twitter + PWA + SW register.
- [x] `public/manifest.json` — PWA (Android/iOS).
- [x] `public/service-worker.js` — cache estático/runtime.

---

## 2) Stripe / Planos
- [x] `src/config/plans.json` — 6 planos (BR/US: básico, intermediário, premium).
- [x] `netlify/functions/prices.js` — lista preços ativos por região/tier.
- [x] `netlify/functions/checkout.js` — único endpoint de checkout.
- [x] `netlify/functions/stripe-webhook.js` — valida assinatura e atualiza Supabase.

---

## 3) Controle de uso / Billing interno
- [x] `netlify/functions/_usage.js` — `getUsage` / `setUsage`.
- [x] `netlify/functions/guardAndBill.js` — aplica limites por plano/modelo (diário + mensal GPT-5).
- [x] `netlify/functions/chat.js` — escolhe modelo, chama `guardAndBill` e OpenAI API.

---

## 4) Utilidades / Outros
- [x] `netlify/functions/cors.js` — CORS básico.
- [x] `netlify/functions/contact.js` — endpoint simples de contato.
- [x] `netlify/functions/status.js` — healthcheck.
- [ ] `src/README` arquitetura (pendente).
- [x] `src/components/Logout.jsx` — corrigido.
- [x] `src/pages/Home.jsx` — corrigido (cards Serginho + Planos).
- [x] `src/pages/Pricing.jsx` — atualizado com links reais do Stripe.
- [x] `src/pages/Agents.jsx` — criado e funcional.
- [x] `src/App.jsx` — rotas configuradas (Home, Agents, Pricing).

---

## 5) Avatares / UI
- [ ] `public/avatars/` — 13 arquivos (SVG já ok, avaliar PNG futuro).
- [ ] `src/data/avatars.json` — mapeamento `{ agente: "/avatars/arquivo.svg" }`.
- [ ] Integração no UI — usar `avatars[agent]`.

---

## 6) Testes / Qualidade
- [ ] Testar PWA (Android/iOS).
- [ ] Testar Checkout BR/US com `lookup_key` real e cupons.
- [ ] Testar Webhook em produção (Netlify).
- [ ] Revisar políticas de CORS e headers de segurança.
- [ ] Documentar variáveis `.env` no `README`.

---

## 7) Agentes Visíveis
- [x] 13 agentes conectados → Serginho + 12 especialistas.
- [x] Avatares carregados.
- [x] Descrições configuradas.

---

## 8) Agentes Ocultos (Novo diferencial)
- [ ] Criar **especialistas invisíveis** para reforço de áreas críticas (base de conhecimento, otimização, validação de fontes).
- [ ] Todos ficam acessíveis **apenas via Serginho** (usuário não vê).
- [ ] Usados para reduzir custo (menos GPT-5, mais GPT-4 mini + especialistas ocultos).

---

## 9) Serginho – Núcleo Inteligente
- [ ] Configurar **aprendizado ilimitado** (sempre de fontes confiáveis).
- [ ] Balanceamento automático para evitar viés/excesso.
- [ ] Sempre que possível, delegar tarefas a especialistas ocultos → reduzir dependência do GPT-5.
- [ ] Evolução contínua: quanto mais agentes ocultos, mais forte o Serginho.

---

## 10) Fluxo Premium / UX
- [ ] Tela padrão → botão único **“Falar com Serginho”**.
- [ ] Se plano = Básico/Intermediário → só Serginho responde.
- [ ] Se plano = Premium → liberar botão **“Explorar Especialistas”** com acesso direto aos 12 agentes.
- [ ] Diferencial claro: **exclusividade Premium**.

---

📌 **Observação:** Esse fluxo (Serginho central, agentes ocultos e painel Premium) cria **simplicidade para iniciantes** + **exclusividade para avançados** + **otimização de custos no back-end**.
