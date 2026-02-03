# 🔐 Variáveis de Ambiente - Sistema Groq Multi-Modelo

## 📝 Configuração no Vercel

Acesse: **Vercel Dashboard → Settings → Environment Variables**

---

## 🚀 Variáveis OBRIGATÓRIAS

### 1. GROQ_API_KEY (PRIMARY)
```
GROQ_API_KEY=gsk_xxxxxxxxxxxxx
```
- **Descrição**: API key do Groq para modelos de IA (3 níveis)
- **Obtida em**: https://console.groq.com/keys
- **Uso**: Motor primário de IA (reasoning, standard, speed) + Transcrição (Whisper) + Análise de Imagens (Vision)
- **Modelos usados**:
  - `deepseek-r1-distill-llama-70b` (raciocínio complexo)
  - `llama-3.3-70b-versatile` (uso geral)
  - `llama-3.2-3b-preview` (velocidade)
  - `whisper-large-v3-turbo` (transcrição)
  - `llama-3.2-90b-vision-preview` (análise de imagens)

### 2. GEMINI_API_KEY (FALLBACK)
```
GEMINI_API_KEY=AIzaSyCX0gYhkbAS1fwchXJuUAh0POEuedwifeM
```
- **Descrição**: API key do Google Gemini para fallback
- **Obtida em**: https://aistudio.google.com/app/apikey
- **Uso**: Fallback automático se Groq falhar
- **Modelos usados**:
  - `gemini-1.5-pro` (IA fallback)
  - `gemini-2.0-flash` (transcrição fallback)
  - `gemini-2.0-flash-preview-image-generation` (geração de imagens fallback)

---

## ⚡ Variáveis OPCIONAIS

### 3. TOGETHER_API_KEY (Geração de Imagens - GRÁTIS)
```
TOGETHER_API_KEY=xxxxxxxxxxxxx
```
- **Descrição**: API key da Together AI para geração de imagens
- **Obtida em**: https://api.together.xyz
- **Uso**: Geração de imagens com FLUX Schnell (primary)
- **Modelo**: `black-forest-labs/FLUX.1-schnell-Free`
- **Plano gratuito**: Sim (tier free disponível)

---

## 🔧 Outras Variáveis (já existentes)

### Supabase (Autenticação e Banco de Dados)
```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=xxxxxxxxxxxxx
```

### Stripe (Pagamentos)
```
STRIPE_SECRET_KEY=sk_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

### Resend (E-mails)
```
RESEND_API_KEY=re_xxxxxxxxxxxxx
```

---

## 🎯 Prioridades dos Provedores

### Chat/IA (api/ai.js)
1. **PRIMARY**: Groq (3 modelos com seleção automática)
2. **FALLBACK**: Gemini 1.5 Pro

### Transcrição de Áudio (api/transcribe.js)
1. **PRIMARY**: Groq Whisper Large V3 Turbo
2. **FALLBACK**: Gemini 2.0 Flash

### Análise de Imagens (api/vision.js)
1. **PRIMARY**: Groq Llama 3.2 90B Vision

### Geração de Imagens (api/image-generate.js)
1. **PRIMARY**: Together AI (FLUX Schnell)
2. **FALLBACK**: Gemini 2.0 Flash

---

## ✅ Validação

Para validar se as variáveis estão configuradas corretamente:

```bash
# Testar IA
curl -X POST https://kizirianmax.site/api/ai \
  -H "Content-Type: application/json" \
  -d '{"type":"genius","messages":[{"role":"user","content":"Olá"}]}'

# Testar Transcrição
curl -X POST https://kizirianmax.site/api/transcribe \
  -F "audio=@audio.webm"

# Testar Visão
curl -X POST https://kizirianmax.site/api/vision \
  -H "Content-Type: application/json" \
  -d '{"prompt":"O que tem nesta imagem?","imageUrl":"https://example.com/image.jpg"}'

# Testar Geração de Imagens
curl -X POST https://kizirianmax.site/api/image-generate \
  -H "Content-Type: application/json" \
  -d '{"prompt":"um gato fofo"}'
```

---

## 📊 Resumo de Custos

| Provedor | Plano | Custo |
|----------|-------|-------|
| Groq | Gratuito | $0/mês (com limites) |
| Gemini | Gratuito | $0/mês (até 15 req/min) |
| Together AI | Gratuito | $0/mês (tier free) |

**Total estimado**: $0/mês no tier gratuito

---

## 🔒 Segurança

- ✅ Nunca commite API keys no código
- ✅ Use apenas variáveis de ambiente
- ✅ Rotacione as keys periodicamente
- ✅ Configure no Vercel em "Production" e "Preview"

---

## 📞 Suporte

Se encontrar problemas:
1. Verifique se todas as keys estão configuradas no Vercel
2. Teste as keys individualmente nos respectivos consoles
3. Verifique os logs no Vercel Dashboard → Deployments → Logs
4. Revise o arquivo `.env.example` como referência

---

**Atualizado**: 2026-02-03
**Sistema**: Groq Multi-Modelo + Gemini Fallback v1.0
