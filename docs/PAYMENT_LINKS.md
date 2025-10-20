# Payment Links - RKMMax

**Última atualização:** 20/10/2025

Este documento lista todos os payment links configurados no Stripe para a plataforma RKMMax.

---

## 🇧🇷 Brasil (BRL)

### Basic BR - R$ 25,00/mês

**URL:** https://buy.stripe.com/bJe8wP4AT1jVcwJ6oo

**Recursos:**
- Acesso ao Serginho (assistente básico)
- Funções essenciais
- Limite inteligente de conversas
- Suporte inicial

**Cupons:** Não aceita códigos promocionais

---

### Intermediário BR - R$ 50,00/mês

**URL:** https://buy.stripe.com/bJe8wP4AT1jVcwJ6b33oA0l

**Recursos:**
- Acesso a agentes avançados
- Suporte prioritário
- Limites estendidos de uso
- Recursos intermediários

**Cupons:** Não aceita códigos promocionais

---

### Premium BR - R$ 90,00/mês

**URL:** https://buy.stripe.com/00w6oHaZhfaLcwJczr3oA0c

**Recursos:**
- Acesso a todos os 50+ agentes especializados
- Suporte premium
- Uso ilimitado (fair use)
- Prioridade no processamento
- Recursos exclusivos

**Cupons:** ✅ Aceita códigos promocionais (EDU50)

**Com EDU50:** R$ 90,00 → **R$ 45,00/mês** (50% OFF)

---

## 🇺🇸 Estados Unidos (USD)

### Basic US - $10.00/month

**URL:** https://buy.stripe.com/00w14naZh0fR1S51UN3oA09

**Features:**
- Access to Serginho (basic assistant)
- Essential functions
- Smart conversation limits
- Initial support

**Coupons:** Does not accept promotion codes

---

### Intermediate US - $20.00/month

**URL:** https://buy.stripe.com/3cI4gzebt8MngMZ2YR3oA0g

**Features:**
- Access to advanced agents
- Priority support
- Extended usage limits
- Intermediate features

**Coupons:** Does not accept promotion codes

---

### Premium US - $30.00/month

**URL:** https://buy.stripe.com/5kQaEXffx4w71S59nf3oA0e

**Features:**
- Access to all 50+ specialized agents
- Premium support
- Unlimited usage (fair use)
- Priority processing
- Exclusive features

**Coupons:** ✅ Accepts promotion codes (EDU50)

**With EDU50:** $30.00 → **$15.00/month** (50% OFF)

---

## 🎓 Cupom Educacional - EDU50

### Descrição
Desconto de 50% para estudantes e educadores nos planos Premium (BR e US).

### Código
```
EDU50
```

### Elegibilidade
- Estudantes de graduação
- Estudantes de pós-graduação
- Estudantes de cursos técnicos
- Professores e educadores

### Validação
- Email institucional (.edu, .edu.br)
- OU comprovante de matrícula válido
- Renovação anual

### Aplicável em
- ✅ Premium BR: R$ 90 → R$ 45/mês
- ✅ Premium US: $30 → $15/mês
- ❌ Basic e Intermediário: Não aplicável

---

## 📊 Tabela Comparativa

| Plano | Brasil (BRL) | EUA (USD) | Com EDU50 | Cupons |
|-------|--------------|-----------|-----------|--------|
| **Basic** | R$ 25/mês | $10/mês | - | ❌ |
| **Intermediário** | R$ 50/mês | $20/mês | - | ❌ |
| **Premium** | R$ 90/mês | $30/mês | BR: R$ 45 / US: $15 | ✅ |

---

## 🔧 Configuração no Código

### Variáveis de Ambiente

