/**
 * GET /api/github-oauth/callback
 * Recebe código do GitHub e troca por token
 */

const GITHUB_CLIENT_ID = process.env.GITHUB_OAUTH_CLIENT_ID || process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_OAUTH_CLIENT_SECRET || process.env.GITHUB_CLIENT_SECRET;
const GITHUB_REDIRECT_URI = process.env.GITHUB_OAUTH_REDIRECT_URI || 'https://kizirianmax.site/api/github-oauth/callback';

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
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const url = new URL(req.url, `https://${req.headers.host}`);
    const code = url.searchParams.get('code');
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

    const token = await exchangeCodeForToken(code);
    console.log('✅ Token obtido com sucesso');

    const validation = await validateToken(token);

    if (!validation.valid) {
      return res.status(400).json({
        error: 'Token inválido',
        message: validation.error,
      });
    }

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
