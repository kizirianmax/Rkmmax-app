/**
 * /api/github-oauth/[action]
 * Rota dinâmica para GitHub OAuth
 * - /api/github-oauth/authorize → Inicia fluxo OAuth
 * - /api/github-oauth/callback → Recebe callback do GitHub
 */

const GITHUB_CLIENT_ID = process.env.GITHUB_OAUTH_CLIENT_ID || process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_OAUTH_CLIENT_SECRET || process.env.GITHUB_CLIENT_SECRET;
const GITHUB_REDIRECT_URI = process.env.GITHUB_OAUTH_REDIRECT_URI || 'https://kizirianmax.site/api/github-oauth/callback';

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

export default async function handler(req, res) {
  // Extract action from URL path (e.g., /api/github-oauth/authorize -> authorize)
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathParts = url.pathname.split('/').filter(Boolean);
  const action = pathParts[2] || req.query.action; // api/github-oauth/[action]

  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // AUTHORIZE
    if (action === 'authorize') {
      console.log('📝 GitHub OAuth: Iniciando autorização...');

      if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
        return res.status(500).json({
          error: 'GitHub OAuth não configurado',
          message: 'GITHUB_OAUTH_CLIENT_ID e GITHUB_OAUTH_CLIENT_SECRET não estão definidos',
        });
      }

      const state = Math.random().toString(36).substring(7);
      const authUrl = generateAuthorizationUrl(state);

      console.log('✅ URL de autorização gerada');

      return res.status(200).json({
        success: true,
        authUrl: authUrl,
        state: state,
      });
    }

    // CALLBACK
    if (action === 'callback') {
      const url = new URL(req.url, `https://${req.headers.host}`);
      const code = url.searchParams.get('code');
      const error = url.searchParams.get('error');

      console.log('📝 GitHub OAuth Callback recebido');

      if (error) {
        const redirectUrl = `https://kizirianmax.site/hibrido?error=${encodeURIComponent(error)}`;
        res.writeHead(302, { Location: redirectUrl });
        return res.end();
      }

      if (!code) {
        const redirectUrl = `https://kizirianmax.site/hibrido?error=no_code`;
        res.writeHead(302, { Location: redirectUrl });
        return res.end();
      }

      const token = await exchangeCodeForToken(code);
      console.log('✅ Token obtido com sucesso');

      const validation = await validateToken(token);

      if (!validation.valid) {
        const redirectUrl = `https://kizirianmax.site/hibrido?error=invalid_token`;
        res.writeHead(302, { Location: redirectUrl });
        return res.end();
      }

      console.log('✅ Usuário autenticado:', validation.user.login);

      const redirectUrl = `https://kizirianmax.site/hibrido?github_token=${token}&user_name=${validation.user.login}`;
      res.writeHead(302, { Location: redirectUrl });
      return res.end();
    }

    // 404
    return res.status(404).json({
      error: 'Action não encontrada',
      available: ['authorize', 'callback'],
    });
  } catch (error) {
    console.error('❌ GitHub OAuth Error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: error.message,
    });
  }
}
