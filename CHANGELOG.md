# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [1.0.0] - 2025-10-15

### 🎉 Lançamento Inicial

Esta é a primeira versão estável do RKMMax, resultado de uma auditoria completa e elevação ao estado-da-arte.

### ✨ Adicionado

#### Observabilidade e Feedback
- **Sentry** integrado para rastreamento de erros e performance
- **PostHog** integrado para analytics e tracking de eventos
- Sistema de **feedback in-app** com botão flutuante
- Criação automática de **GitHub Issues** a partir do feedback
- Página **Status & Ajuda** (`/help` e `/status`)
- Captura automática de contexto em erros (URL, user agent, stack trace)

#### Automação e CI/CD
- **GitHub Actions** para CI/CD (lint, build, testes)
- **Renovate** configurado para atualização automática de dependências
- **ESLint + Prettier** padronizados com scripts npm
- Templates de **Pull Request** e **Issues**
- Testes básicos com **React Testing Library**
- Script de análise de bundle (`npm run analyze`)

#### Segurança
- Headers de segurança completos (CSP, HSTS, X-Frame-Options, etc.)
- **Content Security Policy** configurada para Stripe, Supabase, Sentry e PostHog
- **Strict-Transport-Security** com preload
- Verificação de assinatura em webhooks Stripe
- Sanitização de inputs

#### Performance
- Bundle otimizado (195.91 kB gzipped)
- Lazy loading preparado para rotas
- Cache headers otimizados para assets estáticos
- Componente de loading para Suspense

#### Infraestrutura
- **vercel.json** configurado com SPA fallback
- **Webhook Stripe** migrado para Vercel (`/api/stripe-webhook`)
- **.vercelignore** para ignorar arquivos Netlify
- **.gitignore** atualizado com padrões completos
- **manifest.json** melhorado para PWA

#### Documentação
- README completo com instruções de setup, deploy e troubleshooting
- Documentação de variáveis de ambiente
- Estrutura do projeto documentada
- Guia de contribuição com Conventional Commits

### 🔧 Modificado

#### Correções de Build
- Todos os imports relativos agora usam **extensões explícitas** (`.jsx`, `.js`)
- Resolvidos conflitos de ESLint
- Build sem warnings

#### Código
- TODOs removidos ou convertidos em issues rastreáveis
- `console.log` desnecessários removidos
- Variáveis não utilizadas corrigidas
- ErrorBoundary integrado com Sentry e PostHog

#### Configuração
- Payment Links agora usam variáveis de ambiente (`REACT_APP_LINK_PREMIUM_US`)
- Suporte para região BR e US
- Node.js 18.x definido em `package.json`

### 🗑️ Removido

- Pasta `netlify/` arquivada como `netlify.backup/`
- Dependências do Netlify removidas do deploy
- TODOs e FIXMEs do código

### 🔒 Segurança

- 9 vulnerabilidades npm identificadas (3 moderate, 6 high)
  - Relacionadas a dependências transitivas do `react-scripts`
  - Não afetam produção (apenas dev dependencies)
  - Monitoradas via Renovate para atualizações

### 📊 Métricas

#### Bundle Size
- **Main JS:** 195.91 kB (gzipped)
- **Main CSS:** 509 B (gzipped)
- **Total:** ~196 kB

#### Build
- **Tempo de build:** ~15-20s
- **Warnings:** 0
- **Errors:** 0

### 🎯 Próximos Passos (Roadmap)

#### Alta Prioridade
1. Conectar domínio custom na Vercel
2. Configurar Payment Link Premium US no Stripe
3. Testar fluxo E2E de pagamento
4. Implementar RLS policies no Supabase
5. Configurar webhook Stripe em produção

#### Média Prioridade
6. Criar agentes invisíveis (base/otimização/validação)
7. Implementar Serginho - Núcleo Inteligente
8. Testar PWA em Android/iOS
9. Lighthouse audit e otimizações
10. Testes E2E com Playwright

#### Baixa Prioridade
11. Migrar de CRA para Vite (futuro)
12. Implementar feature flags com PostHog
13. Dashboard de analytics interno
14. Sistema de notificações

---

## Como Ler Este Changelog

- **Adicionado** para novas funcionalidades
- **Modificado** para mudanças em funcionalidades existentes
- **Descontinuado** para funcionalidades que serão removidas
- **Removido** para funcionalidades removidas
- **Corrigido** para correções de bugs
- **Segurança** para vulnerabilidades corrigidas

