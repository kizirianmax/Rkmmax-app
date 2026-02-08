# 🔐 Instruções de Configuração - Sistema de Autenticação OWNER

Este documento contém instruções passo-a-passo para configurar e usar o sistema de autenticação com acesso OWNER implementado.

---

## 📋 Pré-requisitos

- ✅ Supabase configurado e funcionando
- ✅ Variáveis de ambiente configuradas (`REACT_APP_SUPABASE_URL` e `REACT_APP_SUPABASE_ANON_KEY`)
- ✅ Aplicação React rodando

---

## 🚀 Passo 1: Configurar Banco de Dados Supabase

### 1.1 Criar Conta Owner no Supabase

Acesse o SQL Editor do Supabase e execute o script `SUPABASE_SETUP.sql` que está na raiz do projeto.

Ou execute manualmente:

```sql
-- Criar o usuário Owner no Supabase Auth
-- ATENÇÃO: Faça isso APENAS UMA VEZ

-- Este comando cria o usuário com senha temporária
-- Você precisará fazer login e trocar a senha no primeiro acesso
```

### 1.2 Criar Tabela de Logs (Opcional)

```sql
-- Tabela para registrar ações do Owner
CREATE TABLE IF NOT EXISTS owner_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  timestamp TIMESTAMPTZ DEFAULT now(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Índice para melhorar performance
CREATE INDEX idx_owner_logs_user_id ON owner_logs(user_id);
CREATE INDEX idx_owner_logs_timestamp ON owner_logs(timestamp DESC);
```

---

## 🔑 Passo 2: Primeiro Acesso do Owner

### 2.1 Credenciais Iniciais

```
Email: robertokizirianmax@gmail.com
Senha: Admin@2026!RKM
```

⚠️ **IMPORTANTE**: Estas credenciais são TEMPORÁRIAS e devem ser trocadas no primeiro acesso!

### 2.2 Fazer Login

1. Acesse: `http://localhost:3000/login`
2. Digite o email: `robertokizirianmax@gmail.com`
3. Digite a senha: `Admin@2026!RKM`
4. Clique em "Entrar"

### 2.3 Trocar Senha (OBRIGATÓRIO)

Após o primeiro login, você será redirecionado para `/owner-dashboard`.

1. Clique em "🔑 Trocar Senha" no menu do Owner
2. Digite a senha atual: `Admin@2026!RKM`
3. Digite uma nova senha forte (mínimo 8 caracteres, com maiúsculas, minúsculas e números)
4. Confirme a nova senha
5. Clique em "Trocar Senha"

✅ Sua nova senha será salva criptografada no Supabase!

---

## 👑 Passo 3: Verificar Funcionalidades do Owner

### 3.1 Badge do Owner

Ao fazer login, você verá um badge dourado no header:

```
👑 DONO | ILIMITADO ∞
```

Este badge indica que você tem:
- ✅ Acesso TOTAL aos 54 especialistas
- ✅ Mensagens ILIMITADAS (∞)
- ✅ Tokens ILIMITADOS (∞)
- ✅ Custo R$ 0,00 (gratuito)
- ✅ Bypass de rate limits
- ✅ Bypass de paywall

### 3.2 Menu do Owner

No header, você verá 3 links especiais:

- **👑 Dashboard** - Painel de controle completo
- **👥 Usuários** - Gerenciar usuários do sistema
- **🔑 Trocar Senha** - Alterar sua senha

### 3.3 Dashboard do Owner

Acesse `/owner-dashboard` para ver:

1. **Status Cards**
   - Acesso ILIMITADO
   - Mensagens ∞
   - Custo R$ 0,00
   - Status ATIVO

2. **Configurações Ativas**
   - Bypass de Rate Limits
   - Bypass de Paywall
   - Acesso a todos os planos
   - Modo Debug
   - Simulador de Usuários

3. **Simulador de Usuários** 🎭
   - Simule a experiência de:
     - 🟢 Usuário Básico (10 msg/dia)
     - ⭐ Usuário Premium (100 msg/dia)
     - 🔧 Administrador

4. **Ações Rápidas**
   - Gerenciar Usuários
   - Trocar Senha
   - Ver Especialistas
   - Ver Logs

---

## 🧪 Passo 4: Testar Funcionalidades

### 4.1 Testar Acesso aos Especialistas

1. Acesse `/specialists`
2. Verifique que TODOS os 54 especialistas estão disponíveis
3. Teste conversar com qualquer especialista
4. Confirme que não há limite de mensagens

