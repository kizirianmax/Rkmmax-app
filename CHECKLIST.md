Crie um checklist em Markdown com o título:

# ✅ Checklist Projeto RKMMAX

Organize em seções numeradas, com status de cada item:  
- ✅ feito  
- ⚠️ pendente  
- ➡️ próximo  

---

## 1) Infra / Deploy
- ✅ netlify.toml — presente e OK
- ✅ .gitignore — ignora node_modules/, .env, src/config/plans.json
- ✅ .env.local — 6 variáveis (BR/US) confirmadas
- ✅ README.md — existe (pendente revisão final)
- ✅ public/index.html — SEO + OG/Twitter + PWA + SW register
- ✅ public/manifest.json — PWA Android/iOS
- ✅ public/service-worker.js — cache estático/runtime
- ⚠️ DNS/GoDaddy — registros A e CNAME configurados (aguardando propagação)
- ➡️ SSL/HTTPS (Let’s Encrypt) — ativar no Netlify quando domínio responder

---

## 2) Stripe / Planos
- ✅ src/config/plans.json — 6 planos (BR/US: básico, intermediário, premium)
- ✅ netlify/functions/prices.js — lista preços ativos por região/tier
- ✅ netlify/functions/checkout.js — endpoint único de checkout
- ✅ netlify/functions/stripe-webhook.js — valida assinatura + atualiza Supabase

---

## 3) Controle de uso / Billing interno
- ✅ netlify/functions/_usage.js — getUsage / setUsage
- ✅ netlify/functions/guardAndBill.js — limites por plano/modelo (diário + mensal GPT-5)
- ✅ netlify/functions/chat.js — escolhe modelo, chama guardAndBill + OpenAI API

---

## 4) Utilidades / Outros
- ✅ netlify/functions/cors.js — CORS básico
- ✅ netlify/functions/contact.js — endpoint simples de contato
- ✅ netlify/functions/status.js — healthcheck
- ⚠️ src/README arquitetura (pendente)

---

## 5) Avatares / UI
- ⚠️ public/avatars/ — 13 arquivos SVG/PNG organizados
- ⚠️ src/data/avatars.json — mapeamento { agente: "/avatars/arquivo.svg" }
- ⚠️ Integração no UI — usar avatars[agent]

---

## 6) Testes / Qualidade
- ⚠️ Testar PWA (Android/iOS)
- ⚠️ Testar Checkout BR/US com lookup_key real e cupons
- ⚠️ Testar Webhook Stripe em produção (Netlify)
- ⚠️ Revisar CORS e headers de segurança
- ⚠️ Documentar variáveis .env no README

---

## 7) Agentes Visíveis
- ✅ 13 agentes conectados (Serginho + 12 especialistas)
- ✅ Avatares carregados (parcial, revisão final pendente)
- ✅ Descrições configuradas

---

## 8) Agentes Ocultos (Novo diferencial)
- ⚠️ Criar especialistas invisíveis (base de conhecimento, otimização, validação de fontes)
- ⚠️ Configurar acesso apenas via Serginho
- ⚠️ Usar ocultos p/ reduzir custo (menos GPT-5, mais GPT-4 mini + ocultos)

---

## 9) Serginho — Núcleo Inteligente
- ⚠️ Configurar aprendizado ilimitado (fontes confiáveis)
- ⚠️ Balanceamento automático p/ evitar viés/excesso
- ⚠️ Delegar tarefas a ocultos p/ reduzir GPT-5
- ⚠️ Evolução contínua: + agentes ocultos = Serginho mais forte

---

## 10) Fluxo Premium / UX
- ⚠️ Tela padrão → botão único “Falar com Serginho”
- ⚠️ Plano Básico/Intermediário → só Serginho responde
- ⚠️ Plano Premium → botão “Explorar Especialistas”
- ⚠️ Diferencial claro: exclusividade Premium

---

📌 Observação final:  
Esse fluxo (Serginho central, agentes ocultos, Premium) garante **simplicidade p/ iniciantes + exclusividade p/ avançados + otimização de custos no back-end**.
