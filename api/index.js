/**
 * 🎯 ROTEADOR UNIFICADO - TODAS AS APIs
 * 
 * Solução para limite de 12 funções do Vercel Hobby
 * Roteia todas as requisições para handlers específicos em lib/handlers/
 * 
 * Este é o ÚNICO arquivo serverless no diretório /api/
 */

import aiHandler from '../lib/handlers/ai.js';
import transcribeHandler from '../lib/handlers/transcribe.js';
import visionHandler from '../lib/handlers/vision.js';
import imageGenerateHandler from '../lib/handlers/image-generate.js';
import checkoutHandler from '../lib/handlers/checkout.js';
import pricesHandler from '../lib/handlers/prices.js';
import mePlanHandler from '../lib/handlers/me-plan.js';
import stripeWebhookHandler from '../lib/handlers/stripe-webhook.js';
import sendEmailHandler from '../lib/handlers/send-email.js';
import feedbackHandler from '../lib/handlers/feedback.js';
import unifiedClaudeHandler from '../lib/handlers/unified-claude.js';
import githubOAuthHandler from '../lib/handlers/github-oauth.js';

/**
 * Mapa de rotas para handlers
 */
const routes = {
  '/api/ai': aiHandler,
  '/api/transcribe': transcribeHandler,
  '/api/vision': visionHandler,
  '/api/image-generate': imageGenerateHandler,
  '/api/checkout': checkoutHandler,
  '/api/prices': pricesHandler,
  '/api/me-plan': mePlanHandler,
  '/api/stripe-webhook': stripeWebhookHandler,
  '/api/send-email': sendEmailHandler,
  '/api/feedback': feedbackHandler,
  '/api/unified-claude': unifiedClaudeHandler,
  '/api/github-oauth': githubOAuthHandler
};

/**
 * Aplicar CORS em todas as rotas
 */
function applyCORS(res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );
}

/**
 * Encontrar handler baseado no pathname
 */
function findHandler(pathname) {
  // Tentar match exato primeiro
  if (routes[pathname]) {
    return routes[pathname];
  }
  
  // Tentar match com prefixo (para rotas dinâmicas como /api/github-oauth/authorize)
  for (const [route, handler] of Object.entries(routes)) {
    if (pathname.startsWith(route + '/') || pathname === route) {
      return handler;
    }
  }
  
  return null;
}

/**
 * Handler principal - Roteador
 */
export default async function handler(req, res) {
  // Aplicar CORS
  applyCORS(res);
  
  // Responder OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  try {
    // Extrair pathname
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;
    
    console.log(`📍 [Router] ${req.method} ${pathname}`);
    
    // Health check
    if (pathname === '/api/health' || pathname === '/api' || pathname === '/api/') {
      return res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        version: '2.0.0',
        info: 'Unified API Router - Vercel Hobby Optimized',
        routes: Object.keys(routes).sort()
      });
    }
    
    // Encontrar handler
    const routeHandler = findHandler(pathname);
    
    if (!routeHandler) {
      console.warn(`⚠️ [Router] Rota não encontrada: ${pathname}`);
      return res.status(404).json({
        error: 'Rota não encontrada',
        path: pathname,
        availableRoutes: Object.keys(routes).sort()
      });
    }
    
    // Executar handler
    return await routeHandler(req, res);
    
  } catch (error) {
    console.error('❌ [Router] Erro:', error);
    return res.status(500).json({
      error: 'Erro interno do servidor',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

/**
 * Configuração para rotas que precisam de body parsing customizado
 * stripe-webhook precisa de raw body
 */
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb'
    }
  }
};
