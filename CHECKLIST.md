# 📋 Checklist do Projeto RKMMax-app

Lista dos arquivos **já conferidos** até agora. Cada item tem uma breve descrição para referência e continuidade do projeto.

---

## ✅ Arquivos Conferidos

- **netlify.toml**  
  Configuração do build/deploy no Netlify (funções e redirecionamentos).

- **.gitignore**  
  Ignora `node_modules/`, `.env` e `plans.json` para manter o repositório limpo.

- **.env.local**  
  Variáveis de ambiente com 6 planos Stripe (BR e US):  
  - BR: R$14,90 | R$50,00 | R$90,00  
  - US: $10 | $20 | $30  

- **src/config/plans.json**  
  Estrutura dos 6 planos (BR e US) com preços e limites de tokens.

- **netlify/functions/stripe-webhook.js**  
  Webhook do Stripe → recebe eventos, valida assinatura e atualiza tabela `subscriptions` no Supabase.

- **netlify/functions/status.js**  
  Healthcheck → retorna `ok`, `uptime` e `timestamp`.

---

## ⚠️ Pendentes de Conferência

- `README.md`  
- `src/components/Logout.jsx`  
- Outros arquivos/pastas do `src/` (componentes, páginas, etc.)

---
