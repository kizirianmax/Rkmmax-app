# Observabilidade Econômica - RKMMAX

Este documento descreve a configuração de observabilidade do RKMMAX, otimizada para **custo baixo** e **qualidade mundial**.

---

## Estratégia de Amostragem

Para reduzir custos mantendo visibilidade adequada, implementamos amostragem agressiva:

### Sentry (Rastreamento de Erros)

| Métrica | Desenvolvimento | Produção | Justificativa |
|---------|----------------|----------|---------------|
| **Traces** | 100% | **5%** | Suficiente para identificar gargalos |
| **Session Replay (Normal)** | 100% | **5%** | Economia significativa |
| **Session Replay (Erro)** | 100% | **100%** | Crítico para debugging |

**Economia estimada:** ~90% de redução de eventos vs. configuração padrão.

### PostHog (Analytics)

| Métrica | Desenvolvimento | Produção | Justificativa |
|---------|----------------|----------|---------------|
| **Autocapture** | Desabilitado | Desabilitado | Reduz ruído, capturamos manualmente |
| **Pageviews** | Habilitado | Habilitado | Essencial para entender navegação |
| **Pageleave** | Desabilitado | Desabilitado | Não crítico |
| **Session Recording** | 100% | **5%** | Amostra representativa |

**Economia estimada:** ~85% de redução de eventos vs. configuração padrão.

---

## Privacidade e PII

Implementamos mascaramento agressivo de dados pessoais (PII):

### Sentry

```javascript
maskAllText: true,        // Mascarar todo texto
maskAllInputs: true,      // Mascarar todos os inputs
blockAllMedia: true,      // Bloquear imagens/vídeos
unmask: ['.public-content'] // Apenas conteúdo público
```

### PostHog

```javascript
mask_all_text: true,              // Mascarar todo texto
mask_all_element_attributes: true, // Mascarar atributos
maskAllInputs: true,              // Mascarar inputs
maskInputOptions: {
  password: true,  // Senhas
  email: true,     // E-mails
  tel: true,       // Telefones
}
```

**Resultado:** Zero exposição de dados sensíveis em replays e eventos.

---

## Configuração de Variáveis de Ambiente

### Obrigatórias

Nenhuma! A observabilidade é **opcional** e gracefully degraded.

### Opcionais (Recomendadas para Produção)

```bash
# Sentry
REACT_APP_SENTRY_DSN=https://xxx@sentry.io/xxx

# PostHog
REACT_APP_POSTHOG_KEY=phc_xxx
REACT_APP_POSTHOG_HOST=https://app.posthog.com  # Opcional, default: app.posthog.com

# Versão (para release tracking)
REACT_APP_VERSION=1.0.0
```

---

## Alertas Úteis (Sentry)

Configuração recomendada de alertas no Sentry Dashboard:

### 1. Erros Críticos (Imediato)

- **Condição:** Error rate > 1% em 5 minutos
- **Ação:** Email + Slack
- **Prioridade:** P0

### 2. Performance Degradada (Moderado)

- **Condição:** P95 response time > 3s em 15 minutos
- **Ação:** Email
- **Prioridade:** P1

### 3. Taxa de Erro Elevada (Baixo)

- **Condição:** Error count > 100 em 1 hora
- **Ação:** Email diário
- **Prioridade:** P2

**Resultado:** Apenas alertas acionáveis, sem ruído.

---

## Eventos Rastreados (PostHog)

Como desabilitamos `autocapture`, rastreamos manualmente apenas eventos essenciais:

### Navegação

- `page_view` - Visualização de página
- `agent_selected` - Seleção de agente
- `subscription_started` - Início de assinatura

### Interações Críticas

- `chat_sent` - Mensagem enviada
- `feedback_submitted` - Feedback enviado
- `button_click` - Cliques em CTAs principais

### Erros

- `error_occurred` - Erro capturado

**Total estimado:** ~10-15 eventos por sessão vs. 50-100 com autocapture.

---

## Custos Estimados

### Sentry (Free Tier)

- **Limite:** 5,000 errors/mês
- **Uso estimado (5% sampling):** ~1,000-2,000 errors/mês
- **Custo:** $0/mês ✅

### PostHog (Free Tier)

- **Limite:** 1M events/mês
- **Uso estimado (eventos manuais + 5% recording):** ~200k-400k events/mês
- **Custo:** $0/mês ✅

**Total:** $0/mês para até ~10k usuários ativos/mês.

---

## Monitoramento de Custos

Para evitar surpresas, monitore mensalmente:

1. **Sentry Dashboard** → Usage & Billing
   - Verificar % do limite free tier
   - Ajustar `tracesSampleRate` se necessário

2. **PostHog Dashboard** → Billing
   - Verificar eventos/mês
   - Ajustar `sampleRate` se necessário

**Alerta:** Se atingir 80% do limite, reduzir amostragem para 3%.

---

## Debugging em Produção

Mesmo com amostragem baixa, você pode debugar efetivamente:

### 1. Forçar Captura (Temporário)

```javascript
// Em caso de bug crítico, aumentar temporariamente
tracesSampleRate: 1.0  // Por 1-2 horas
```

### 2. Logs do Console

Sentry captura `console.error()` automaticamente:

```javascript
console.error("Erro crítico:", error);
```

### 3. Contexto Customizado

```javascript
import { captureError } from './lib/sentry';

try {
  // código
} catch (error) {
  captureError(error, {
    userId: user.id,
    action: 'checkout',
    planId: plan.id,
  });
}
```

---

## Boas Práticas

### ✅ Fazer

- Rastrear apenas eventos essenciais
- Usar contexto rico em erros
- Revisar alertas semanalmente
- Monitorar custos mensalmente

### ❌ Evitar

- Habilitar `autocapture` em produção
- Capturar PII sem mascaramento
- Criar alertas para métricas não-acionáveis
- Aumentar amostragem sem necessidade

---

## Referências

- [Sentry Sampling](https://docs.sentry.io/platforms/javascript/configuration/sampling/)
- [PostHog Session Recording](https://posthog.com/docs/session-replay/privacy)
- [GDPR Compliance](https://posthog.com/docs/privacy/gdpr-compliance)

---

**Última atualização:** 16 de outubro de 2025  
**Versão:** 1.0.0

