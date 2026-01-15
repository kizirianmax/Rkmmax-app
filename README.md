# 🚀 RKMMAX - Plataforma de IA com 54 Especialistas

**A plataforma de IA mais completa e acessível do Brasil**

[![Deploy](https://img.shields.io/badge/deploy-vercel-black)](https://rkmmax-app.vercel.app)
[![Especialistas](https://img.shields.io/badge/especialistas-54-blue)](./docs/SPECIALISTS_COMPLETE.md)
[![Planos](https://img.shields.io/badge/planos-R%2414.90-green)](https://rkmmax-app.vercel.app/pricing)
[![Status](https://img.shields.io/badge/status-produção-success)](https://rkmmax-app.vercel.app)

---

## 🎯 O Que é RKMMAX?

**Empresa:** Roberto Kiziriam Max Desenvolvimento de Programas ME LTDA  
**CNPJ:** 63.492.481/0001-10  
**Sócio-Proprietário:** Roberto Kiziriam Max  
**Status:** ATIVA (desde 03/11/2025)

RKMMAX é uma plataforma inovadora que oferece acesso a **54 agentes especializados de IA**, todos orquestrados por um sistema inteligente chamado **Serginho**. 

Diferentemente de chatbots tradicionais que oferecem apenas um agente generalista, o RKMMAX disponibiliza dezenas de especialistas dedicados em áreas como:

- 💻 **Tecnologia:** Programação, IA, Segurança, Dados, UX
- 📚 **Educação:** Tutoria, Didática, Ciências, Matemática
- 🎨 **Criatividade:** Arte, Design, Música, Cinema, Game Design
- 💼 **Negócios:** Estratégia, Marketing, Vendas, Finanças, RH
- 💙 **Bem-estar:** Fitness, Nutrição, Coaching, Produtividade
- 🌍 **Idiomas:** Inglês, Espanhol, Tradução
- 🔧 **Engenharia:** Mecânica, Elétrica, Civil
- ✨ **Lifestyle:** Viagens, Moda, Decoração, Sustentabilidade

---

## 🏆 Diferencial Competitivo

| Plataforma | Especialistas | Preço/mês | Contexto |
|------------|---------------|-----------|----------|
| **RKMMAX** | **54** | **R$ 14,90 - 90** | **1M tokens** |
| ChatGPT Plus | 1 | $20 (~R$ 100) | 128K tokens |
| Claude Pro | 1 | $20 (~R$ 100) | 200K tokens |
| Gemini Advanced | 1 | $20 (~R$ 100) | 1M tokens |
| Manus | 1 | $20 (~R$ 100) | 200K tokens |

**Vantagem:** 54x mais especialistas por 1/7 do preço!

---

## ✨ Principais Recursos

### 🤖 54 Especialistas Organizados

```
📚 Educação (2)        💻 Tecnologia (7)      🎨 Criatividade (9)
💙 Bem-estar (5)       💼 Negócios (7)        ✨ Lifestyle (5)
🌍 Idiomas (3)         🔬 Ciências (5)        🔧 Engenharia (3)
```

[Ver lista completa de especialistas →](./docs/SPECIALISTS_COMPLETE.md)

### 🎭 Serginho - O Orquestrador

Agente generalista que analisa sua tarefa e consulta automaticamente os especialistas necessários, entregando uma resposta sintetizada e completa.

### 💰 Planos Acessíveis

| Plano | Preço | Mensagens/dia | Stack de IA |
|-------|-------|---------------|-------------|
| **Básico** | R$ 14,90 | 100 | Gemini 2.0 Flash |
| **Intermediário** | R$ 50,00 | 300 | Gemini 2.0 Flash |
| **Premium** | R$ 90,00 | 500 | Gemini 1.5 Pro |
| **Ultra** | R$ 150,00 | 800 | Hybrid (Gemini + Claude + Groq) |
| **Dev** | R$ 200,00 | 1000 | Full Hybrid Stack |

### 🎮 Controle de Visibilidade

Ative/desative especialistas conforme sua necessidade. Interface limpa e personalizada.

### ⚡ Performance

- **Tempo de resposta:** <2s
- **Uptime:** 99.9%
- **Contexto:** 1M tokens (Gemini 2.0)
- **Custo otimizado:** 1 chamada de IA por mensagem

---

## 🛠️ Stack Tecnológico

### Frontend
- **Framework:** React 18 (Create React App)
- **Estilização:** Tailwind CSS
- **Deploy:** Vercel
- **PWA:** Service Workers
- **Router:** React Router v6

### Backend
- **Runtime:** Node.js 22
- **Serverless:** Vercel Functions
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth

### IA
- **Arquitetura Multi-Modelo:** Sistema híbrido inteligente
- **Modelo Primário:** Vertex AI - Gemini 2.0 Flash ($0.075/1M tokens)
- **Fallback 1:** Claude 3.5 Sonnet ($3.00/1M tokens)
- **Fallback 2 (Turbo):** Groq Llama 70b ($0.80/1M tokens)
- **Premium Model:** Gemini 1.5 Pro ($2.50/1M tokens)
- **Orquestração:** Sistema proprietário otimizado
- **Contexto:** 1M tokens (Gemini)

#### Stacks por Plano:
- **Básico/Intermediário:** Gemini 2.0 Flash
- **Premium:** Gemini 1.5 Pro
- **Ultra:** Hybrid - Gemini 2.0 Flash (padrão) + Claude 3.5 Sonnet (fallback) + Groq 70b (turbo)
- **Dev:** Full Hybrid - Acesso a todos os modelos com seleção dinâmica

### Observabilidade
- **Errors:** Sentry (5% sampling)
- **Analytics:** PostHog (10% sampling)
- **Logs:** Vercel Logs
- **Feedback:** Sistema in-app com GitHub Issues

### Pagamentos
- **Gateway:** Stripe
- **Métodos:** Cartão, PIX
- **Assinaturas:** Recorrência mensal

---

## 📦 Instalação Local

### Pré-requisitos

- Node.js 22+
- pnpm (ou npm/yarn)
- Conta Supabase
- Chaves de API (Gemini, OpenAI)

### Passo a Passo

```bash
# 1. Clone o repositório
git clone https://github.com/kizirianmax/Rkmmax-app.git
cd Rkmmax-app

# 2. Instale dependências
npm install

# 3. Configure variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas chaves

# 4. Inicie o servidor de desenvolvimento
npm start

# 5. Acesse http://localhost:3000
```

### Variáveis de Ambiente

```bash
# Supabase
REACT_APP_SUPABASE_URL=https://seu-projeto.supabase.co
REACT_APP_SUPABASE_ANON_KEY=sua-anon-key

# Stripe - Payment Links
REACT_APP_LINK_PREMIUM_BR=https://buy.stripe.com/seu-link-br
REACT_APP_LINK_PREMIUM_US=https://buy.stripe.com/seu-link-us
REACT_APP_REGION_DEFAULT=BR

# Observabilidade (opcional)
REACT_APP_SENTRY_DSN=https://seu-dsn@sentry.io
REACT_APP_POSTHOG_KEY=sua-posthog-key
REACT_APP_POSTHOG_HOST=https://app.posthog.com

# Versão
REACT_APP_VERSION=2.0.0
```

**Backend (Serverless Functions):**
```bash
STRIPE_SECRET_KEY_RKMMAX=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
SUPABASE_URL=https://...
SUPABASE_SERVICE_ROLE=eyJ...
GITHUB_TOKEN=ghp_...
GITHUB_REPO=kizirianmax/Rkmmax-app
```

---

## 🏗️ Build e Deploy

### Build Local

```bash
npm run build
```

### Deploy na Vercel

```bash
# Via CLI
npm install -g vercel
vercel

# Ou conecte o repositório no Vercel Dashboard
# Deploy automático a cada push para main
```

### Testes

```bash
# Executar testes
npm test

# Testes com coverage
npm test -- --coverage --watchAll=false

# Lint
npm run lint

# Format
npm run format
```

---

## 📚 Documentação

- **[Especialistas Completos](./docs/SPECIALISTS_COMPLETE.md)** - Lista de todos os 54 especialistas
- **[Arquitetura de Agentes](./docs/AGENTS.md)** - Como funciona o sistema multi-agente
- **[Fair Use](./docs/FAIR_USE.md)** - Limites e políticas de uso
- **[Observabilidade](./docs/OBSERVABILITY.md)** - Monitoramento e métricas
- **[Deploy](./docs/DEPLOY.md)** - Guia de deploy na Vercel

---

## 🎯 Casos de Uso

### 👨‍🎓 Estudantes

- Tutoria personalizada em todas as matérias
- Preparação para vestibular e ENEM
- Ajuda com trabalhos e projetos
- Aprendizado de idiomas

### 👨‍💻 Desenvolvedores

- Debugging e code review
- Arquitetura de sistemas
- Aprendizado de novas tecnologias
- Automação de tarefas

### 👨‍💼 Empreendedores

- Validação de ideias
- Business plan
- Estratégia de marketing
- Análise financeira

### 🎨 Criadores

- Roteiros e storytelling
- Design gráfico
- Produção de conteúdo
- Edição de vídeo/áudio

---

## 📈 Roadmap

### ✅ Fase 1: MVP (Concluído)

- [x] 54 especialistas implementados
- [x] Sistema de orquestração
- [x] Fair use por plano
- [x] Deploy em produção
- [x] Observabilidade (Sentry + PostHog)
- [x] Sistema de feedback

### 🔄 Fase 2: Crescimento (Q4 2025)

- [ ] Email profissional configurado
- [ ] Aplicação Google Cloud aprovada
- [ ] 1.000 usuários pagantes
- [ ] Mobile app (React Native)
- [ ] API pública

### 🔮 Fase 3: Escala (2026)

- [ ] 100+ especialistas
- [ ] Expansão LATAM
- [ ] Integração com ferramentas (Notion, Slack, etc.)
- [ ] Marketplace de especialistas customizados
- [ ] Enterprise plan

---

## 💰 Modelo de Negócio

### Receita Projetada (Ano 1)

**Assinaturas mensais:**
- Básico: R$ 14,90/mês × 1.000 usuários = R$ 14.900/mês
- Intermediário: R$ 50,00/mês × 500 usuários = R$ 25.000/mês
- Premium: R$ 90,00/mês × 200 usuários = R$ 18.000/mês

**Total:** R$ 695.000/ano (~$140.000)

### Custos

**IA (Gemini 2.0 Flash):**
- Custo médio: $1.125/usuário/mês (plano Premium)
- Total: $22.950/ano

**Infraestrutura:**
- Vercel + Supabase + Observabilidade: $1.140/ano

**Total de custos:** $24.090/ano

**Margem bruta:** 83% ($115.910 lucro)

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o repositório
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

### Conventional Commits

Use o formato de [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` nova funcionalidade
- `fix:` correção de bug
- `docs:` documentação
- `style:` formatação de código
- `refactor:` refatoração
- `test:` adição de testes
- `chore:` tarefas de manutenção

---

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
│   │   ├── specialists.js  # 54 especialistas
│   │   └── fairUse.js      # Limites por plano
│   ├── data/               # Dados estáticos
│   ├── hooks/              # Custom hooks
│   │   └── useAgentVisibility.js
│   ├── lib/                # Bibliotecas e utilitários
│   │   ├── analytics.js    # PostHog integration
│   │   ├── sentry.js       # Sentry integration
│   │   └── ...
│   ├── pages/              # Páginas da aplicação
│   │   ├── Specialists.jsx # Página de especialistas
│   │   └── ...
│   ├── App.jsx             # Componente principal
│   └── index.js            # Entry point
├── docs/                   # Documentação
│   ├── SPECIALISTS_COMPLETE.md
│   ├── AGENTS.md
│   ├── OBSERVABILITY.md
│   └── ...
├── .github/                # GitHub Actions e templates
├── vercel.json             # Configuração Vercel
└── package.json
```

---

## 🔐 Segurança

O projeto implementa as seguintes medidas de segurança:

- **Headers de Segurança:** CSP, HSTS, X-Frame-Options, X-Content-Type-Options
- **Autenticação:** Via Supabase com políticas RLS
- **Webhooks:** Verificação de assinatura Stripe
- **Sanitização:** Validação de inputs no frontend e backend
- **Secrets:** Todas as chaves sensíveis em variáveis de ambiente

Encontrou uma vulnerabilidade? Envie um email para: `roberto@kizirianmax.site`

---

## 📊 Observabilidade

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

---

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

---

## 📝 Changelog

Veja [CHANGELOG.md](./CHANGELOG.md) para histórico de mudanças.

---

## 📄 Licença

Proprietary - © 2025 RKMMAX. Todos os direitos reservados.

Este é um software proprietário. O código-fonte está disponível apenas para fins de transparência e auditoria. Uso comercial ou redistribuição não são permitidos sem autorização expressa.

---

## 📞 Contato

**Sócio-Proprietário:** Roberto Kiziriam Max  
**CNPJ:** 63.492.481/0001-10  
**Email:** ROBERTO@KIZIRIANMAX.SITE  
**Telefone:** (11) 9107-3704  
**Endereço:** Av Santa Monica, 593, APT 33 BLOCO 15 A - Jardim Santa Monica - São Paulo - SP

- **Website:** https://kizirianmax.site
- **GitHub:** https://github.com/kizirianmax/Rkmmax-app
- **Suporte:** Via chat na plataforma ou botão "🐛 Feedback"

---

## 🙏 Agradecimentos

- **Google Cloud:** Pela infraestrutura de IA (Gemini)
- **Vercel:** Pelo deploy e hosting
- **Supabase:** Pelo backend-as-a-service
- **Comunidade:** Por feedback e sugestões

---

## 📊 Status do Projeto

![Build](https://img.shields.io/badge/build-passing-success)
![Uptime](https://img.shields.io/badge/uptime-99.9%25-success)
![Response Time](https://img.shields.io/badge/response-<2s-blue)
![Specialists](https://img.shields.io/badge/specialists-54-blue)

**Última atualização:** 18/10/2025  
**Versão:** 2.0  
**Status:** ✅ Produção

---

<div align="center">

**Feito com ❤️ no Brasil**

[Começar Agora](https://rkmmax-app.vercel.app) • [Ver Especialistas](./docs/SPECIALISTS_COMPLETE.md) • [Documentação](./docs/)

</div>

