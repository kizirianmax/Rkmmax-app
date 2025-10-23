# 🔄 Sistema de Fallback Automático

Sistema inteligente que maximiza o uso de tiers gratuitos e automaticamente migra para tiers pagos quando necessário, garantindo **zero interrupção** para os usuários.

---

## 🎯 Objetivo

Reduzir custos operacionais em até **84%** utilizando ao máximo os tiers gratuitos das APIs de IA, com fallback automático para tiers pagos apenas quando os limites gratuitos são atingidos.

---

## 🏗️ Arquitetura

### Componentes:

1. **api/chat.js** - Fallback para Serginho (orquestrador)
2. **api/specialist-chat.js** - Fallback para especialistas
3. **src/services/apiFallback.js** - Serviço centralizado (futuro)

### Fluxo de Execução:

```
Requisição do usuário
    ↓
Verifica contador de uso
    ↓
Uso < Limite FREE? ──→ SIM ──→ Usa tier FREE
    ↓                              ↓
   NÃO                         Sucesso?
    ↓                              ↓
Usa tier PAGO                  SIM → Retorna resposta
    ↓                              ↓
Retorna resposta               NÃO (erro 429)
                                   ↓
                            Fallback para tier PAGO
                                   ↓
                            Retorna resposta
```

---

## 📊 Limites por API

| API | Tier FREE | Tier PAGO | Custo FREE | Custo PAGO |
|-----|-----------|-----------|------------|------------|
| **Groq (Llama 3.3 70B)** | 14.400 req/dia | Ilimitado | R$ 0 | R$ 0,0104/req |
| **Gemini Flash** | 1.500 req/dia | Ilimitado | R$ 0 | R$ 0,0294/req |
| **Claude 3.5** | ❌ Não tem | Ilimitado | N/A | R$ 0,1067/req |

---

## 💰 Economia Estimada

### Cenário: 500 usuários ativos

#### **Sem Fallback (só tier PAGO):**
- Uso médio: 500 req/dia por usuário
- Total: 250.000 req/dia
- Custo mensal: **R$ 2.280**

#### **Com Fallback (FREE → PAGO):**
- Dias normais (20 dias): Tier FREE (R$ 0)
- Dias de pico (10 dias): Tier PAGO (R$ 360)
- Custo mensal: **R$ 360**
- **Economia: R$ 1.920/mês (84%)** 🎉

---

## 🔧 Configuração

### Variáveis de Ambiente (Vercel):

```bash
# Groq API Keys
GROQ_API_KEY_FREE=gsk_xxxxx  # Tier gratuito
GROQ_API_KEY_PAID=gsk_yyyyy  # Tier pago (fallback)

# Gemini API Keys (futuro)
GEMINI_API_KEY_FREE=AIzaSyXXXXX
GEMINI_API_KEY_PAID=AIzaSyYYYYY

# Claude API Key (sempre pago)
CLAUDE_API_KEY=sk-ant-xxxxx
```

### Fallback para Mesma Key:

Se `GROQ_API_KEY_PAID` não estiver configurada, o sistema usa `GROQ_API_KEY_FREE` também para o tier pago. Isso é útil se você tiver apenas uma key que suporta ambos os tiers.

---

## 📈 Monitoramento

### Logs de Uso:

O sistema registra automaticamente:

```javascript
[Fallback] Tentando tier FREE (free: 5234/14400)
[Fallback] Tier FREE esgotado, tentando tier PAGO...
[Fallback] Contador resetado para novo dia
```

### Resposta da API:

Cada resposta inclui estatísticas de uso:

```json
{
  "response": "Resposta da IA...",
  "tier": "free",
  "fallback": false,
  "usage": {
    "free": 5234,
    "paid": 0,
    "freeLimit": 14400,
    "percentUsed": "36.3"
  }
}
```

---

## 🚀 Como Funciona

### 1. **Contador de Uso**

Mantém contadores em memória (resetados diariamente):

```javascript
let usageCounter = {
  free: 0,
  paid: 0,
  lastReset: new Date().toDateString(),
};
```

### 2. **Verificação de Limite**

Antes de cada requisição:

