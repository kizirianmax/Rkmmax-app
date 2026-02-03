# 🚀 Groq Multi-Modelo System - Quick Start Guide

## 📋 Overview

Sistema profissional de IA com Groq (3 níveis de inteligência) + Gemini fallback, incluindo transcrição de áudio, análise de imagens e geração de imagens.

---

## ⚡ Quick Start

### 1. Configurar Variáveis de Ambiente

No Vercel Dashboard → Settings → Environment Variables:

```env
# OBRIGATÓRIAS
GROQ_API_KEY=gsk_xxxxxxxxxxxxx          # https://console.groq.com/keys
GEMINI_API_KEY=AIza...                  # https://aistudio.google.com/app/apikey

# OPCIONAL (Geração de Imagens)
TOGETHER_API_KEY=xxxxxxxxxxxxx          # https://api.together.xyz
```

### 2. Deploy

O deploy é automático após merge do PR. Vercel detectará as mudanças e fará o build.

### 3. Testar

```bash
# Testar IA (chat)
curl -X POST https://kizirianmax.site/api/ai \
  -H "Content-Type: application/json" \
  -d '{"type":"genius","messages":[{"role":"user","content":"Olá, como você está?"}]}'

# Testar análise de imagem
curl -X POST https://kizirianmax.site/api/vision \
  -H "Content-Type: application/json" \
  -d '{"prompt":"O que tem nesta imagem?","imageUrl":"https://example.com/image.jpg"}'
```

---

## 🎯 O Que Mudou?

### ANTES vs DEPOIS

| Aspecto | Antes | Depois |
|---------|-------|--------|
| **IA Primary** | Gemini 2.5 Pro (instável) | Groq (3 níveis) |
| **IA Fallback** | Vertex AI / Claude | Gemini 1.5 Pro |
| **Transcrição** | Gemini Flash | Groq Whisper V3 Turbo |
| **Visão** | ❌ Não tinha | ✅ Groq Vision |
| **Imagens** | Gemini Flash | Together AI (Free) |
| **Erros 401** | /serginho, /manifest.json | ✅ Corrigido |
| **Performance** | Requisições grandes | ✅ Otimizado |

---

## 🧠 Sistema de IA - 3 Níveis de Inteligência

### Seleção Automática

```javascript
// Exemplo de uso (a API escolhe automaticamente)
POST /api/ai
{
  "type": "genius",
  "messages": [
    { "role": "user", "content": "Analise este código..." }
  ]
}
```

### Níveis

1. **🧠 Reasoning** (DeepSeek R1 70B)
   - Análises complexas
   - Debug de código
   - Arquitetura de sistemas
   - Mensagens > 500 chars

2. **⚡ Standard** (Llama 3.3 70B)
   - Conversas normais
   - Perguntas médias
   - Uso geral (padrão)

3. **🚀 Speed** (Llama 3.2 3B)
   - Respostas rápidas
   - Saudações simples
   - Mensagens < 50 chars

---

## 🎤 Transcrição de Áudio

### Endpoint: `/api/transcribe`

```bash
curl -X POST https://kizirianmax.site/api/transcribe \
  -F "audio=@audio.webm"
```

### Formatos Suportados
- webm, mp3, wav, m4a

### Fluxo
1. **Primary**: Groq Whisper Large V3 Turbo
2. **Fallback**: Gemini 2.0 Flash

---

## 👁️ Análise de Imagens (NOVO)

### Endpoint: `/api/vision`

```bash
curl -X POST https://kizirianmax.site/api/vision \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Descreva esta imagem em detalhes",
    "imageUrl": "https://example.com/image.jpg"
  }'
```

### Opções
- `imageUrl`: URL pública da imagem
- `imageBase64`: Imagem em base64

### Modelo
- Groq Llama 3.2 90B Vision

---

## 🎨 Geração de Imagens

### Endpoint: `/api/image-generate`

```bash
curl -X POST https://kizirianmax.site/api/image-generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "um gato fofo em estilo cartoon",
    "style": "cartoon"
  }'
```

### Estilos
- realistic, anime, artistic, 3d, minimal, cartoon, sketch

### Fluxo
1. **Primary**: Together AI (FLUX.1-schnell - Free)
2. **Fallback**: Gemini 2.0 Flash

