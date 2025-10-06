## Como rodar localmente

> Pré-requisitos: Node 18+ e npm.

```bash
# 1) Dependências
npm install

# 2) Variáveis de ambiente (.env.local na raiz do projeto)

# Supabase
REACT_APP_SUPABASE_URL=coloque_a_url_do_seu_projeto
REACT_APP_SUPABASE_ANON_KEY=coloque_a_sua_anon_key

# Stripe – Payment Links (usados na tela /subscribe)
REACT_APP_LINK_PREMIUM_BR=https://buy.stripe.com/SEU_LINK_PREMIUM_BR
REACT_APP_LINK_PREMIUM_US=https://buy.stripe.com/SEU_LINK_PREMIUM_US

# Região padrão mostrada na tela de assinatura (BR ou US)
REACT_APP_REGION_DEFAULT=BR

# 3) Subir o app
npm start
