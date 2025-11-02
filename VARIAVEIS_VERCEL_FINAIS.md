# Variáveis de Ambiente - RKMMAX Final

Copie e cole estas variáveis no Vercel (Settings → Environment Variables):

```
# MODELOS DE IA (Para o Serginho rotear)
MODEL_BASIC=Gemini Flash
MODEL_INTERMEDIATE=Gemini Pro
MODEL_PREMIUM=Gemini Premium
MODEL_ULTRA=Gemini ULTRA

# LIMITES RÍGIDOS DE TOKENS (Para o Serginho bloquear)
LIMIT_BASIC_TOKENS_DAILY=3500
LIMIT_INTERMEDIATE_TOKENS_DAILY=4700
LIMIT_PREMIUM_TOKENS_DAILY=7200
LIMIT_ULTRA_TOKENS_DAILY=9000

# CONFIGURAÇÃO DE ACESSO (Para o Serginho priorizar)
HARDWARE_PREMIUM_PRIORITY=GROQ
HARDWARE_ULTRA_PRIORITY=GROQ
```

## Instruções:
1. Acesse: https://vercel.com/dashboard
2. Selecione o projeto **rkmmax-app**
3. Vá em **Settings → Environment Variables**
4. Copie cada linha acima e adicione como nova variável
5. Deploy automático será acionado

## Variáveis Já Existentes (não alterar):
- GROQ_API_KEY
- OPENAI_API_KEY
- RESEND_API_KEY
- FROM_EMAIL
- JWT_SECRET
- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET

