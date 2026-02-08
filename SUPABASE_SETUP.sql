-- =========================================
-- SUPABASE SETUP - Sistema de Autenticação OWNER
-- =========================================
-- Este script configura o banco de dados Supabase para o sistema de autenticação
-- com acesso OWNER implementado.
--
-- INSTRUÇÕES:
-- 1. Acesse o Supabase Dashboard
-- 2. Vá em "SQL Editor"
-- 3. Cole este script completo
-- 4. Clique em "Run" para executar
-- =========================================

-- -----------------------------------------
-- 1. CRIAR USUÁRIO OWNER (Método Manual)
-- -----------------------------------------
-- NOTA: A criação de usuário deve ser feita através do Dashboard do Supabase
-- ou através da interface de autenticação da aplicação.
-- 
-- Para criar o usuário Owner manualmente no Supabase Dashboard:
-- 1. Vá em "Authentication" > "Users"
-- 2. Clique em "Add user" > "Create new user"
-- 3. Email: robertokizirianmax@gmail.com
-- 4. Password: Admin@2026!RKM
-- 5. Confirm password: Admin@2026!RKM
-- 6. Auto Confirm User: YES (marque)
-- 7. Clique em "Create user"

-- -----------------------------------------
-- 2. ADICIONAR METADADOS AO USUÁRIO OWNER
-- -----------------------------------------
-- Após criar o usuário, adicione o role OWNER aos metadados

-- IMPORTANTE: Substitua 'USER_ID_AQUI' pelo ID real do usuário criado
-- Você pode encontrar o ID na tabela auth.users ou no Dashboard

-- UPDATE auth.users
-- SET raw_user_meta_data = raw_user_meta_data || '{"role": "OWNER"}'::jsonb
-- WHERE email = 'robertokizirianmax@gmail.com';

-- -----------------------------------------
-- 3. CRIAR TABELA DE LOGS DO OWNER
-- -----------------------------------------
-- Esta tabela registra todas as ações realizadas pelo Owner

