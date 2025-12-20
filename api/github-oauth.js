/**
 * GITHUB OAUTH AUTHENTICATION
 * Fluxo OAuth2 para autorizar Serginho a acessar GitHub
 * 
 * Endpoints:
 * - POST /api/github-oauth/authorize → Inicia fluxo OAuth
 * - GET /api/github-oauth/callback → Recebe código e troca por token
 * - POST /api/github-oauth/validate → Valida token existente
 * - POST /api/github-oauth/revoke → Revoga token
 * 
 * Compatível com Vercel Serverless (ESM)
 */

// Configuração do GitHub OAuth
const GITHUB_CLIENT_ID = process.env.GITHUB_OAUTH_CLIENT_ID || process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_OAUTH_CLIENT_SECRET || process.env.GITHUB_CLIENT_SECRET;
const GITHUB_REDIRECT_URI = process.env.GITHUB_OAUTH_REDIRECT_URI || process.env.GITHUB_REDIRECT_URI || 'https://kizirianmax.site/api/github-oauth/callback';

// Armazenamento em memória (em produção, usar banco de dados)
const tokenStore = new Map();

/**
 * Gerar URL de autorização do GitHub
 */
function generateAuthorizationUrl(state) {
  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    redirect_uri: GITHUB_REDIRECT_URI,
    scope: 'repo,workflow,user',
    state: state,
    allow_signup: 'true',
  });

  return `https://github.com/login/oauth/authorize?${params.toString()}`;
}

/**
 * Trocar código por token usando fetch
 */
async function exchangeCodeForToken(code) {
  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    client_secret: GITHUB_CLIENT_SECRET,
    code: code,
    redirect_uri: GITHUB_REDIRECT_URI,
  });

  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
      'User-Agent': 'RKMMAX-Serginho',
    },
    body: params.toString(),
  });

  if (!response.ok) {
    throw new Error(`GitHub OAuth error: ${response.status}`);
  }

  const result = await response.json();

  if (result.error) {
    throw new Error(`GitHub OAuth error: ${result.error_description || result.error}`);
  }

  return result.access_token;
}

/**
 * Validar token com GitHub
 */
async function validateToken(token) {
  try {
    const response = await fetch('https://api.github.com/user', {
      method: 'GET',
      headers: {
        'Authorization': `token ${token}`,
        'User-Agent': 'RKMMAX-Serginho',
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (response.ok) {
      const user = await response.json();
      return {
        valid: true,
        user: {
          login: user.login,
          id: user.id,
          name: user.name,
          avatar_url: user.avatar_url,
        },
      };
    }
    return { valid: false };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

/**
 * Parsear body JSON
 */
async function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        resolve({});
      }
    });
    req.on('error', reject);
  });
}

/**
 * Handler principal
 */
export default async function handler(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // POST /api/github-oauth/authorize
    if (pathname === '/api/github-oauth/authorize' && req.method === 'POST') {
      console.log('📝 GitHub OAuth: Iniciando autorização...');
      console.log('📝 CLIENT_ID configurado:', !!GITHUB_CLIENT_ID);
      console.log('📝 CLIENT_SECRET configurado:', !!GITHUB_CLIENT_SECRET);

      if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
        return res.status(500).json({
          error: 'GitHub OAuth não configurado',
          message: 'GITHUB_OAUTH_CLIENT_ID e GITHUB_OAUTH_CLIENT_SECRET não estão definidos',
        });
      }

      const state = Math.random().toString(36).substring(7);
      const authUrl = generateAuthorizationUrl(state);

      // Armazenar state para validar no callback
      tokenStore.set(`state_${state}`, {
        timestamp: Date.now(),
        state: state,
      });

      console.log('✅ URL de autorização gerada:', authUrl);

      return res.status(200).json({
        success: true,
        authUrl: authUrl,
        state: state,
        message: 'Clique no link para autorizar Serginho a acessar seu GitHub',
      });
    }

    // GET /api/github-oauth/callback
    if (pathname === '/api/github-oauth/callback' && req.method === 'GET') {
      const code = url.searchParams.get('code');
      const state = url.searchParams.get('state');
      const error = url.searchParams.get('error');

      console.log('📝 GitHub OAuth Callback recebido');

      if (error) {
        return res.status(400).json({
          error: 'Autorização negada',
          message: error,
        });
      }

      if (!code) {
        return res.status(400).json({
          error: 'Código não recebido',
        });
      }

      try {
        const token = await exchangeCodeForToken(code);
        console.log('✅ Token obtido com sucesso');

        // Validar token
        const validation = await validateToken(token);

        if (!validation.valid) {
          return res.status(400).json({
            error: 'Token inválido',
            message: validation.error,
          });
        }

        // Armazenar token (em produção, salvar em banco de dados)
        tokenStore.set(`token_${validation.user.login}`, {
          token: token,
          user: validation.user,
          timestamp: Date.now(),
        });

        console.log('✅ Usuário autenticado:', validation.user.login);

        // Redirecionar de volta para o app com o token
        const redirectUrl = `https://kizirianmax.site/hibrido?github_token=${token}&user_name=${validation.user.login}`;
        res.writeHead(302, { Location: redirectUrl });
        return res.end();
      } catch (error) {
        console.error('❌ Erro na autenticação:', error);
        return res.status(500).json({
          error: 'Erro na autenticação',
          message: error.message,
        });
      }
    }

    // POST /api/github-oauth/validate
    if (pathname === '/api/github-oauth/validate' && req.method === 'POST') {
      const body = await parseBody(req);
      const { token } = body;

      if (!token) {
        return res.status(400).json({
          error: 'Token não fornecido',
        });
      }

      const validation = await validateToken(token);

      return res.status(200).json({
        valid: validation.valid,
        user: validation.user,
        error: validation.error,
      });
    }

    // POST /api/github-oauth/revoke
    if (pathname === '/api/github-oauth/revoke' && req.method === 'POST') {
      const body = await parseBody(req);
      const { username } = body;

      if (!username) {
        return res.status(400).json({
          error: 'Username não fornecido',
        });
      }

      tokenStore.delete(`token_${username}`);

      return res.status(200).json({
        success: true,
        message: `Token revogado para ${username}`,
      });
    }

    // 404
    return res.status(404).json({
      error: 'Endpoint não encontrado',
      available: [
        'POST /api/github-oauth/authorize',
        'GET /api/github-oauth/callback',
        'POST /api/github-oauth/validate',
        'POST /api/github-oauth/revoke',
      ],
    });
  } catch (error) {
    console.error('❌ GitHub OAuth Error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: error.message,
    });
  }
}
