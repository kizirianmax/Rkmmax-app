# 🔐 Variáveis de Ambiente - Vercel

## Configuração Necessária

Para ativar as funcionalidades de **voz** e **imagem**, adicione estas variáveis no Vercel:

### 1. OpenAI API Key (Whisper + GPT-4 Vision)

```
OPENAI_API_KEY=sk-proj-...
```

**Onde conseguir:**
1. Acesse https://platform.openai.com/api-keys
2. Crie uma nova chave API
3. Copie e cole no Vercel

**Custos estimados:**
- Whisper: ~R$ 0,036/minuto de áudio
- GPT-4o-mini (Vision): ~R$ 0,06/imagem

### 2. Variáveis Existentes (já configuradas)

```
GROQ_API_KEY_FREE=gsk_...
GROQ_API_KEY_PAID=gsk_...
GOOGLE_API_KEY=AIza...
REACT_APP_SUPABASE_URL=https://...
REACT_APP_SUPABASE_ANON_KEY=eyJ...
STRIPE_SECRET_KEY=sk_...
```

## Como Adicionar no Vercel

1. Acesse https://vercel.com/seu-usuario/rkmmax-app/settings/environment-variables
2. Clique em "Add New"
3. Cole cada variável (nome + valor)
4. Selecione "Production, Preview, Development"
5. Clique em "Save"
6. **Importante:** Faça um novo deploy após adicionar as variáveis

## Testando as Funcionalidades

### Testar Voz (Whisper)
1. Abra o chat do Serginho
2. Clique no botão 🎤
3. Fale algo em português
4. Clique novamente para parar
5. O texto transcrito aparecerá no input

### Testar Imagem (GPT-4 Vision)
1. Abra o chat do Serginho
2. Clique no botão 🖼️ (galeria) ou 📸 (câmera)
3. Selecione uma imagem
4. A IA analisará e descreverá a imagem

## Custos Mensais Estimados

**Com 500 usuários ativos:**
- Whisper: R$ 180/mês (1 min/dia por usuário)
- GPT-4 Vision: R$ 300/mês (1 imagem/dia por usuário)
- **Total adicional:** ~R$ 480/mês

**Margem de lucro mantida:**
- Básico (R$ 25): 75% margem
- Intermediário (R$ 50): 69% margem
- Premium (R$ 90): 24% margem
- Ultra (R$ 199): 31% margem

## Troubleshooting

### Erro: "OPENAI_API_KEY não configurada"
- Verifique se a variável foi adicionada no Vercel
- Faça um novo deploy após adicionar

### Erro: "Insufficient quota"
- Sua conta OpenAI precisa de créditos
- Adicione créditos em https://platform.openai.com/account/billing

### Erro: "Rate limit exceeded"
- Aguarde alguns minutos
- Considere aumentar os limites da conta OpenAI

## Próximos Passos

1. ✅ Adicionar `OPENAI_API_KEY` no Vercel
2. ✅ Fazer novo deploy
3. ✅ Testar funcionalidades em produção
4. ✅ Monitorar custos no dashboard OpenAI
5. ✅ Atualizar Payment Links no Stripe com novos preços

