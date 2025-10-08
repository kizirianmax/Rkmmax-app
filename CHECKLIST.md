# ✅ Checklist Projeto RKMMax (Atualizado — 08/10/2025)
Legendas: ✅ feito | ⚠️ pendente | ⏭️ próximo

## 1) Infra / Deploy
- ✅ Importar repo no Vercel
- ✅ Framework: Create React App
- ✅ Variáveis no Vercel:
  - REACT_APP_SUPABASE_URL
  - REACT_APP_SUPABASE_ANON_KEY
  - (opcional p/ fallback) REACT_APP_BACKEND_PROVIDER=auto
  - (opcional p/ fallback) REACT_APP_FUNCTIONS_BASE_URL=https://SEU_SITE.netlify.app
- ✅ Deploy produção (rkmmax-app.vercel.app)
- ⚠️ Conectar domínio custom no Vercel + SSL
- ⚠️ README final (documentar env, fluxo, segurança)

## 2) Stripe / Planos
- ✅ src/config/plans.json (6 planos BR/US)
- ✅ Payment Link – Premium BR criado e colado no Subscribe.jsx
- ⏭️ Payment Link – Premium US (criar e colar no Subscribe.jsx)
- ⚠️ Webhooks: decidir migração (Vercel) ou manter Netlify
- ⏭️ Testar checkout BR e depois US

## 3) Controle de uso / Billing interno
- ✅ netlify/functions/_usage.js
- ✅ netlify/functions/guardAndBill.js (limites diário/mensal) — **imports corrigidos**
- ✅ netlify/functions/chat.js (seleção de modelo + billing) — **imports corrigidos**
- ✅ src/lib/planCaps.js **unificado** (PLAN, LIMITS, FEATURES, capsByPlan) — **export default + nomeado**
- ⏭️ (se usar) webhook Stripe para marcar Premium automático

## 4) Utilidades / Outros
- ✅ netlify/functions/cors.js
- ✅ netlify/functions/contact.js
- ✅ netlify/functions/status.js
- ⚠️ README de arquitetura

## 5) Avatares / UI
- ✅ public/avatars/ (SVG/PNG)
- ✅ src/data/avatars.json (mapeamento)
- ✅ Integração no UI (Serginho + Especialistas)
- ⏭️ Revisão final dos 13 avatares

## 6) Testes / Qualidade
- ⏭️ Testar PWA (Android/iOS)
- ⏭️ Testar checkout BR (Payment Link novo)
- ⏭️ Testar checkout US
- ⚠️ Testar Webhook Stripe em produção
- ⚠️ Revisar CORS e headers de segurança
- ⚠️ Documentar variáveis .env no README

## 7) Agentes Visíveis
- ✅ 13 agentes conectados (Serginho + 12)
- ✅ Descrições configuradas
- ⏭️ Conferência visual final (avatares e textos)

## 8) Agentes Ocultos (Novo diferencial)
- ⚠️ Criar especialistas invisíveis (base/otimização/validação)
- ⚠️ Acesso apenas via Serginho
- ⚠️ Orquestração p/ reduzir custo (menos GPT-5, mais GPT-4 mini + ocultos)

## 9) Serginho — Núcleo Inteligente
- ⚠️ Aprendizado ilimitado (fontes confiáveis)
- ⚠️ Balanceamento automático
- ⚠️ Delegar tarefas a ocultos
- ⚠️ Evolução contínua (mais agentes ocultos)

## 10) Fluxo Premium / UX
- ✅ Tela padrão: botão “Falar com Serginho”
- ✅ Básico/Intermediário → só Serginho
- ✅ Premium → botão “Explorar Especialistas”
- ⏭️ Marcar usuário Premium pós-compra
  - (por enquanto manual no Supabase; depois automatizar via webhook)

## 11) Banco de Dados / Supabase
- ✅ pgvector movido do schema `public` → `extensions` (verificado)
- ✅ Auth (Email) fortalecida:
  - Minimum password length: **8**
  - Password requirements: **lowercase + UPPERCASE + dígitos + símbolos**
  - Email OTP expiration: **600s** (10 min)
  - Secure email change: **ON**
- ✅ Reinício do Postgres (Project Settings → Restart database)
- ✅ Security Advisor sem **Errors**
- ⚠️ Avisos restantes (ok manter no Free):
  - “Leaked Password Protection Disabled” → recurso **Pro**
  - “Postgres version has security patches available” → informativo do provedor
- ⏭️ RLS/Policies nas tabelas novas (`user_profiles`, `trusted_chunks`, `user_actions`/embeddings)

## 12) Integração Vercel ↔ Netlify (frontend chama funções)
- ✅ Criado `src/lib/fnClient.js` (fallback: Vercel `/api` → Netlify `/.netlify/functions`)
- ⏭️ **Passo 2**: trocar `fetch('/.netlify/functions/...')` por `callFn('/...')` nos arquivos do **frontend**
- (opcional) ⚠️ Criar `src/patchNetlifyFetch.js` e importar em `src/index.js` para interceptar automaticamente chamadas antigas
- ✅ Deploys automáticos no Netlify (cada push na `main` publica)
- ✅ Último deploy **Published** (imports corrigidos)
