# Arquitetura de Agentes - RKMMAX

**Versão:** 2.0  
**Data:** 22 de outubro de 2025  
**Status:** ✅ Implementado e em Produção

---

## 🎯 Visão Geral

O RKMMAX utiliza uma **arquitetura de agentes de IA** onde:

1. **Serginho** é o **orquestrador principal** (generalista)
2. **45+ Especialistas** são agentes focados em áreas específicas
3. Usuário pode conversar diretamente com qualquer agente
4. Sistema de **visibilidade** permite personalizar quais agentes aparecem

---

## 🤖 Serginho - O Orquestrador

### Características

- **Nome:** Serginho (KIZI)
- **Função:** Orquestrador generalista de IA
- **Personalidade:** Profissional, amigável, direto ao ponto
- **Modelo:** Groq API - llama-3.3-70b-versatile
- **Custo:** ~$0.05-0.10 por 1M tokens (muito baixo)

### System Prompt

```
Você é o KIZI, o orquestrador de IA do RKMMAX.

**Sua personalidade:**
- 🤖 Profissional mas amigável e acessível
- 💡 Inteligente e sempre focado em soluções práticas
- 🎯 Direto ao ponto, mas empático e atencioso
- 🚀 Entusiasta de tecnologia e inovação
- 🧠 Tem memória infinita e aprende continuamente

**Suas especialidades:**
- Programação e desenvolvimento
- Gerenciamento de projetos e produtividade
- Análise de dados e resolução de problemas
- Explicações técnicas de forma acessível
- Criatividade e brainstorming
```

### Implementação

- **Rota:** `/serginho`
- **API Route:** `/api/chat.js`
- **Componente:** `src/pages/Serginho.jsx`
- **Features:**
  - Chat em tempo real
  - Histórico de mensagens
  - Typing indicator
  - Suporte a voz (em desenvolvimento)
  - Upload de arquivos (em desenvolvimento)

---

## 👥 Especialistas - 45+ Agentes Focados

### Categorias

1. **📚 Educação** (2 especialistas)
   - Didak: Didática e métodos de ensino
   - Edu: Tutor acadêmico

2. **💻 Tecnologia** (6 especialistas)
   - Code: Programação e desenvolvimento
   - Nexus: Redes e infraestrutura
   - Synth: IA e machine learning
   - Sec: Segurança cibernética
   - Data: Análise de dados
   - UX: UX/UI Design

3. **🎨 Criatividade** (9 especialistas)
   - Orac: Storytelling
   - Zen: Filosofia
   - Vox: Comunicação e oratória
   - Art: Arte e design visual
   - Beat: Música
   - Film: Cinema
   - Lens: Fotografia
   - Write: Escrita criativa
   - Game: Game design

4. **💙 Bem-estar** (5 especialistas)
   - Emo: Inteligência emocional
   - Focus: Produtividade e foco
   - Fit: Fitness e exercícios
   - Chef: Culinária e nutrição
   - Coach: Life coaching

5. **💼 Negócios** (7 especialistas)
   - Biz: Estratégia de negócios
   - Cash: Finanças pessoais
   - Sales: Vendas e negociação
   - Mark: Marketing digital
   - Law: Jurídico e contratos
   - PM: Product Management
   - HR: Recursos Humanos

6. **✨ Estilo de Vida** (5 especialistas)
   - Trip: Viagens e turismo
   - Home: Decoração e organização
   - Style: Moda e estilo pessoal
   - Eco: Sustentabilidade
   - Med: Saúde e bem-estar

7. **🌍 Idiomas** (3 especialistas)
   - Poly: Poliglota
   - Eng: Professor de inglês
   - Span: Professor de espanhol

8. **🔬 Ciências** (5 especialistas)
   - Bio: Biologia
   - Chem: Química
   - Phys: Física
   - Math: Matemática
   - Astro: Astronomia

9. **🔧 Engenharia** (3 especialistas)
   - Mech: Engenharia mecânica
   - Elec: Engenharia elétrica
   - Civil: Engenharia civil

### Implementação

- **Rota:** `/specialists` (lista) e `/specialist/:specialistId` (chat)
- **API Route:** `/api/specialist-chat.js`
- **Componentes:**
  - `src/pages/Specialists.jsx` (lista)
  - `src/pages/SpecialistChat.jsx` (chat individual)
- **Configuração:** `src/config/specialists.js`

### System Prompts Personalizados

Cada especialista tem seu próprio system prompt. Exemplo:

```javascript
{
  id: 'code',
  name: 'Code',
  emoji: '💻',
  category: 'tech',
  description: 'Programação e desenvolvimento',
  systemPrompt: 'Você é Code, especialista em programação. Ajude com código, debugging, arquitetura e boas práticas.'
}
```

---

## 👁️ Sistema de Visibilidade

### Funcionalidades

1. **Toggle Individual:** Mostrar/ocultar cada especialista
2. **Ações em Lote:** Mostrar/ocultar todos ou por categoria
3. **Persistência:** Preferências salvas no localStorage
4. **Estatísticas:** Contador de visíveis/ocultos
5. **Filtro Automático:** Página de especialistas mostra apenas os visíveis

### Implementação

- **Hook:** `src/hooks/useSpecialistVisibility.js`
- **Componente:** `src/components/SpecialistVisibilityManager.jsx`
- **Página:** `src/pages/Settings.jsx` (seção de visibilidade)