```bash
# Brasil (BRL)
REACT_APP_STRIPE_PAYMENT_LINK_BASIC_BR=https://buy.stripe.com/bJe8wP4AT1jVcwJ6oo
REACT_APP_STRIPE_PAYMENT_LINK_INTERMEDIATE_BR=https://buy.stripe.com/bJe8wP4AT1jVcwJ6b33oA0l
REACT_APP_STRIPE_PAYMENT_LINK_PREMIUM_BR=https://buy.stripe.com/00w6oHaZhfaLcwJczr3oA0c

# Estados Unidos (USD)
REACT_APP_STRIPE_PAYMENT_LINK_BASIC_US=https://buy.stripe.com/00w14naZh0fR1S51UN3oA09
REACT_APP_STRIPE_PAYMENT_LINK_INTERMEDIATE_US=https://buy.stripe.com/3cI4gzebt8MngMZ2YR3oA0g
REACT_APP_STRIPE_PAYMENT_LINK_PREMIUM_US=https://buy.stripe.com/5kQaEXffx4w71S59nf3oA0e

# Cupom Educacional
REACT_APP_STRIPE_COUPON_EDU50=EDU50
```

### Uso no Código

```javascript
// Detectar país do usuário
const userCountry = await detectUserCountry(); // "BR" ou "US"

// Selecionar payment link correto
const paymentLinks = {
  BR: {
    basic: process.env.REACT_APP_STRIPE_PAYMENT_LINK_BASIC_BR,
    intermediate: process.env.REACT_APP_STRIPE_PAYMENT_LINK_INTERMEDIATE_BR,
    premium: process.env.REACT_APP_STRIPE_PAYMENT_LINK_PREMIUM_BR
  },
  US: {
    basic: process.env.REACT_APP_STRIPE_PAYMENT_LINK_BASIC_US,
    intermediate: process.env.REACT_APP_STRIPE_PAYMENT_LINK_INTERMEDIATE_US,
    premium: process.env.REACT_APP_STRIPE_PAYMENT_LINK_PREMIUM_US
  }
};

// Redirecionar para checkout
const checkoutUrl = paymentLinks[userCountry][plan];
window.location.href = checkoutUrl;
```

---

## 🧪 Testes

### Testar Payment Links

1. **Abrir link em aba anônima**
2. **Verificar:**
   - ✅ Preço correto
   - ✅ Moeda correta (BRL ou USD)
   - ✅ Nome do produto correto
   - ✅ Descrição clara
   - ✅ Campos de email e nome presentes
   - ✅ Botão "Allow promotion codes" visível (apenas Premium)

### Testar Cupom EDU50

1. **Acessar payment link Premium**
2. **Clicar em "Add promotion code"**
3. **Digitar:** EDU50
4. **Verificar:** Desconto de 50% aplicado
5. **Confirmar:** Preço final correto

### Cartões de Teste (Stripe Test Mode)

```
Número: 4242 4242 4242 4242
Data: Qualquer data futura
CVC: Qualquer 3 dígitos
CEP: Qualquer CEP válido
```

⚠️ **Não completar pagamentos de teste em produção!**

---

## 📝 Manutenção

### Atualizar Payment Links

1. **Criar novo link no Stripe Dashboard**
2. **Copiar URL completa**
3. **Atualizar variável de ambiente no Vercel**
4. **Redeploy da aplicação**
5. **Testar novo link**
6. **Atualizar esta documentação**

### Criar Novo Cupom

1. **Acessar:** https://dashboard.stripe.com/coupons
2. **Clicar em "+ New"**
3. **Configurar:**
   - Nome descritivo
   - Código único
   - Tipo de desconto (percentage ou amount)
   - Duração
   - Produtos aplicáveis
4. **Salvar e testar**

---

## 🔗 Links Úteis

- **Stripe Dashboard:** https://dashboard.stripe.com
- **Payment Links:** https://dashboard.stripe.com/payment-links
- **Coupons:** https://dashboard.stripe.com/coupons
- **Webhooks:** https://dashboard.stripe.com/webhooks
- **Documentação Stripe:** https://stripe.com/docs

---

## 📞 Suporte

Para questões sobre payment links:
- **Email:** suporte@kizirianmax.site
- **GitHub Issues:** https://github.com/kizirianmax/Rkmmax-app/issues

---

**Criado por:** Roberto Kizirian Max  
**Data:** 20/10/2025  
**Status:** ✅ Produção