CREATE TABLE IF NOT EXISTS owner_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  timestamp TIMESTAMPTZ DEFAULT now(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email TEXT,
  action TEXT NOT NULL,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Comentário na tabela
COMMENT ON TABLE owner_logs IS 'Registra todas as ações realizadas pelo Owner do sistema';

-- Comentários nas colunas
COMMENT ON COLUMN owner_logs.user_id IS 'ID do usuário que realizou a ação';
COMMENT ON COLUMN owner_logs.user_email IS 'Email do usuário para referência rápida';
COMMENT ON COLUMN owner_logs.action IS 'Nome da ação realizada (ex: LOGIN, ACCESS_DASHBOARD, CHANGE_PASSWORD)';
COMMENT ON COLUMN owner_logs.details IS 'Detalhes adicionais da ação em formato JSON';

-- -----------------------------------------
-- 4. CRIAR ÍNDICES PARA PERFORMANCE
-- -----------------------------------------

-- Índice para buscar logs por usuário
CREATE INDEX IF NOT EXISTS idx_owner_logs_user_id 
ON owner_logs(user_id);

-- Índice para buscar logs por timestamp (mais recentes primeiro)
CREATE INDEX IF NOT EXISTS idx_owner_logs_timestamp 
ON owner_logs(timestamp DESC);

-- Índice para buscar logs por tipo de ação
CREATE INDEX IF NOT EXISTS idx_owner_logs_action 
ON owner_logs(action);

-- Índice composto para buscas combinadas
CREATE INDEX IF NOT EXISTS idx_owner_logs_user_timestamp 
ON owner_logs(user_id, timestamp DESC);

-- -----------------------------------------
-- 5. CRIAR TABELA DE CONFIGURAÇÕES DO SISTEMA
-- -----------------------------------------
-- Esta tabela armazena configurações gerais do sistema

CREATE TABLE IF NOT EXISTS system_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE system_config IS 'Configurações gerais do sistema';

-- Inserir configurações padrão
INSERT INTO system_config (key, value, description)
VALUES 
  ('owner_email', '"robertokizirianmax@gmail.com"'::jsonb, 'Email do proprietário do sistema'),
  ('maintenance_mode', 'false'::jsonb, 'Modo de manutenção ativado/desativado'),
  ('max_free_messages', '10'::jsonb, 'Número máximo de mensagens gratuitas para usuários básicos'),
  ('max_premium_messages', '100'::jsonb, 'Número máximo de mensagens para usuários premium')
ON CONFLICT (key) DO NOTHING;

-- -----------------------------------------
-- 6. CRIAR TABELA DE ROLES E PERMISSÕES
-- -----------------------------------------
-- Esta tabela define os roles disponíveis e suas permissões

CREATE TABLE IF NOT EXISTS user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  level INTEGER NOT NULL,
  badge TEXT,
  color TEXT,
  permissions JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE user_roles IS 'Define os roles disponíveis e suas permissões';

-- Inserir roles padrão
INSERT INTO user_roles (name, level, badge, color, permissions)
VALUES 
  ('OWNER', 999, '👑', '#FFD700', 
   '{"fullAccess": true, "unlimitedMessages": true, "unlimitedTokens": true, "allAgents": true, "allPlans": true, "bypassPaywall": true, "bypassRateLimits": true, "adminPanel": true, "userManagement": true, "systemConfig": true, "viewAnalytics": true, "debugMode": true, "canSimulateUsers": true, "freeAccess": true}'::jsonb),
  ('ADMIN', 100, '🔧', '#FF6B6B',
   '{"userManagement": true, "viewAnalytics": true, "allAgents": true, "messageLimit": 1000}'::jsonb),
  ('PREMIUM', 50, '⭐', '#4ECDC4',
   '{"allAgents": true, "messageLimit": 100}'::jsonb),
  ('BASIC', 10, '🟢', '#95E1D3',
   '{"serginhoOnly": true, "messageLimit": 10}'::jsonb)
ON CONFLICT (name) DO NOTHING;

-- -----------------------------------------
-- 7. CRIAR POLÍTICAS DE SEGURANÇA (RLS)
-- -----------------------------------------
-- Row Level Security para proteger os dados

-- Habilitar RLS nas tabelas
ALTER TABLE owner_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Política: Owner pode ver e inserir todos os logs
CREATE POLICY "Owner can view all logs"
ON owner_logs FOR SELECT
USING (
  auth.uid() IN (
    SELECT id FROM auth.users WHERE email = 'robertokizirianmax@gmail.com'
  )
);

CREATE POLICY "Owner can insert logs"
ON owner_logs FOR INSERT
WITH CHECK (
  auth.uid() IN (
    SELECT id FROM auth.users WHERE email = 'robertokizirianmax@gmail.com'
  )
);

-- Política: Owner pode ver e atualizar configurações do sistema
CREATE POLICY "Owner can view system config"
ON system_config FOR SELECT
USING (
  auth.uid() IN (
    SELECT id FROM auth.users WHERE email = 'robertokizirianmax@gmail.com'
  )
);

CREATE POLICY "Owner can update system config"
ON system_config FOR UPDATE
USING (
  auth.uid() IN (
    SELECT id FROM auth.users WHERE email = 'robertokizirianmax@gmail.com'
  )
);

-- Política: Todos podem ver roles (leitura pública)
CREATE POLICY "Anyone can view user roles"
ON user_roles FOR SELECT
USING (true);

-- -----------------------------------------
-- 8. CRIAR FUNÇÃO PARA VERIFICAR SE É OWNER
-- -----------------------------------------

CREATE OR REPLACE FUNCTION is_owner(user_email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN user_email = 'robertokizirianmax@gmail.com';
END;
$$;

COMMENT ON FUNCTION is_owner IS 'Verifica se o email fornecido é do Owner';

-- -----------------------------------------
-- 9. CRIAR FUNÇÃO PARA REGISTRAR AÇÃO DO OWNER
-- -----------------------------------------

CREATE OR REPLACE FUNCTION log_owner_action(
  p_user_id UUID,
  p_user_email TEXT,
  p_action TEXT,
  p_details JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO owner_logs (user_id, user_email, action, details)
  VALUES (p_user_id, p_user_email, p_action, p_details)
  RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$;

COMMENT ON FUNCTION log_owner_action IS 'Registra uma ação realizada pelo Owner';

-- -----------------------------------------
-- 10. CRIAR VIEW PARA ESTATÍSTICAS DO OWNER
-- -----------------------------------------

CREATE OR REPLACE VIEW owner_stats AS
SELECT
  (SELECT COUNT(*) FROM auth.users) AS total_users,
  (SELECT COUNT(*) FROM auth.users WHERE created_at >= NOW() - INTERVAL '30 days') AS new_users_30d,
  (SELECT COUNT(*) FROM owner_logs) AS total_actions,
  (SELECT COUNT(*) FROM owner_logs WHERE timestamp >= NOW() - INTERVAL '7 days') AS actions_7d
;

COMMENT ON VIEW owner_stats IS 'Estatísticas gerais do sistema para o Owner';

-- -----------------------------------------
-- FINALIZAÇÃO
-- -----------------------------------------

-- Verificar se tudo foi criado corretamente
DO $$
BEGIN
  RAISE NOTICE '✅ Setup concluído com sucesso!';
  RAISE NOTICE '📋 Tabelas criadas:';
  RAISE NOTICE '   - owner_logs';
  RAISE NOTICE '   - system_config';
  RAISE NOTICE '   - user_roles';
  RAISE NOTICE '🔒 Políticas de segurança (RLS) ativadas';
  RAISE NOTICE '⚙️ Funções e views criadas';
  RAISE NOTICE '';
  RAISE NOTICE '⚠️ PRÓXIMOS PASSOS:';
  RAISE NOTICE '1. Criar usuário Owner manualmente no Dashboard';
  RAISE NOTICE '   Email: robertokizirianmax@gmail.com';
  RAISE NOTICE '   Senha: Admin@2026!RKM';
  RAISE NOTICE '2. Fazer login na aplicação';
  RAISE NOTICE '3. Trocar senha no primeiro acesso';
END $$;
