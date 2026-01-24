# 🚀 Vercel Deployment Setup Guide

Complete guide for deploying RKMMAX to Vercel with proper authentication configuration.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Variables Configuration](#environment-variables-configuration)
3. [Step-by-Step Deployment](#step-by-step-deployment)
4. [AI Providers Setup](#ai-providers-setup)
5. [Testing Your Deployment](#testing-your-deployment)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before deploying, ensure you have:

- [ ] Vercel account (free tier is sufficient)
- [ ] GitHub repository connected to Vercel
- [ ] At least ONE AI provider API key (Claude, Google AI, or Groq)
- [ ] Supabase project configured
- [ ] Stripe account (if using payments)

---

## Environment Variables Configuration

### 🔑 Required Variables

These are the **minimum required** environment variables for the application to work:

#### 1. AI Provider (At least ONE required)

**Option A: Anthropic Claude (Recommended)**
```
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
- Get from: https://console.anthropic.com/settings/keys
- Cost: ~$0.003/1k input tokens, ~$0.015/1k output tokens
- Best for: High-quality responses, vision tasks

**Option B: Google AI / Gemini**
```
GOOGLE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```
- Get from: https://aistudio.google.com/app/apikey
- Cost: Free tier available, then ~$0.00125/1k tokens
- Best for: Complex reasoning, cost-effective
- **Note:** Can also use `GEMINI_API_KEY` or `VERTEX_API_KEY` (aliases)

**Option C: Groq (Fastest)**
```
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
- Get from: https://console.groq.com/keys
- Cost: Very competitive, free tier available
- Best for: Speed-critical tasks

#### 2. Frontend Configuration

```
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
```

#### 3. Backend Configuration

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 💳 Optional: Payment Integration

If using Stripe payments:

```
STRIPE_SECRET_KEY_RKMMAX=sk_live_xxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxx
```

### 📧 Optional: Email Integration

If using Resend for emails:

```
RESEND_API_KEY=re_xxxxxxxxxxxx
FROM_EMAIL=noreply@yourdomain.com
OWNER_EMAIL=admin@yourdomain.com
```

### 🔧 Optional: Feedback System

If using GitHub issues for feedback:

```
GITHUB_TOKEN=ghp_xxxxxxxxxxxx
GITHUB_REPO=kizirianmax/Rkmmax-app
```

---

## Step-by-Step Deployment

### 1. Access Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Select your project or click "New Project"
3. Connect your GitHub repository

### 2. Configure Environment Variables

1. Navigate to: **Settings** → **Environment Variables**
2. Add each variable following this process:

   **For each variable:**
   - Click **"Add New"**
   - Enter **Variable Name** (e.g., `ANTHROPIC_API_KEY`)
   - Enter **Value** (your actual API key)
   - Select environments:
     - ✅ **Production** (always)
     - ✅ **Preview** (recommended for testing)
     - ✅ **Development** (optional, for local development with Vercel CLI)
   - Click **"Save"**

### 3. Deploy

After adding all required variables:

1. Go to **Deployments** tab
2. Click **"Redeploy"** on the latest deployment
3. Or push a new commit to trigger automatic deployment

---

## AI Providers Setup

### 🤖 Anthropic Claude Setup

**Why Claude?**
- Best reasoning capabilities
- Excellent vision/image analysis
- Reliable and consistent outputs

**Setup Steps:**

1. **Create Account**
   - Visit: https://console.anthropic.com/
   - Sign up with email

2. **Get API Key**
   - Go to: https://console.anthropic.com/settings/keys
   - Click "Create Key"
   - Copy the key (starts with `sk-ant-`)

3. **Set Billing** (Required after free trial)
   - Go to: https://console.anthropic.com/settings/billing
   - Add payment method
   - Set spending limits

4. **Add to Vercel**
   ```
   Variable: ANTHROPIC_API_KEY
   Value: sk-ant-api03-xxxxxxxxxxxx
   Environments: Production, Preview
   ```

### 🔍 Google AI (Gemini) Setup

**Why Google AI?**
- Cost-effective
- Free tier available
- Latest Gemini 2.5 Pro model
- Good for general tasks

**Setup Steps:**

1. **Get API Key**
   - Visit: https://aistudio.google.com/app/apikey
   - Sign in with Google account
   - Click "Create API Key"
   - Select or create a Google Cloud project
   - Copy the key (starts with `AIza`)

2. **Configure Quotas** (Optional)
   - Visit Google Cloud Console
   - Enable "Generative Language API"
   - Set quotas and limits

3. **Add to Vercel**
   ```
   Variable: GOOGLE_API_KEY
   Value: AIzaSyXXXXXXXXXXXXXXXXXX
   Environments: Production, Preview
   ```

   **Alternative names (all work the same):**
   - `GEMINI_API_KEY`
   - `VERTEX_API_KEY`

### ⚡ Groq Setup

**Why Groq?**
- Extremely fast inference
- Cost-effective
- Good for high-volume tasks

**Setup Steps:**

1. **Create Account**
   - Visit: https://console.groq.com/
   - Sign up with email or GitHub

2. **Get API Key**
   - Go to: https://console.groq.com/keys
   - Click "Create API Key"
   - Name it (e.g., "RKMMAX Production")
   - Copy the key (starts with `gsk_`)

3. **Add to Vercel**
   ```
   Variable: GROQ_API_KEY
   Value: gsk_xxxxxxxxxxxx
   Environments: Production, Preview
   ```

---

## Testing Your Deployment

### 1. Check Build Status

After deployment:
1. Go to **Deployments** tab
2. Wait for "Building" → "Ready"
3. If build fails, check the logs

### 2. Test AI Endpoints

**Test Claude:**
```bash
curl -X POST https://your-app.vercel.app/api/unified-claude \
  -H "Content-Type: application/json" \
  -d '{
    "tipo": "texto",
    "requisicao": "Hello, are you working?"
  }'
```

**Test Main AI Endpoint:**
```bash
curl -X POST https://your-app.vercel.app/api/ai \
  -H "Content-Type: application/json" \
  -d '{
    "type": "genius",
    "messages": [{"role": "user", "content": "Test message"}]
  }'
```

### 3. Check Environment Variables

1. In Vercel Dashboard, go to **Settings** → **Environment Variables**
2. Verify all required variables are present
3. Check that sensitive values are masked (showing `***`)

### 4. Monitor Logs

1. Go to **Deployments** → Click on your deployment
2. View **Function Logs** tab
3. Look for:
   - ✅ "RKMMAX + Claude 3.5 Sonnet inicializado"
   - ✅ Successful API calls
   - ❌ Any error messages about missing keys

---

## Troubleshooting

### Error: "ANTHROPIC_API_KEY não configurada"

**Solution:**
1. Go to Vercel Dashboard → Settings → Environment Variables
2. Verify `ANTHROPIC_API_KEY` is set
3. Ensure it's enabled for "Production" environment
4. Redeploy the application

### Error: "No AI providers configured"

**Solution:**
This means none of the AI provider keys are set. You need at least ONE:
- `ANTHROPIC_API_KEY` (Claude)
- `GOOGLE_API_KEY` or `GEMINI_API_KEY` (Google AI)
- `GROQ_API_KEY` (Groq)

### Error: "Invalid API Key"

**Possible causes:**
1. **Key copied incorrectly** - Check for extra spaces or missing characters
2. **Key expired or revoked** - Generate a new key
3. **Billing not configured** - Some providers require active billing

**Solution:**
1. Go to provider's console
2. Verify the key is active
3. Generate a new key if needed
4. Update in Vercel
5. Redeploy

### Error: "All AI providers failed"

**This means:**
Multiple API keys are set, but all are failing.

**Solution:**
1. Check each provider's status page
2. Verify billing/credits are available
3. Test each key individually with curl
4. Check API rate limits
5. Review function logs for specific errors

### Build Failures

**Common causes:**
1. **Missing dependencies** - Check `package.json`
2. **Syntax errors** - Check build logs
3. **Environment-specific code** - Ensure code works in Node.js serverless environment

**Solution:**
1. Check build logs in Vercel
2. Test build locally: `npm run build`
3. Fix any errors shown
4. Push changes and redeploy

### Slow Response Times

**Possible causes:**
1. **Cold starts** - First request after idle period
2. **Large AI models** - Some models are slower
3. **API provider issues** - Check provider status

**Solution:**
1. Use Groq for speed-critical tasks
2. Implement response caching
3. Monitor with Vercel Analytics

---

## Security Best Practices

### ✅ DO:
- Use different API keys for development and production
- Set spending limits on all AI providers
- Rotate keys regularly (every 90 days recommended)
- Monitor usage and costs in provider dashboards
- Enable Vercel's security headers (already configured)
- Use Vercel's Preview deployments for testing

### ❌ DON'T:
- Never commit `.env.local` or `.env` files
- Never share API keys in public repositories
- Never use production keys in development
- Don't ignore billing alerts from providers

---

## Environment Variables Reference

Quick copy-paste template for Vercel:

```env
# AI Providers (at least one required)
ANTHROPIC_API_KEY=sk-ant-your-key
GOOGLE_API_KEY=AIza-your-key
GROQ_API_KEY=gsk-your-key

# Supabase (required)
REACT_APP_SUPABASE_URL=https://project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-key
SUPABASE_URL=https://project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-key

# Stripe (optional)
STRIPE_SECRET_KEY_RKMMAX=sk_live_key
STRIPE_WEBHOOK_SECRET=whsec_key

# Email (optional)
RESEND_API_KEY=re_key
FROM_EMAIL=noreply@domain.com
OWNER_EMAIL=admin@domain.com

# GitHub (optional)
GITHUB_TOKEN=ghp_token
GITHUB_REPO=username/repo
```

---

## Additional Resources

- **Vercel Documentation:** https://vercel.com/docs
- **Anthropic Documentation:** https://docs.anthropic.com/
- **Google AI Documentation:** https://ai.google.dev/docs
- **Groq Documentation:** https://console.groq.com/docs
- **Supabase Documentation:** https://supabase.com/docs
- **Project .env.template:** See `.env.template` in repository root

---

## Support

If you encounter issues not covered here:

1. Check the application logs in Vercel
2. Review provider status pages
3. Consult the `.env.template` file
4. Open an issue in the GitHub repository

---

**Last Updated:** 2026-01-24

**Version:** 1.0.0
