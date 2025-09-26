# 📋 Checklist do Projeto RKMMax-app

Lista dos arquivos **já conferidos** até agora.

---

## ✅ Arquivos Conferidos

- **netlify.toml**  
  Configuração do build/deploy no Netlify (funções e diretório de saída).

- **.gitignore**  
  Ignora `node_modules/`, arquivos de build e configs locais.

- **README.md**  
  Instruções e documentação inicial do projeto.

- **src/components/Logout.jsx**  
  Corrigido para limpar sessão e redirecionar corretamente.

- **.env.local**  
  Contém as 6 variáveis dos planos BR e US.

- **config/plans.json**  
  Atualizado com os 6 planos e limites corretos (3 BR + 3 US).

- **netlify/functions/prices.js**  
  Função que lista preços ativos no Stripe e organiza por região/tier.

- **netlify/functions/plans.js**  
  Função auxiliar que resolve os planos pelo `lookup_key` e valida chaves.

- **netlify/functions/guardAndBill.js**  
  Controle de limites diários/mensais de tokens por plano.  
  Inclui regras para GPT-5 (mensal) e limites diários (Nano, Mini etc.).

- **netlify/functions/checkout.js**  
  Cria sessão de checkout no Stripe usando `lookupKey`.  
  Busca preços ativos (`prices.list`) com `lookup_keys`, expande produto, gera `session.url`.  
  Usa `SITE_URL` / `URL` do Netlify ou `localhost` para `success_url` e `cancel_url`.  
  Requer `STRIPE_SECRET_KEY_RKMMAX` no ambiente.

- **netlify/functions/cors.js**  
  Middleware simples para CORS.  
  Lê `ORIGIN` do `.env.local` (se definido) ou usa origem da requisição.  
  Trata preflight (`OPTIONS`) e libera métodos/headers padrão.  
  🔎 Observação: se quiser restringir acesso, defina `ORIGIN=https://seusite.com` no `.env.local`.

- **netlify/functions/status.js**  
  Endpoint simples de status (`ok: true`, uptime, timestamp).

- **netlify/functions/stripe-webhook.js**  
  Webhook do Stripe → recebe eventos, valida assinatura e atualiza tabela `subscriptions` no Supabase.

---

## 🗑️ Arquivos Removidos

- **netlify/functions/create-checkout-session.js**  
  Usava `priceId` fixo, exigia redeploy a cada mudança de preço.  
  Substituído por `checkout.js` (lookupKey), mais flexível e eficaz.

---