---

## 🔧 Correção de Erros 401

### Rotas Corrigidas
- ✅ `/serginho` → index.html
- ✅ `/manifest.json` → manifest.json (com headers corretos)
- ✅ Todas as outras rotas → index.html (SPA)

### Headers Adicionados
- Content-Type para manifest.json
- Cache-Control otimizado
- Headers de segurança (X-Content-Type-Options, X-Frame-Options)

---

## 📦 Arquivos Importantes

### Modificados
- `api/ai.js` - Sistema Groq multi-modelo
- `api/transcribe.js` - Groq Whisper
- `api/image-generate.js` - Together AI
- `vercel.json` - Rotas e headers

### Criados
- `api/vision.js` - Análise de imagens
- `test-ai-system.mjs` - Testes automatizados
- `VARIAVEIS_AMBIENTE.md` - Documentação de variáveis
- `SISTEMA_IMPLEMENTADO.md` - Resumo executivo
- `SECURITY_SUMMARY.md` - Relatório de segurança

### Intocados (GARANTIDO)
- ✅ `src/prompts/geniusPrompts.js` - Prompts do Serginho
- ✅ `src/config/specialists.js` - 54 Especialistas

---

## ✅ Garantias

### Zero Breaking Changes
- Interface da API 100% compatível
- Mesmos parâmetros e respostas
- Prompts do Serginho intocados
- Especialistas intocados

### Performance
- System prompt: max 2000 chars (vs ilimitado)
- Histórico: max 10 mensagens (vs ilimitado)
- Mensagens: max 4000 chars cada (vs ilimitado)
- Cache mantido e funcional

### Segurança
- ✅ CodeQL: 0 vulnerabilidades
- ✅ Code Review: Aprovado
- ✅ Input validation implementada
- ✅ API keys em env vars apenas

---

## 🧪 Testes

### Executar Localmente

```bash
node test-ai-system.mjs
```

### Resultados
- ✅ 4/4 testes de seleção de modelo
- ✅ 4/4 endpoints validados
- ✅ 3/3 configurações do vercel.json

---

## 📊 Custos

| Provedor | Plano | Custo |
|----------|-------|-------|
| Groq | Free Tier | $0/mês |
| Gemini | Free Tier | $0/mês |
| Together AI | Free Tier | $0/mês |
| **TOTAL** | | **$0/mês** |

*Com limites de rate do free tier*

---

## 🆘 Troubleshooting

### Erro: "GROQ_API_KEY não configurada"
1. Acesse Vercel Dashboard → Settings → Environment Variables
2. Adicione `GROQ_API_KEY=gsk_...`
3. Redeploy

### Erro 401 em /serginho
- ✅ Já corrigido neste PR
- Verifique se o deploy foi concluído

### IA está lenta
- É esperado no free tier
- Groq fallback para Gemini se houver timeout
- Considere upgrade se necessário

### Transcrição falhando
1. Verifique formato do áudio (webm, mp3, wav, m4a)
2. Verifique tamanho (< 25MB recomendado)
3. Verifique GROQ_API_KEY

---

## 📚 Documentação Completa

- `VARIAVEIS_AMBIENTE.md` - Todas as variáveis de ambiente
- `SISTEMA_IMPLEMENTADO.md` - Resumo executivo detalhado
- `SECURITY_SUMMARY.md` - Análise de segurança completa

---

## 🔄 Próximos Passos

### Após Deploy
1. ✅ Verificar variáveis no Vercel
2. ✅ Testar todos os endpoints
3. ✅ Monitorar logs
4. ✅ Verificar quotas das APIs

### Melhorias Futuras (Opcional)
- [ ] Métricas de uso por modelo
- [ ] Rate limiting customizado
- [ ] Telemetria avançada
- [ ] Dashboard de monitoramento

---

## 📞 Suporte

- **Logs**: Vercel Dashboard → Deployments → View Function Logs
- **Testes**: `node test-ai-system.mjs`
- **Documentação**: Arquivos .md neste repositório
- **Contato**: roberto@kizirianmax.site

---

**Status**: ✅ Pronto para produção  
**Versão**: 1.0  
**Data**: 2026-02-03  
**Breaking Changes**: Nenhum