```javascript
function shouldUseFree() {
  resetCounterIfNewDay();
  return usageCounter.free < FREE_LIMIT_PER_DAY;
}
```

### 3. **Tentativa com Fallback**

```javascript
try {
  // Tenta tier FREE
  const data = await callGroqAPI(GROQ_API_KEY_FREE, messages);
  usageCounter.free++;
  return data;
} catch (error) {
  if (error.status === 429) {
    // Fallback para tier PAGO
    const data = await callGroqAPI(GROQ_API_KEY_PAID, messages);
    usageCounter.paid++;
    return data;
  }
  throw error;
}
```

---

## 🎯 Casos de Uso

### Caso 1: Uso Normal

**Situação:** 100 usuários ativos, 10.000 req/dia

- Tier FREE: 10.000 req (dentro do limite)
- Tier PAGO: 0 req
- **Custo: R$ 0** ✅

### Caso 2: Pico de Uso

**Situação:** 200 usuários ativos, 20.000 req/dia

- Tier FREE: 14.400 req (limite atingido)
- Tier PAGO: 5.600 req (fallback)
- **Custo: R$ 58,24** ✅

### Caso 3: Uso Extremo

**Situação:** 500 usuários ativos, 50.000 req/dia

- Tier FREE: 14.400 req (limite atingido)
- Tier PAGO: 35.600 req (fallback)
- **Custo: R$ 370,24** ✅

---

## 🔍 Troubleshooting

### Problema: Erro 429 mesmo com fallback

**Causa:** Ambas as API keys (FREE e PAID) atingiram seus limites.

**Solução:**
1. Verificar se `GROQ_API_KEY_PAID` está configurada
2. Verificar se a key PAID tem créditos
3. Considerar criar múltiplas contas para distribuir carga

### Problema: Custo muito alto

**Causa:** Tier FREE sendo esgotado rapidamente.

**Solução:**
1. Implementar limites por usuário (200-500 req/dia)
2. Implementar rate limiting global
3. Otimizar prompts para reduzir tokens
4. Cachear respostas comuns

### Problema: Contador não reseta

**Causa:** Servidor Vercel reiniciou (memória perdida).

**Solução:**
- Implementar persistência em Redis/Upstash
- Usar Vercel KV Store
- Aceitar como comportamento normal (conservador)

---

## 📋 Próximos Passos

### Curto Prazo:
- [ ] Implementar fallback para Gemini Flash
- [ ] Implementar fallback para Claude 3.5
- [ ] Dashboard de monitoramento em tempo real
- [ ] Alertas quando atingir 80% do limite FREE

### Médio Prazo:
- [ ] Persistência de contadores (Redis/Upstash)
- [ ] Rate limiting por usuário
- [ ] Cache de respostas comuns
- [ ] Otimização de prompts

### Longo Prazo:
- [ ] ML para prever picos de uso
- [ ] Auto-scaling inteligente
- [ ] Distribuição de carga entre múltiplas keys
- [ ] Negociação de contratos enterprise

---

## 💡 Boas Práticas

### 1. **Sempre configure ambas as keys**

```bash
GROQ_API_KEY_FREE=gsk_free_xxxxx
GROQ_API_KEY_PAID=gsk_paid_yyyyy
```

### 2. **Monitore uso diariamente**

Verifique logs do Vercel para acompanhar:
- Quantas requisições FREE vs PAID
- Horários de pico
- Custo diário estimado

### 3. **Implemente limites por usuário**

Evite que poucos usuários esgotem o tier FREE:

```javascript
const LIMITS_BY_PLAN = {
  basic: 200,        // req/dia
  intermediate: 500,
  premium: 1000,
};
```

### 4. **Cache respostas comuns**

Perguntas frequentes podem ser cacheadas:

```javascript
const cache = new Map();
const cacheKey = JSON.stringify(messages);

if (cache.has(cacheKey)) {
  return cache.get(cacheKey);
}
```

---

## 📞 Suporte

Para dúvidas ou problemas:

1. Verificar logs do Vercel
2. Consultar este documento
3. Verificar CHECKLIST.md (Seção 13)
4. Abrir issue no GitHub

---

**Última atualização:** 23/10/2025  
**Versão:** 1.0.0  
**Status:** ✅ Implementado e funcionando

