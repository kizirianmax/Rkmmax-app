// src/lib/fnClient.js
const PROVIDERS = {
  vercel: () => `${window.location.origin}/api`,
  netlify: () => process.env.REACT_APP_FUNCTIONS_BASE_URL, // ex: https://seuapp.netlify.app
};

function buildUrl(provider, path) {
  const base = PROVIDERS[provider]?.();
  if (!base) return null;
  return provider === 'vercel'
    ? `${base}${path}`                                // /api/status
    : `${base}/.netlify/functions${path}`;           // /.netlify/functions/status
}

/**
 * REACT_APP_BACKEND_PROVIDER:
 *  - 'vercel'  -> só Vercel
 *  - 'netlify' -> só Netlify
 *  - 'auto'    -> Vercel e, se falhar, tenta Netlify (default)
 */
export async function callFn(path, fetchOptions = {}) {
  const mode = (process.env.REACT_APP_BACKEND_PROVIDER || 'auto').toLowerCase();
  const order =
    mode === 'vercel' ? ['vercel']
  : mode === 'netlify' ? ['netlify']
  : ['vercel', 'netlify'];

  let lastError;
  for (const p of order) {
    const url = buildUrl(p, path);
    if (!url) continue;
    try {
      const res = await fetch(url, fetchOptions);
      if (res.ok) return res;
      lastError = new Error(`${p} respondeu ${res.status}`);
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError || new Error('Nenhum provider respondeu.');
}
