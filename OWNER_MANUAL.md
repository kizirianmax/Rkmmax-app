# 👑 Manual do Owner - RKM Max

Bem-vindo ao Manual Completo do Owner do sistema RKM Max!

Este documento detalha TODAS as funcionalidades, permissões e recursos exclusivos disponíveis para o dono do sistema.

---

## 📚 Índice

1. [Visão Geral](#visao-geral)
2. [Permissões do Owner](#permissoes-do-owner)
3. [Dashboard do Owner](#dashboard-do-owner)
4. [Gerenciamento de Usuários](#gerenciamento-de-usuarios)
5. [Simulador de Usuários](#simulador-de-usuarios)
6. [Trocar Senha](#trocar-senha)
7. [Acesso aos Especialistas](#acesso-aos-especialistas)
8. [Modo Debug](#modo-debug)
9. [Logs e Auditoria](#logs-e-auditoria)
10. [FAQs](#faqs)

---

## 🎯 Visão Geral {#visao-geral}

Como **OWNER** do sistema RKM Max, você tem:

### ✅ Acesso Total e Ilimitado

- 🤖 **54 Especialistas**: Acesso a TODOS os especialistas, sem restrições
- 💬 **Mensagens Ilimitadas**: Sem limite de uso (∞)
- 🪙 **Tokens Ilimitados**: Sem limite de tokens (∞)
- 💰 **Custo Zero**: R$ 0,00 - Tudo gratuito para você
- 🚫 **Sem Paywall**: Bypass automático de paywalls
- ⚡ **Sem Rate Limits**: Bypass automático de limites de taxa

### ⚙️ Recursos Especiais

- 👑 **Badge Exclusivo**: Badge dourado no header
- 🎭 **Simulador de Usuários**: Simule experiência de outros planos
- 👥 **Gerenciamento de Usuários**: Gerencie todos os usuários do sistema
- 🔍 **Modo Debug**: Informações detalhadas no console
- 📊 **Analytics Completo**: Estatísticas e métricas do sistema
- 🔑 **Controle Total**: Acesso a todas as configurações

---

## 🔐 Permissões do Owner {#permissoes-do-owner}

### Lista Completa de Permissões

```javascript
{
  // Acesso
  fullAccess: true,              // Acesso total ao sistema
  unlimitedMessages: true,       // Mensagens ilimitadas
  unlimitedTokens: true,         // Tokens ilimitados
  allAgents: true,               // Todos os 54 especialistas
  allPlans: true,                // Acesso a todos os planos
  
  // Bypass
  bypassPaywall: true,           // Ignora paywall
  bypassRateLimits: true,        // Ignora rate limits
  freeAccess: true,              // Custo R$ 0,00
  
  // Administração
  adminPanel: true,              // Painel de admin
  userManagement: true,          // Gerenciar usuários
  systemConfig: true,            // Configurar sistema
  viewAnalytics: true,           // Ver estatísticas
  
  // Desenvolvimento
  debugMode: true,               // Modo debug
  canSimulateUsers: true         // Simular outros usuários
}
```

---

## 📊 Dashboard do Owner {#dashboard-do-owner}

### Como Acessar

1. Faça login com suas credenciais
2. Clique em **"👑 Dashboard"** no menu do Owner
3. Ou acesse diretamente: `/owner-dashboard`

### O Que Você Vê

#### 1. Status Cards (Topo)

Quatro cards mostrando seu status:

**🔓 Acesso**
- Status: ILIMITADO
- Descrição: Todos os 54 especialistas

**💬 Mensagens**
- Quantidade: ∞ (infinito)
- Descrição: Sem limite de uso

**💰 Custo**
- Valor: R$ 0,00
- Descrição: Gratuito total

**🚀 Status**
- Estado: ATIVO
- Descrição: Debug mode ON

#### 2. Configurações Ativas

Lista de todos os bypass e permissões ativas:

- ✅ Bypass de Rate Limits: **Ativo**
- ✅ Bypass de Paywall: **Ativo**
- ✅ Acesso a todos os planos: **Ativo**
- ✅ Modo Debug: **Ativo**
- ✅ Simulador de Usuários: **Disponível**

#### 3. Simulador de Usuário

Interface para simular a experiência de diferentes tipos de usuários.
(Ver seção [Simulador de Usuários](#simulador-de-usuarios))

#### 4. Ações Rápidas

Botões para acesso rápido:

- **👥 Gerenciar Usuários**: Abre página de gerenciamento
- **🔑 Trocar Senha**: Abre página de troca de senha
- **🤖 Ver Especialistas**: Vai para lista de especialistas
- **🔍 Ver Logs**: Exibe logs no console

#### 5. Informações do Usuário

JSON com seus dados completos:
```json
{
  "email": "robertokizirianmax@gmail.com",
  "id": "uuid-do-usuario",
  "role": "OWNER",
  "accessConfig": {
    "canAccessAllAgents": true,
    "hasFullAccess": true,
    "messageLimit": Infinity,
    // ... outras configurações
  }
}
```

---

## 👥 Gerenciamento de Usuários {#gerenciamento-de-usuarios}

### Como Acessar

1. Dashboard → **"👥 Gerenciar Usuários"**
2. Ou menu do Owner → **"👥 Usuários"**
3. Ou acesse diretamente: `/user-management`

### Funcionalidades

#### Visualizar Usuários

Tabela com todos os usuários cadastrados:

| Email | Role | Status | Mensagens | Criado em | Ações |
|-------|------|--------|-----------|-----------|-------|
| usuario@example.com | ⭐ Premium | Ativo | 45 | 05/02/2026 | Ver |

#### Filtrar por Role

Dropdown para filtrar usuários:

- **Todos**: Mostra todos os usuários
- **👑 Owner**: Mostra apenas você
- **🔧 Admin**: Mostra administradores
- **⭐ Premium**: Mostra usuários premium
- **🟢 Básico**: Mostra usuários básicos

#### Informações Exibidas

Para cada usuário, você vê:

- **Email**: Email de cadastro
- **Role**: Tipo de usuário (Owner, Admin, Premium, Basic)
- **Status**: Ativo ou Inativo
- **Mensagens**: Quantidade de mensagens enviadas (ou ∞ para Owner)
- **Criado em**: Data de criação da conta
- **Ações**: Botão "Ver" para ver detalhes (em breve)

### Funcionalidades Futuras

🚧 Em desenvolvimento:

- Editar role de usuários
- Ativar/desativar contas
- Dar acesso premium manualmente
- Ver histórico de mensagens
- Ver detalhes completos do usuário
- Exportar lista de usuários

---

## 🎭 Simulador de Usuários {#simulador-de-usuarios}

### O Que É

O Simulador permite que você teste a experiência de diferentes tipos de usuários **SEM** precisar criar múltiplas contas.

### Como Usar

1. Acesse `/owner-dashboard`
2. Role até **"🎭 Simulador de Usuário"**
3. Selecione o tipo de usuário no dropdown
4. Observe as limitações simuladas

### Opções Disponíveis

#### 👑 Modo Dono (Atual)

Seu modo padrão. Características:

- Acesso ilimitado ∞
- Todos os especialistas
- Sem custos (R$ 0,00)
- Modo debug ativo

#### 🟢 Usuário Básico (10 msg/dia)

Simula a experiência de um usuário gratuito:

- Apenas Serginho disponível
- 10 mensagens por dia
- Paywall ativo
- Rate limits normais

#### ⭐ Usuário Premium (100 msg/dia)

Simula a experiência de um assinante premium:

- Todos os 54 especialistas
- 100 mensagens por dia
- Sem paywall
- Rate limits normais

#### 🔧 Administrador

Simula a experiência de um administrador:

- Todos os especialistas
- 1000 mensagens por dia
- Painel de gerenciamento
- Sem paywall

### Por Que Usar

✅ **Testes de UX**: Veja como usuários comuns experienciam o sistema

✅ **Identificar Problemas**: Encontre bugs específicos de cada plano

✅ **Validar Limites**: Confirme que rate limits estão funcionando

✅ **Demo/Apresentação**: Mostre diferentes experiências sem trocar de conta

---

## 🔑 Trocar Senha {#trocar-senha}

### Como Trocar

1. Menu do Owner → **"🔑 Trocar Senha"**
2. Ou acesse: `/change-password`

### Formulário

**Senha Atual**
- Digite sua senha atual
- Necessário para confirmar identidade

**Nova Senha**
- Mínimo 8 caracteres
- Deve conter: maiúsculas, minúsculas e números
- Não pode ser igual à senha atual

**Confirmar Nova Senha**
- Digite a nova senha novamente
- Deve ser idêntica

### Validação de Senha

Requisitos obrigatórios:

- ✅ Mínimo 8 caracteres
- ✅ Pelo menos 1 letra maiúscula (A-Z)
- ✅ Pelo menos 1 letra minúscula (a-z)
- ✅ Pelo menos 1 número (0-9)

Exemplos válidos:
- `Senha123!`
- `MinhaSenha2026`
- `Admin@2026!RKM`

### Após Trocar

1. ✅ Mensagem de sucesso aparece
2. ⏳ Aguarde 2 segundos
3. ↪️ Redirecionamento automático para dashboard
4. 🔐 Nova senha é salva **criptografada** no Supabase
5. 🔄 Próximos logins usam a nova senha

### ⚠️ Importante

- A senha antiga **PARA DE FUNCIONAR** imediatamente
- Guarde sua nova senha em local seguro
- Não compartilhe sua senha com ninguém
- Troque regularmente por segurança

---

## 🤖 Acesso aos Especialistas {#acesso-aos-especialistas}

### Total de Especialistas

Você tem acesso a **54 especialistas** divididos em 9 categorias.

### Categorias

1. **📚 Educação** (2 especialistas)
   - Didak: Didática e métodos de ensino
   - Edu: Tutor acadêmico

2. **💻 Tecnologia** (5 especialistas)
   - Code: Programação e desenvolvimento
   - Nexus: Redes e infraestrutura
   - Synth: IA e machine learning
   - Sec: Segurança cibernética
   - Data: Análise de dados

3. **🎨 Criatividade** (múltiplos)
   - Orac: Storytelling
   - Zen: Filosofia
   - (e mais...)

4. **💼 Negócios** (múltiplos)
5. **🏥 Saúde** (múltiplos)
6. **📖 Idiomas** (múltiplos)
7. **🔬 Ciências** (múltiplos)
8. **⚖️ Direito** (múltiplos)
9. **🎯 Outros** (múltiplos)

### Como Usar

1. Acesse `/specialists`
2. Escolha qualquer especialista
3. Clique para abrir chat
4. Converse SEM LIMITES

### Vantagens do Owner

- ✅ Acesso a **TODOS** os 54
- ✅ **Zero custos** por mensagem
- ✅ **Infinitas** conversas
- ✅ **Sem filas** ou rate limits
- ✅ **Prioridade** no processamento

---

## 🔍 Modo Debug {#modo-debug}

### O Que É

Modo especial que exibe informações técnicas detalhadas no console do navegador para ajudar no desenvolvimento e troubleshooting.

### Como Acessar

Abra o Console do navegador:

- **Chrome/Edge**: F12 ou Ctrl+Shift+J
- **Firefox**: F12 ou Ctrl+Shift+K
- **Safari**: Cmd+Option+C

### O Que Você Vê

#### Logs de Ações do Owner

```javascript
👑 OWNER ACTION: {
  timestamp: "2026-02-08T12:34:56.789Z",
  user: "robertokizirianmax@gmail.com",
  action: "ACCESS_DASHBOARD",
  details: {
    route: "/owner-dashboard",
    method: "GET"
  }
}
```

#### Informações de Permissões

Sempre que você acessa uma funcionalidade, o console mostra:

```javascript
✅ PERMISSION CHECK: {
  user: "robertokizirianmax@gmail.com",
  permission: "adminPanel",
  granted: true,
  reason: "OWNER_FULL_ACCESS"
}
```

#### Bypass de Limites

Quando limites são ignorados:

```javascript
⚡ BYPASS ACTIVATED: {
  type: "rate_limit",
  user: "robertokizirianmax@gmail.com",
  reason: "OWNER_BYPASS"
}
```

### Desativar Modo Debug

O modo debug é automático para o Owner. Para desativar temporariamente:

1. Abra o console
2. Digite: `localStorage.setItem('debug', 'false')`
3. Recarregue a página

Para reativar:
```javascript
localStorage.setItem('debug', 'true')
```

---

## 📝 Logs e Auditoria {#logs-e-auditoria}

### Logs Locais (Console)

Todos os logs aparecem no console do navegador em tempo real.

### Logs do Supabase

Ações importantes são salvas no banco de dados na tabela `owner_logs`:

```sql
SELECT * FROM owner_logs 
ORDER BY timestamp DESC 
LIMIT 10;
```

#### Campos Salvos

- **timestamp**: Data e hora da ação
- **user_id**: ID do usuário (você)
- **user_email**: Seu email
- **action**: Nome da ação (LOGIN, ACCESS_DASHBOARD, etc.)
- **details**: Informações adicionais em JSON

### Ações Registradas

- ✅ LOGIN: Quando você faz login
- ✅ LOGOUT: Quando você faz logout
- ✅ ACCESS_DASHBOARD: Acesso ao dashboard
- ✅ CHANGE_PASSWORD: Troca de senha
- ✅ VIEW_USERS: Visualização de usuários
- ✅ SIMULATE_USER: Simulação de outro usuário
- ✅ ACCESS_SPECIALIST: Acesso a especialista
- ✅ SEND_MESSAGE: Envio de mensagem

### Ver Logs

No dashboard, clique em **"🔍 Ver Logs"** para exibir logs recentes no console.

---

## ❓ FAQs {#faqs}

### Perguntas Frequentes

#### 1. Posso criar outros Owners?

Não. Apenas UM Owner por sistema por motivos de segurança.

#### 2. Posso promover usuários a Admin?

Sim! Use o gerenciamento de usuários (funcionalidade em desenvolvimento).

#### 3. Os usuários sabem que sou o Owner?

Não. O badge e menu do Owner são visíveis apenas para você.

#### 4. Posso revogar meu próprio acesso?

Não. O Owner não pode se auto-remover.

#### 5. Quanto tempo duram as sessões?

Sessões duram 1 hora por padrão, mas renovam automaticamente.

#### 6. Posso usar em múltiplos dispositivos?

Sim! Faça login em quantos dispositivos quiser simultaneamente.

#### 7. O que acontece se esquecer minha senha?

Use o reset de senha do Supabase ou contate o desenvolvedor.

#### 8. Posso transferir a ownership?

Sim, mas requer alteração manual no código e banco de dados.

#### 9. Logs ocupam muito espaço?

Não. Logs antigos podem ser removidos periodicamente se necessário.

#### 10. Posso desativar o Simulador?

Sim. Remova o componente `<UserSimulator />` do dashboard.

---

## 🎉 Conclusão

Parabéns! Agora você domina TODAS as funcionalidades do Owner.

### Próximos Passos

1. ✅ Explore o dashboard completamente
2. ✅ Teste todos os 54 especialistas
3. ✅ Experimente o simulador de usuários
4. ✅ Configure usuários adicionais se necessário
5. ✅ Monitore logs e estatísticas
6. ✅ Aproveite o acesso ilimitado!

### Recursos Adicionais

- 📖 `SETUP_INSTRUCTIONS.md` - Instruções de setup
- 📜 `SUPABASE_SETUP.sql` - Script de banco de dados
- 💻 Código fonte em `/src`

### Suporte

Dúvidas ou problemas? Entre em contato com o desenvolvedor.

---

**Desenvolvido com 💙 para RKM Max**

_Última atualização: Fevereiro 2026_
