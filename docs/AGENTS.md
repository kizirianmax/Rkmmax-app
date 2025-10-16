# Sistema de Agentes - RKMMAX

## Arquitetura

O RKMMAX utiliza um sistema de **orquestração de agentes** com foco em custo baixo e qualidade mundial.

### Serginho (Orquestrador)

**Papel:** Generalista e coordenador central.

**Responsabilidades:**
- Receber intenção do usuário
- Rotear para especialistas apropriados
- Compor resposta final
- Garantir qualidade e coerência

**Tier:** Livre (sempre disponível)

### Especialistas

| Agente | Especialidade | Quando Usar | Tier |
|--------|--------------|-------------|------|
| **Didak** | Pedagogia | Explicações educacionais | Premium |
| **Code** | Técnico | Programação e debugging | Premium |
| **Focus** | Execução | Tarefas práticas | Premium |
| **Emo** | Emocional | Suporte emocional | Premium |
| **Bizu** | Dicas Rápidas | Atalhos e truques | Premium |
| **Orac** | Estratégia | Planejamento de longo prazo | Premium |
| **PlanX** | Planejamento | Organização de projetos | Premium |
| **Criar** | Criatividade | Brainstorming e ideias | Premium |
| **Finna** | Finanças | Análise financeira | Premium |
| **Legalis** | Jurídico | Questões legais | Premium |
| **Care** | Saúde | Bem-estar e saúde | Premium |
| **Talky** | Comunicação | Escrita e oratória | Premium |

## Fluxo de Orquestração

```
Usuário → Serginho → [Análise de Intenção]
                  ↓
         [Seleção de Especialistas]
                  ↓
         Especialista 1, 2, 3...
                  ↓
         [Composição de Resposta]
                  ↓
         Serginho → Usuário
```

**Exemplo:**

Usuário: "Preciso aprender React e criar um projeto"

1. **Serginho** analisa: educação + prática
2. Roteia para:
   - **Didak** (explicar conceitos)
   - **Code** (exemplos de código)
   - **PlanX** (estruturar projeto)
3. **Serginho** compõe resposta final integrando as 3 perspectivas

## Controle de Visibilidade

### Como Funciona

- **Visível:** Agente aparece na UI e pode ser selecionado diretamente
- **Oculto:** Agente não aparece na UI, mas Serginho ainda pode usá-lo

### Configuração

Acesse `/agent-settings` ou clique em "Configurar Agentes" no menu.

**Opções:**
- Toggle individual por agente
- "Mostrar Todos" / "Ocultar Todos"
- Persistência local (localStorage)

### Casos de Uso

**Simplificar UI:**
- Ocultar agentes que você raramente usa
- Focar nos 3-4 mais relevantes para seu trabalho

**Exemplo:**
- Desenvolvedor: manter apenas Code, Focus, PlanX visíveis
- Estudante: manter apenas Didak, Emo, Bizu visíveis

## Otimização de Custos

### Estratégia "Barato-Primeiro"

1. **Rascunho:** Modelo compacto (ex: GPT-4.1-nano)
2. **Revisão:** Serginho valida com modelo premium (ex: GPT-4.1-mini)
3. **Fallback:** Se erro, tenta provedor alternativo

### Limites por Agente

- **Serginho:** Sem limite (essencial)
- **Especialistas:** Máx. 10 chamadas/dia (tier Free)
- **Especialistas:** Máx. 100 chamadas/dia (tier Premium)

### Cache Inteligente

- Respostas similares são cacheadas por 24h
- Reduz ~40% das chamadas repetidas
- Implementado via AI Gateway

## Agentes Invisíveis (Utilitários)

Micro-agentes que rodam em background, sem aparecer na UI:

- **Veritas:** Verificação de fontes
- **Sanitizer:** Limpeza de prompts
- **QA:** Controle de qualidade

**Logs:** Apenas em modo debug (`REACT_APP_DEBUG=true`)

## Configuração

### Variáveis de Ambiente

```bash
# Provedor de IA
AI_PROVIDER=manus  # ou openai, anthropic
AI_MODEL=gpt-4.1-mini
AI_API_KEY=your-key

# Limites
AI_MAX_TOKENS=2000
AI_TIMEOUT=30000  # 30s

# Cache
AI_CACHE_ENABLED=true
AI_CACHE_TTL=86400  # 24h
```

### Custos Estimados

| Tier | Chamadas/Mês | Custo/Mês |
|------|--------------|-----------|
| **Free** | ~3,000 | $0 (free tier) |
| **Premium** | ~30,000 | ~$5-10 |

**Otimizações aplicadas:**
- Cache: -40% chamadas
- Modelos compactos: -60% custo/chamada
- Amostragem: -50% logs

**Resultado:** ~$0.001/chamada (vs. $0.01 sem otimização)

## Monitoramento

### Métricas Rastreadas

- Chamadas por agente
- Latência média
- Taxa de cache hit
- Custo acumulado

### Alertas

- Custo > $50/mês → Email
- Latência > 10s → Log
- Taxa de erro > 5% → Sentry

## Roadmap

- [ ] Agentes customizáveis (usuário cria seus próprios)
- [ ] Fine-tuning de especialistas
- [ ] Multi-modal (imagem, áudio)
- [ ] Colaboração entre agentes (debate)

---

**Última atualização:** 16 de outubro de 2025

