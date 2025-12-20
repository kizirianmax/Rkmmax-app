/**
 * POST /api/github-oauth/authorize
 * Inicia fluxo OAuth do GitHub
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

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
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

    console.log('✅ URL de autorização gerada:', authUrl);

    return res.status(200).json({
      success: true,
      authUrl: authUrl,
      state: state,
      message: 'Clique no link para autorizar Serginho a acessar seu GitHub',
    });
  } catch (error) {
    console.error('❌ GitHub OAuth Error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: error.message,
    });
  }
}
