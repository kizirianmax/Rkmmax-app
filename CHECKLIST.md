# ✅ Checklist Projeto RKMMax (Atualizado — 10/10/2025)
Legendas: ✅ feito | ⚠️ pendente | ⏭️ próximo

1) Infra / Vercel
- ✅ Importar repo no Vercel
- ✅ Framework: Create React App
- ✅ Variáveis no Vercel
  - REACT_APP_SUPABASE_URL
  - REACT_APP_SUPABASE_ANON_KEY
  - (opcional) REACT_APP_BACKEND_PROVIDER=auto
  - (opcional) REACT_APP_FUNCTIONS_BASE_URL=https://SEU_SITE.netlify.app
- ✅ Deploy produção (rkmmax-app.vercel.app)
- ⚠️ Conectar domínio custom no Vercel + SSL
- ⚠️ README final (documentar env, fluxo, segurança)

2) Stripe / Planos
- ✅ src/config/plans.json (6 planos BR/US)
- ✅ Payment Link – Premium BR no Subscribe.jsx
- ✅ Checkout BR abre (Stripe TEST)
- ⏭️ Payment Link – Premium US (criar e colar no Subscribe.jsx)
- ⚠️ Webhooks: decidir migração (Vercel) ou manter Netlify
- ⏭️ Fluxo E2E BR (pagamento de teste → retorno /success)

3) Controle de uso / Billing interno
- ✅ netlify/functions/_usage.js
- ✅ netlify/functions/guardAndBill.js (limites diário/mensal) — imports ok
- ✅ netlify/functions/chat.js (seleção de modelo + billing) — imports ok
- ✅ src/lib/planCaps.js unificado (PLAN, LIMITS, FEATURES, capsByPlan) — export default + nomeado
- ⏭️ (se usar) webhook Stripe para marcar Premium automático

4) Utilidades / Outros
- ✅ netlify/functions/cors.js
- ✅ netlify/functions/contact.js
- ✅ netlify/functions/status.js
- ⚠️ README de arquitetura

5) Avatares / UI
- ✅ public/avatars/
- ✅ src/data/avatars.json
- ✅ Integração no UI (Serginho + Especialistas)
- ⏭️ Revisão final dos 13 avatares

6) Testes / Qualidade
- ✅ ErrorBoundary testado (CrashSwitch e página Debug REMOVIDOS do build)
- ⏭️ Testar PWA (Android/iOS)
- ⏭️ Testar checkout US
- ⚠️ Testar Webhook Stripe em produção
- ⚠️ Revisar CORS e headers de segurança
- ⚠️ Documentar variáveis .env no README

7) Agentes Visíveis
- ✅ 13 agentes conectados (Serginho + 12)
- ✅ Descrições configuradas
- ⏭️ Conferência visual final (avatares e textos)

8) Agentes Ocultos
- ⚠️ Criar especialistas invisíveis (base/otimização/validação)
- ⚠️ Acesso apenas via Serginho
- ⚠️ Orquestração p/ reduzir custo (menos GPT-5, mais GPT-4 mini + ocultos)

9) Serginho — Núcleo Inteligente
- ⚠️ Aprendizado ilimitado (fontes confiáveis)
- ⚠️ Balanceamento automático
- ⚠️ Delegar tarefas a ocultos
- ⚠️ Evolução contínua (mais agentes ocultos)

10) Fluxo Premium / UX
- ✅ Tela padrão: botão “Falar com Serginho”
- ✅ Básico/Intermediário → só Serginho
- ✅ Premium → botão “Explorar Especialistas”
- ✅ PlanGate ativo (decide Basic/Premium via /api/me-plan + e-mail no localStorage)
- ✅ /success salva e-mail no localStorage (marcação Premium temporária)
- ⏭️ Automatizar marcação Premium pós-compra (webhook Stripe → Supabase/API)

11) Banco de Dados / Supabase
- ✅ pgvector movido de public → extensions
- ✅ Auth reforçada: 8+ chars; lower+UPPER+digits+símbolos; OTP 600s; Secure email change ON
- ✅ Restart Postgres
- ✅ Security Advisor sem Errors
- ⚠️ Avisos ok no Free: Leaked Password Protection (Pro); patches de Postgres (informativo)
- ⏭️ RLS/Policies em user_profiles, trusted_chunks, user_actions/embeddings

12) Integração Vercel ↔ Netlify
- ✅ src/lib/fnClient.js (fallback: /api → /.netlify/functions)
- ⏭️ Passo 2: trocar fetch('/.netlify/functions/...') por callFn('/...')
- (opcional) ⚠️ src/patchNetlifyFetch.js + import em src/index.js
- ✅ Deploys automáticos no Netlify (último: Published; imports ok)
```0
