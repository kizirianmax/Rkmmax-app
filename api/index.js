/**
 * 🚀 RKMMAX API - UNIFIED SERVERLESS ROUTER
 * 
 * Solução para limite de 12 funções do Vercel Hobby
 * Roteia todas as requisições para handlers específicos
 */

// Import all handlers
import aiHandler from '../lib/handlers/ai.js';
import checkoutHandler from '../lib/handlers/checkout.js';
import feedbackHandler from '../lib/handlers/feedback.js';
import imageGenerateHandler from '../lib/handlers/image-generate.js';
import mePlanHandler from '../lib/handlers/me-plan.js';
import pricesHandler from '../lib/handlers/prices.js';
import sendEmailHandler from '../lib/handlers/send-email.js';
import stripeWebhookHandler from '../lib/handlers/stripe-webhook.js';
import transcribeHandler from '../lib/handlers/transcribe.js';
import unifiedClaudeHandler from '../lib/handlers/unified-claude.js';
import visionHandler from '../lib/handlers/vision.js';
import githubOAuthHandler from '../lib/handlers/github-oauth.js';

// Owner handlers
import ownerStatsHandler from '../lib/handlers/owner-stats.js';
import ownerUsersHandler from '../lib/handlers/owner-users.js';
import checkAccessHandler from '../lib/handlers/check-access.js';

/**
 * Apply CORS headers to all responses
 */
function applyCORS(res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, x-user-email'
  );
}

/**
 * Main unified router
 */
export default async function handler(req, res) {
  applyCORS(res);

  // Handle OPTIONS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Parse pathname from URL
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;

    console.log(`📍 Router: ${req.method} ${pathname}`);

    // Route to appropriate handler based on pathname
    
    // AI endpoints
    if (pathname === '/api/ai' || pathname.startsWith('/api/ai/')) {
      return aiHandler(req, res);
    }
    
    if (pathname === '/api/unified-claude' || pathname.startsWith('/api/unified-claude/')) {
      return unifiedClaudeHandler(req, res);
    }

    // Media endpoints
    if (pathname === '/api/transcribe' || pathname.startsWith('/api/transcribe/')) {
      return transcribeHandler(req, res);
    }
    
    if (pathname === '/api/vision' || pathname.startsWith('/api/vision/')) {
      return visionHandler(req, res);
    }
    
    if (pathname === '/api/image-generate' || pathname.startsWith('/api/image-generate/')) {
      return imageGenerateHandler(req, res);
    }

    // GitHub OAuth endpoints
    if (pathname === '/api/github-oauth' || pathname.startsWith('/api/github-oauth/')) {
      return githubOAuthHandler(req, res);
    }

    // Email & Payment endpoints
    if (pathname === '/api/send-email' || pathname.startsWith('/api/send-email/')) {
      return sendEmailHandler(req, res);
    }
    
    if (pathname === '/api/checkout' || pathname.startsWith('/api/checkout/')) {
      return checkoutHandler(req, res);
    }
    
    if (pathname === '/api/prices' || pathname.startsWith('/api/prices/')) {
      return pricesHandler(req, res);
    }
    
    if (pathname === '/api/me-plan' || pathname.startsWith('/api/me-plan/')) {
      return mePlanHandler(req, res);
    }
    
    if (pathname === '/api/stripe-webhook' || pathname.startsWith('/api/stripe-webhook/')) {
      return stripeWebhookHandler(req, res);
    }

    // Feedback endpoint
    if (pathname === '/api/feedback' || pathname.startsWith('/api/feedback/')) {
      return feedbackHandler(req, res);
    }

    // Owner endpoints
    if (pathname === '/api/owner/stats' || pathname.startsWith('/api/owner/stats/')) {
      return ownerStatsHandler(req, res);
    }
    
    if (pathname === '/api/owner/users' || pathname.startsWith('/api/owner/users/')) {
      return ownerUsersHandler(req, res);
    }
    
    if (pathname === '/api/check-access' || pathname.startsWith('/api/check-access/')) {
      return checkAccessHandler(req, res);
    }

    // Health check
    if (pathname === '/api/health' || pathname === '/api') {
      return res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        version: '2.0.0',
        routes: [
          '/api/ai',
          '/api/unified-claude',
          '/api/transcribe',
          '/api/vision',
          '/api/image-generate',
          '/api/github-oauth',
          '/api/send-email',
          '/api/checkout',
          '/api/prices',
          '/api/me-plan',
          '/api/stripe-webhook',
          '/api/feedback',
          '/api/owner/stats',
          '/api/owner/users',
          '/api/check-access'
        ]
      });
    }

    // 404 - Route not found
    return res.status(404).json({
      error: 'Not Found',
      message: `No handler for ${pathname}`,
      availableRoutes: [
        '/api/ai',
        '/api/unified-claude',
        '/api/transcribe',
        '/api/vision',
        '/api/image-generate',
        '/api/github-oauth',
        '/api/send-email',
        '/api/checkout',
        '/api/prices',
        '/api/me-plan',
        '/api/stripe-webhook',
        '/api/feedback',
        '/api/owner/stats',
        '/api/owner/users',
        '/api/check-access'
      ]
    });

  } catch (error) {
    console.error('❌ Router error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: error.message,
      path: req.url
    });
  }
}

// Configure for Vercel
export const config = {
  api: {
    bodyParser: true,
    responseLimit: '10mb'
  }
};
