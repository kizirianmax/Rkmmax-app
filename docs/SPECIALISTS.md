# 🤖 Sistema de 30+ Especialistas RKMMAX

## Visão Geral

O RKMMAX possui **30+ especialistas** organizados em 6 categorias, todos orquestrados pelo **Serginho** (orquestrador inteligente).

**Diferencial:** Ao contrário de outros assistentes (ChatGPT, Claude), o RKMMAX tem especialistas dedicados para cada área, garantindo respostas mais precisas e contextualizadas.

---

## 📚 Categorias e Especialistas

### 1. Educação (2 especialistas)
- **Didak** 📚 - Didática e métodos de ensino
- **Edu** 🎓 - Tutor acadêmico para todas as matérias

### 2. Tecnologia (5 especialistas)
- **Code** 💻 - Programação e desenvolvimento
- **Nexus** 🌐 - Redes e infraestrutura
- **Synth** 🤖 - IA e machine learning
- **Sec** 🔒 - Segurança cibernética
- **Data** 📊 - Análise de dados e estatística

### 3. Criatividade (8 especialistas)
- **Orac** 🎭 - Storytelling e narrativa
- **Zen** 🧘 - Filosofia e reflexão
- **Vox** 🎤 - Comunicação e oratória
- **Art** 🎨 - Arte e design visual
- **Beat** 🎵 - Música e produção musical
- **Film** 🎬 - Cinema e produção audiovisual
- **Lens** 📸 - Fotografia
- **Write** ✍️ - Escrita criativa

### 4. Bem-estar (4 especialistas)
- **Emo** 💙 - Inteligência emocional
- **Focus** 🎯 - Produtividade e foco
- **Fit** 💪 - Fitness e exercícios
- **Chef** 🍳 - Culinária e nutrição

### 5. Negócios (5 especialistas)
- **Biz** 💼 - Estratégia de negócios
- **Cash** 💰 - Finanças pessoais e investimentos
- **Sales** 🎯 - Vendas e negociação
- **Mark** 📢 - Marketing digital
- **Law** ⚖️ - Jurídico e contratos

### 6. Estilo de Vida (5 especialistas)
- **Trip** ✈️ - Viagens e turismo
- **Home** 🏠 - Decoração e organização
- **Style** 👗 - Moda e estilo pessoal
- **Eco** 🌱 - Sustentabilidade
- **Med** 🏥 - Saúde e bem-estar

---

## 🎯 Como Funciona

### Arquitetura Otimizada

```
Usuário → Serginho (Orquestrador) → Especialista(s) → Resposta
```

**1 chamada de IA por mensagem** (não múltiplas chamadas)

### Exemplo de Uso

**Usuário:** "Crie um site de portfólio para mim"

**Serginho analisa e delega:**
1. Code (gera HTML/CSS/JS)
2. Art (sugere paleta de cores)
3. Vox (escreve textos persuasivos)

**Resultado:** Site completo em 1 resposta

---

## 💰 Fair Use por Plano

| Plano | Mensagens/Dia | Especialistas | Modelo IA |
|-------|---------------|---------------|-----------|
| **Gratuito** | 10 | 3 (Serginho, Didak, Edu) | Gemini Flash |
| **Básico** (R$ 14,90) | 100 | Todos (30+) | Gemini Flash |
| **Intermediário** (R$ 50) | 300 | Todos (30+) | Gemini Flash |
| **Premium** (R$ 90) | 500 | Todos (30+) | Gemini Flash + GPT-4.1 (opcional) |

### Limites de Soft/Hard

- **Soft Limit:** Aviso quando restam < 10 mensagens/dia ou < 50/mês
- **Hard Limit:** Bloqueio quando atingir 0 mensagens

---

## 🔧 Implementação Técnica

### Arquivos Principais

```
src/
├── config/
│   ├── specialists.js      # Configuração de todos os especialistas
│   └── fairUse.js          # Sistema de limites por plano
├── pages/
│   └── Specialists.jsx     # Página de listagem
└── hooks/
    └── useAgentVisibility.js  # Controle de visibilidade
```

### Adicionar Novo Especialista

```javascript
// src/config/specialists.js

export const specialists = {
  // ... especialistas existentes
  
  newSpecialist: {
    id: 'newSpecialist',
    name: 'Nome',
    emoji: '🎯',
    category: 'business', // education, tech, creative, wellness, business, lifestyle
    description: 'Descrição curta',
    systemPrompt: 'Você é [Nome], especialista em [área]. Ajude com...',
    visible: true,
  },
};
```

---

## 📊 Custos Estimados

### Por Mensagem (Gemini 2.0 Flash)

- **Input:** $0.000000075 / token
- **Output:** $0.000000075 / token
- **Média:** ~2.000 tokens/mensagem
- **Custo:** ~$0.00015 / mensagem (R$ 0,00075)

### Por Usuário/Mês

| Plano | Msgs/Mês | Custo/Usuário | Receita | Margem |
|-------|----------|---------------|---------|--------|
| Básico | 3.000 | R$ 2,25 | R$ 14,90 | **85%** ✅ |
| Intermediário | 9.000 | R$ 6,75 | R$ 50,00 | **86%** ✅ |
| Premium | 15.000 | R$ 11,25 | R$ 90,00 | **87%** ✅ |

**Com Google Cloud ($350k créditos):** Custo = R$ 0 por 2 anos! 🎉

---

## 🚀 Roadmap

### Fase 1 (Concluída) ✅
- [x] 30+ especialistas
- [x] Fair Use por plano
- [x] Página de Especialistas
- [x] Sistema de categorias

### Fase 2 (Próxima)
- [ ] Chat interface com seleção de especialista
- [ ] Histórico de conversas
- [ ] Serginho auto-delegação
- [ ] Modo "Equipe" (múltiplos especialistas em 1 tarefa)

### Fase 3 (Futuro)
- [ ] Especialistas personalizados (usuário cria)
- [ ] Integração com ferramentas (browser, code, deploy)
- [ ] Modo autônomo (execução sem supervisão)
- [ ] API pública

---

## 💡 Dicas de Uso

### Para Usuários

1. **Não sabe qual especialista?** Deixe o Serginho escolher automaticamente
2. **Tarefa complexa?** Use múltiplos especialistas em sequência
3. **Atingiu limite?** Faça upgrade ou aguarde reset diário

### Para Desenvolvedores

1. **Adicionar especialista:** Edite `src/config/specialists.js`
2. **Ajustar limites:** Edite `src/config/fairUse.js`
3. **Testar localmente:** `npm start` e acesse `/specialists`

---

## 📞 Suporte

- **Documentação:** [README.md](../README.md)
- **Issues:** [GitHub Issues](https://github.com/kizirianmax/Rkmmax-app/issues)
- **Email:** roberto@kizirianmax.site

---

**Última atualização:** Outubro 2025  
**Versão:** 2.0.0