### Como Usar

1. Ir em **Settings** (`/settings`)
2. Rolar até **"👁️ Visibilidade dos Especialistas"**
3. Escolher quais especialistas mostrar/ocultar
4. Preferências salvas automaticamente
5. Ir em **Especialistas** para ver apenas os selecionados

---

## 🔄 Fluxo de Conversação

### Opção 1: Conversar com Serginho

```
Usuário → /serginho → Serginho (orquestrador)
                    ↓
              Resposta generalista
```

### Opção 2: Conversar com Especialista

```
Usuário → /specialists → Escolher especialista
                       ↓
         /specialist/:id → Chat com especialista
                       ↓
              Resposta especializada
```

---

## 💰 Otimização de Custos

### Modelo Único para Todos

- **Groq API:** llama-3.3-70b-versatile
- **Custo:** ~$0.05-0.10 por 1M tokens
- **Tier Free:** 14.400 requisições/dia
- **Estratégia:** Usar tier free inicialmente

### Por que Groq?

1. **Custo baixíssimo** comparado a OpenAI
2. **Velocidade alta** (inferência rápida)
3. **Qualidade excelente** (Llama 3.3 70B)
4. **Tier free generoso** (14.4k req/dia)
5. **Sem vendor lock-in** (pode trocar facilmente)

### Comparação de Custos

| Provedor | Modelo | Custo/1M tokens | Tier Free |
|----------|--------|-----------------|-----------|
| **Groq** | Llama 3.3 70B | $0.05-0.10 | ✅ 14.4k/dia |
| OpenAI | GPT-4o | $2.50-5.00 | ❌ $5 crédito |
| Anthropic | Claude 3.5 | $3.00-15.00 | ❌ Nenhum |
| Google | Gemini Pro | $0.50-1.50 | ✅ 60 req/min |

**Vencedor:** Groq (melhor custo-benefício)

---

## 🏗️ Arquitetura Técnica

### Frontend (React)

```
src/
├── pages/
│   ├── Serginho.jsx          # Chat com Serginho
│   ├── Specialists.jsx        # Lista de especialistas
│   └── SpecialistChat.jsx     # Chat com especialista individual
├── components/
│   └── SpecialistVisibilityManager.jsx  # Gerenciar visibilidade
├── hooks/
│   └── useSpecialistVisibility.js       # Hook de visibilidade
└── config/
    └── specialists.js         # Configuração dos 45 especialistas
```

### Backend (Vercel Serverless)

```
api/
├── chat.js                    # API do Serginho
└── specialist-chat.js         # API dos especialistas
```

### Fluxo de Dados

```
Frontend (React)
    ↓
API Route (Vercel Serverless)
    ↓
Groq API (llama-3.3-70b-versatile)
    ↓
Resposta processada
    ↓
Frontend (exibição)
```

---

## 🔐 Segurança

### API Keys

- **Nunca expor** API keys no frontend
- **Sempre usar** Vercel Environment Variables
- **Serverless Functions** protegem as keys

### Rate Limiting

- Implementar rate limiting por usuário (TODO)
- Usar tier free do Groq (limite natural)
- Monitorar uso via Sentry/PostHog

### Validação

- Validar inputs no backend
- Sanitizar mensagens
- Limitar tamanho de mensagens (2000 tokens)

---

## 📊 Monitoramento

### Sentry (Error Tracking)

- Sampling: 5%
- Apenas erros críticos
- Alertas em tempo real

### PostHog (Analytics)

- Sampling: 5-10%
- Eventos de uso dos agentes
- Funil de conversão

### Métricas Importantes

1. **Taxa de uso por agente**
2. **Tempo médio de resposta**
3. **Taxa de erro**
4. **Custo por conversa**
5. **Satisfação do usuário**

---

## 🚀 Roadmap Futuro

### Curto Prazo (1-2 semanas)

- [ ] Implementar rate limiting
- [ ] Adicionar histórico de conversas persistente
- [ ] Melhorar UI do chat (markdown, code highlighting)
- [ ] Adicionar suporte a imagens (visão)

### Médio Prazo (1-2 meses)

- [ ] Sistema de memória entre conversas
- [ ] Serginho delega automaticamente para especialistas
- [ ] Integração com ferramentas externas (GitHub, Gmail, etc.)
- [ ] Modo offline (cache de respostas)

### Longo Prazo (3-6 meses)

- [ ] Fine-tuning de modelos personalizados
- [ ] Agentes com acesso a APIs externas
- [ ] Colaboração entre múltiplos agentes
- [ ] Sistema de plugins para adicionar novos agentes

---

## 📚 Referências

- [Groq API Documentation](https://console.groq.com/docs)
- [Llama 3.3 Model Card](https://ai.meta.com/llama/)
- [Vercel Serverless Functions](https://vercel.com/docs/functions)
- [React Hooks Best Practices](https://react.dev/reference/react)

---

## 🤝 Contribuindo

Para adicionar um novo especialista:

1. Editar `src/config/specialists.js`
2. Adicionar configuração do especialista
3. Criar avatar em `public/avatars/{id}.png`
4. Testar em `/specialists`
5. Fazer PR com descrição clara

---

**Última atualização:** 22 de outubro de 2025  
**Versão:** 2.0  
**Status:** ✅ Produção  
**Autor:** Manus AI + Roberto Kizirian

