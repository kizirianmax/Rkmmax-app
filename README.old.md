# RKMMax - AI Agents Platform

**Sistema de Inteligência Artificial Modular** com 13 agentes especializados, incluindo o Serginho como orquestrador principal.

[![CI/CD](https://github.com/kizirianmax/Rkmmax-app/actions/workflows/ci.yml/badge.svg)](https://github.com/kizirianmax/Rkmmax-app/actions)
[![Vercel](https://img.shields.io/badge/deployed-vercel-black)](https://rkmmax-app.vercel.app)

## 🚀 Stack Tecnológica

**Frontend:**
- React 18 com Create React App
- React Router v6 para navegação
- Sentry para monitoramento de erros
- PostHog para analytics e UX tracking

**Backend & Infraestrutura:**
- Vercel para hospedagem e serverless functions
- Supabase para autenticação e banco de dados
- Stripe para processamento de pagamentos
- OpenAI para modelos de IA (GPT-4.1, GPT-5)

**Observabilidade:**
- Sentry: rastreamento de erros e performance
- PostHog: analytics de eventos e comportamento do usuário
- Sistema de feedback in-app com criação automática de GitHub Issues

**Automação:**
- GitHub Actions para CI/CD
- Renovate para atualização automática de dependências
- ESLint + Prettier para qualidade de código
- React Testing Library para testes

## 📋 Pré-requisitos

- Node.js 18.x ou superior
- npm ou yarn
- Conta Vercel (para deploy)
- Conta Supabase (para banco de dados)
- Conta Stripe (para pagamentos)

## 🛠️ Instalação Local

### 1. Clone o repositório

```bash
git clone https://github.com/kizirianmax/Rkmmax-app.git
cd Rkmmax-app
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```bash
# Supabase
REACT_APP_SUPABASE_URL=https://seu-projeto.supabase.co
REACT_APP_SUPABASE_ANON_KEY=sua-anon-key

# Stripe - Payment Links
REACT_APP_LINK_PREMIUM_BR=https://buy.stripe.com/seu-link-br
REACT_APP_LINK_PREMIUM_US=https://buy.stripe.com/seu-link-us

# Região padrão (BR ou US)
REACT_APP_REGION_DEFAULT=BR

# Observabilidade (opcional)
REACT_APP_SENTRY_DSN=https://seu-dsn@sentry.io
REACT_APP_POSTHOG_KEY=sua-posthog-key
REACT_APP_POSTHOG_HOST=https://app.posthog.com

# Versão (para tracking de releases)
REACT_APP_VERSION=1.0.0
```

### 4. Inicie o servidor de desenvolvimento

```bash
npm start
```

O aplicativo estará disponível em [http://localhost:3000](http://localhost:3000).

## 🏗️ Build para Produção

```bash
npm run build
```

O build otimizado será criado na pasta `build/`.

## 🧪 Testes

```bash
# Executar testes
npm test

# Executar testes com coverage
npm test -- --coverage --watchAll=false

# Executar lint
npm run lint

# Corrigir problemas de lint automaticamente
npm run lint:fix

# Formatar código
npm run format

# Verificar formatação
npm run format:check
```

## 📊 Análise de Bundle

```bash
npm run build
npm run analyze
```

## 🚀 Deploy na Vercel

### Deploy via CLI

```bash
npm install -g vercel
vercel
```

### Deploy via GitHub

1. Conecte o repositório no [Vercel Dashboard](https://vercel.com/dashboard)
2. Configure as variáveis de ambiente no painel da Vercel
3. Cada push para `main` criará um deploy automático

### Variáveis de Ambiente na Vercel

Configure as seguintes variáveis no painel da Vercel:

**Frontend (REACT_APP_*):**
- `REACT_APP_SUPABASE_URL`
- `REACT_APP_SUPABASE_ANON_KEY`
- `REACT_APP_LINK_PREMIUM_BR`
- `REACT_APP_LINK_PREMIUM_US`
- `REACT_APP_REGION_DEFAULT`
- `REACT_APP_SENTRY_DSN`
- `REACT_APP_POSTHOG_KEY`
- `REACT_APP_VERSION`

**Backend (Serverless Functions):**
- `STRIPE_SECRET_KEY_RKMMAX`
- `STRIPE_WEBHOOK_SECRET`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE`
- `GITHUB_TOKEN` (para criação automática de issues)
- `GITHUB_REPO` (padrão: kizirianmax/Rkmmax-app)

## 🔐 Segurança

O projeto implementa as seguintes medidas de segurança:

- **Headers de Segurança:** CSP, HSTS, X-Frame-Options, X-Content-Type-Options
- **Autenticação:** Via Supabase com políticas RLS
- **Webhooks:** Verificação de assinatura Stripe
- **Sanitização:** Validação de inputs no frontend e backend
- **Secrets:** Todas as chaves sensíveis em variáveis de ambiente

## 📈 Observabilidade

### Sentry

Rastreamento automático de:
- Erros de runtime
- Crashes da aplicação
- Performance de transações
- Session replays (em caso de erro)

### PostHog

Tracking de:
- Eventos de usuário (cliques, navegação)
- Funis de conversão
- Heatmaps e session recordings
- Feature flags (futuro)

### Sistema de Feedback

- Botão flutuante "🐛 Feedback" em todas as páginas
- Captura automática de contexto (URL, user agent, viewport)
- Criação automática de GitHub Issues
- Integração com Sentry para correlação de erros

## 🤝 Contribuindo

### Workflow de Desenvolvimento

1. Crie uma branch a partir de `main`:
   ```bash
   git checkout -b feature/minha-feature
   ```

2. Faça suas alterações e commit:
   ```bash
   git add .
   git commit -m "feat: adiciona nova funcionalidade"
   ```

3. Push e abra um Pull Request:
   ```bash
   git push origin feature/minha-feature
   ```

### Conventional Commits

Use o formato de [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` nova funcionalidade
- `fix:` correção de bug
- `docs:` documentação
- `style:` formatação de código
- `refactor:` refatoração
- `test:` adição de testes
- `chore:` tarefas de manutenção

## 📁 Estrutura do Projeto

```
Rkmmax-app/
├── api/                      # Serverless functions (Vercel)
│   ├── _utils/              # Utilitários compartilhados
│   ├── chat.js              # Endpoint de chat com IA
│   ├── checkout.js          # Criação de sessões Stripe
│   ├── feedback.js          # Sistema de feedback
│   ├── me-plan.js           # Verificação de plano do usuário
│   ├── prices.js            # Listagem de preços
│   ├── status.js            # Health check
│   └── stripe-webhook.js    # Webhook Stripe
├── public/                  # Arquivos estáticos
├── src/
│   ├── auth/               # Componentes de autenticação
│   ├── components/         # Componentes reutilizáveis
│   ├── config/             # Configurações
│   ├── data/               # Dados estáticos
│   ├── hooks/              # Custom hooks
│   ├── lib/                # Bibliotecas e utilitários
│   │   ├── analytics.js    # PostHog integration
│   │   ├── sentry.js       # Sentry integration
│   │   └── ...
│   ├── pages/              # Páginas da aplicação
│   ├── App.jsx             # Componente principal
│   └── index.js            # Entry point
├── .github/                # GitHub Actions e templates
├── vercel.json             # Configuração Vercel
├── renovate.json           # Configuração Renovate
└── package.json
```

## 🐛 Troubleshooting

### Erro: "Module not found: Can't resolve './App'"

**Solução:** Certifique-se de que todos os imports usam extensões explícitas:
```javascript
import App from "./App.jsx";  // ✅ Correto
import App from "./App";      // ❌ Incorreto
```

### Build falha na Vercel

1. Verifique se todas as variáveis de ambiente estão configuradas
2. Confirme que `vercel.json` está na raiz do projeto
3. Verifique logs de build no dashboard da Vercel

### Webhook Stripe não funciona

1. Configure `STRIPE_WEBHOOK_SECRET` na Vercel
2. Configure o endpoint do webhook no Stripe Dashboard:
   - URL: `https://seu-dominio.vercel.app/api/stripe-webhook`
   - Eventos: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`

## 📝 Changelog

Veja [CHANGELOG.md](./CHANGELOG.md) para histórico de mudanças.

## 📄 Licença

Este projeto é privado e proprietário.

## 🆘 Suporte

- **Issues:** [GitHub Issues](https://github.com/kizirianmax/Rkmmax-app/issues)
- **Feedback:** Use o botão "🐛 Feedback" no app
- **Status:** [/help](/help) ou [/status](/status)

---

**Desenvolvido com ❤️ para escalar com 1 desenvolvedor**

