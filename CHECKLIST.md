# ✅ Checklist Projeto RKMMax (Atualizado)

Legendas: ✅ feito | ⚠️ pendente | ⏭️ próximo

## 1) Infra / Deploy
- ✅ Importar repo no Vercel
- ✅ Framework: Create React App
- ✅ Variáveis no Vercel:
  - REACT_APP_SUPABASE_URL
  - REACT_APP_SUPABASE_ANON_KEY
- ✅ Deploy produção (rkmmax-app.vercel.app)
- ⚠️ Conectar domínio custom no Vercel + SSL
- ⚠️ README final (documentar env e fluxo)

## 2) Stripe / Planos
- ✅ src/config/plans.json (6 planos BR/US)
- ✅ Payment Link – Premium BR criado e colado no `Subscribe.jsx`
- ⏭️ Payment Link – Premium US (criar e colar no `Subscribe.jsx`)
- ⚠️ Webhooks: decidir migração (Vercel) ou manter Netlify
- ⏭️ Testar checkout BR e depois US

## 3) Controle de uso / Billing interno
- ✅ netlify/functions/_usage.js
- ✅ netlify/functions/guardAndBill.js (limites diário/mensal)
- ✅ netlify/functions/chat.js (seleção de modelo + billing)

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
