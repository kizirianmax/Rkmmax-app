/**
 * Owner Users API Handler
 * Manage users for owner dashboard
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Verifica se o usuário é o Owner
 */
function isOwner(email) {
  return email === 'robertokizirianmax@gmail.com';
}

export default async function ownerUsersHandler(req, res) {
  try {
    // Pega email do header ou autenticação
    const userEmail = req.headers['x-user-email'] || req.query.email;

    // Verifica se é owner
    if (!isOwner(userEmail)) {
      return res.status(403).json({ 
        error: 'Forbidden',
        message: 'Apenas o owner pode acessar o gerenciamento de usuários'
      });
    }

    // GET - Listar usuários
    if (req.method === 'GET') {
      const { role, status, page = 1, limit = 30 } = req.query;

      // Buscar usuários do Supabase Auth
      const { data: { users }, error } = await supabase.auth.admin.listUsers({
        page: parseInt(page),
        perPage: parseInt(limit)
      });

      if (error) {
        throw error;
      }

      // Filtrar por role e status se necessário
      let filteredUsers = users || [];
      
      if (role && role !== 'all') {
        filteredUsers = filteredUsers.filter(user => 
          user.user_metadata?.role === role
        );
      }

      if (status && status !== 'all') {
        filteredUsers = filteredUsers.filter(user => {
          if (status === 'active') {
            return user.email_confirmed_at !== null;
          }
          return user.email_confirmed_at === null;
        });
      }

      // Formatar resposta
      const formattedUsers = filteredUsers.map(user => ({
        id: user.id,
        email: user.email,
        role: user.user_metadata?.role || 'BASIC',
        status: user.email_confirmed_at ? 'active' : 'inactive',
        created_at: user.created_at,
        last_sign_in: user.last_sign_in_at,
        messages: 0 // TODO: buscar do banco
      }));

      return res.status(200).json({
        success: true,
        users: formattedUsers,
        total: formattedUsers.length,
        page: parseInt(page),
        limit: parseInt(limit)
      });
    }

    // POST - Criar ou atualizar usuário (futuro)
    if (req.method === 'POST') {
      return res.status(501).json({ 
        error: 'Not implemented',
        message: 'Funcionalidade em desenvolvimento'
      });
    }

    // Método não suportado
    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('Owner Users Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
