/**
 * Owner Stats API Handler
 * Returns system statistics for the owner dashboard
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

export default async function ownerStatsHandler(req, res) {
  // Apenas aceita GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Pega email do header ou autenticação
    const userEmail = req.headers['x-user-email'] || req.query.email;

    // Verifica se é owner
    if (!isOwner(userEmail)) {
      return res.status(403).json({ 
        error: 'Forbidden',
        message: 'Apenas o owner pode acessar estas estatísticas'
      });
    }

    // Busca estatísticas do sistema
    const stats = {
      users: {
        total: 0,
        active: 0,
        new_30d: 0,
        by_role: {
          OWNER: 1,
          ADMIN: 0,
          PREMIUM: 0,
          BASIC: 0
        }
      },
      messages: {
        total: 0,
        today: 0,
        this_week: 0,
        this_month: 0
      },
      revenue: {
        total: 0,
        monthly: 0,
        yearly: 0
      },
      specialists: {
        total: 54,
        most_used: []
      },
      system: {
        uptime: process.uptime(),
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'production'
      }
    };

    // TODO: Buscar dados reais do Supabase quando as tabelas estiverem criadas
    // const { data: usersData } = await supabase.from('users').select('*');
    // stats.users.total = usersData?.length || 0;

    return res.status(200).json({
      success: true,
      stats,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Owner Stats Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