### 4.2 Testar Simulador de Usuários

1. Acesse `/owner-dashboard`
2. Role até "🎭 Simulador de Usuário"
3. Selecione "🟢 Usuário Básico"
4. Observe as limitações simuladas:
   - Apenas Serginho disponível
   - 10 mensagens por dia
   - Paywall ativo

5. Volte para "👑 Modo Dono" para restaurar acesso total

### 4.3 Testar Gerenciamento de Usuários

1. Acesse `/user-management`
2. Veja a lista de usuários cadastrados
3. Filtre por role (OWNER, ADMIN, PREMIUM, BASIC)
4. Observe informações: email, role, status, mensagens, data de criação

---

## 🔒 Segurança

### Proteção de Rotas

As rotas do Owner são protegidas e só podem ser acessadas por você:

- `/owner-dashboard` - Dashboard do dono
- `/user-management` - Gerenciamento de usuários
- `/change-password` - Trocar senha

Se outro usuário tentar acessar, será redirecionado para `/`.

### Logs de Ações

Todas as ações do Owner são registradas no console do navegador:

```javascript
👑 OWNER ACTION: {
  timestamp: "2026-02-08T12:34:56Z",
  user: "robertokizirianmax@gmail.com",
  action: "ACCESS_DASHBOARD",
  details: { ... }
}
```

---

## 🎨 Personalização

### Trocar Email do Owner

Se precisar usar outro email como Owner:

1. Edite `src/config/adminCredentials.js`:
   ```javascript
   export const OWNER_CREDENTIALS = {
     email: "seu-email@exemplo.com", // ← Troque aqui
     tempPassword: "Admin@2026!RKM",
     role: "OWNER"
   };
   ```

2. Edite `src/config/roles.js`:
   ```javascript
   export function isOwner(user) {
     return user?.email === 'seu-email@exemplo.com' || // ← Troque aqui
            user?.role === 'OWNER';
   }
   ```

3. Reinicie a aplicação

---

## 🐛 Troubleshooting

### Problema: "Login inválido"

**Solução**: Verifique se:
1. O usuário foi criado no Supabase Auth
2. As credenciais estão corretas
3. As variáveis de ambiente estão configuradas

### Problema: "Badge do Owner não aparece"

**Solução**: 
1. Faça logout (`/logout`)
2. Faça login novamente
3. Limpe o cache do navegador (Ctrl+Shift+Del)

### Problema: "Erro ao trocar senha"

**Solução**:
1. Verifique se a senha tem no mínimo 8 caracteres
2. Certifique-se de incluir maiúsculas, minúsculas e números
3. Tente com uma senha mais forte

### Problema: "Acesso negado ao dashboard"

**Solução**:
1. Verifique se está logado com o email correto
2. Verifique se o email no código corresponde ao seu
3. Limpe localStorage e faça login novamente

---

## 📞 Suporte

Para problemas ou dúvidas:

1. Verifique os logs do console do navegador (F12)
2. Verifique os logs do Supabase
3. Revise este documento e o `OWNER_MANUAL.md`
4. Entre em contato com o desenvolvedor

---

## ✅ Checklist de Validação

Após configurar tudo, valide:

- [ ] Login com credenciais hardcoded funciona
- [ ] Badge "👑 DONO" aparece no header
- [ ] Redirecionamento para `/owner-dashboard` após login
- [ ] Menu do Owner com 3 links aparece
- [ ] Dashboard mostra estatísticas corretas
- [ ] Trocar senha funciona
- [ ] Nova senha é salva e funciona no próximo login
- [ ] Acesso a todos os 54 especialistas
- [ ] Mensagens ilimitadas (sem erro de limite)
- [ ] Simulador de usuários funciona
- [ ] Gerenciamento de usuários carrega
- [ ] Proteção de rotas funciona (outro usuário não acessa)

---

## 🎉 Pronto!

Agora você tem acesso TOTAL e ILIMITADO ao sistema RKM Max como OWNER!

**Aproveite:**
- 🤖 Todos os 54 especialistas
- 💬 Mensagens ilimitadas (∞)
- 💰 Custo R$ 0,00
- 🚀 Modo debug ativo
- 🎭 Simulador de usuários
- 👥 Gerenciamento completo

**Próximos passos:**
- Leia `OWNER_MANUAL.md` para guia completo
- Explore todas as funcionalidades
- Configure outros usuários se necessário
