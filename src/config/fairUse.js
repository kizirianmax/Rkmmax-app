// Sistema de Fair Use - Limites por Plano
// Garante uso sustentável e controle de custos

export const plans = {
  free: {
    id: 'free',
    name: 'Gratuito',
    price: 0,
    currency: 'BRL',
    limits: {
      messagesPerDay: 10,
      messagesPerMonth: 100,
      specialists: ['serginho', 'didak', 'edu'], // Apenas 3 especialistas
      maxTokensPerMessage: 1000,
      features: {
        studyLab: false,
        prioritySupport: false,
        advancedModels: false,
      },
    },
  },
  basic: {
    id: 'basic',
    name: 'Básico',
    price: 14.9,
    currency: 'BRL',
    limits: {
      messagesPerDay: 100,
      messagesPerMonth: 3000,
      specialists: 'all', // Todos os especialistas
      maxTokensPerMessage: 2000,
      features: {
        studyLab: true,
        prioritySupport: false,
        advancedModels: false,
      },
    },
  },
  intermediate: {
    id: 'intermediate',
    name: 'Intermediário',
    price: 50,
    currency: 'BRL',
    limits: {
      messagesPerDay: 300,
      messagesPerMonth: 9000,
      specialists: 'all',
      maxTokensPerMessage: 4000,
      features: {
        studyLab: true,
        prioritySupport: true,
        advancedModels: false,
      },
    },
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    price: 90,
    currency: 'BRL',
    limits: {
      messagesPerDay: 500,
      messagesPerMonth: 15000,
      specialists: 'all',
      maxTokensPerMessage: 8000,
      features: {
        studyLab: true,
        prioritySupport: true,
        advancedModels: true, // GPT-4.1 opcional
      },
    },
  },
  ultra: {
    id: 'ultra',
    name: 'Ultra',
    price: 150,
    currency: 'BRL',
    limits: {
      messagesPerDay: 800,
      messagesPerMonth: 24000,
      specialists: 'all',
      maxTokensPerMessage: 16000,
      features: {
        studyLab: true,
        prioritySupport: true,
        advancedModels: true,
        ultraAIStack: true, // Hybrid AI with Gemini + Claude + Groq
      },
    },
  },
  dev: {
    id: 'dev',
    name: 'Dev',
    price: 200,
    currency: 'BRL',
    limits: {
      messagesPerDay: 1000,
      messagesPerMonth: 30000,
      specialists: 'all',
      maxTokensPerMessage: 32000,
      features: {
        studyLab: true,
        prioritySupport: true,
        advancedModels: true,
        ultraAIStack: true,
        devAIStack: true, // Full Hybrid AI Stack
      },
    },
  },
};

// Verificar se usuário atingiu limite
export const checkLimit = (userPlan, usage) => {
  const plan = plans[userPlan] || plans.free;
  
  const dailyRemaining = plan.limits.messagesPerDay - (usage.messagesToday || 0);
  const monthlyRemaining = plan.limits.messagesPerMonth - (usage.messagesThisMonth || 0);
  
  return {
    canSendMessage: dailyRemaining > 0 && monthlyRemaining > 0,
    dailyRemaining,
    monthlyRemaining,
    dailyLimit: plan.limits.messagesPerDay,
    monthlyLimit: plan.limits.messagesPerMonth,
    softLimitReached: dailyRemaining < 10 || monthlyRemaining < 50,
  };
};

// Mensagens de aviso
export const getLimitMessage = (limitStatus) => {
  if (!limitStatus.canSendMessage) {
    if (limitStatus.dailyRemaining <= 0) {
      return {
        type: 'error',
        message: 'Limite diário atingido. Você poderá enviar novas mensagens amanhã ou fazer upgrade do plano.',
        action: 'upgrade',
      };
    }
    if (limitStatus.monthlyRemaining <= 0) {
      return {
        type: 'error',
        message: 'Limite mensal atingido. Faça upgrade para continuar usando.',
        action: 'upgrade',
      };
    }
  }
  
  if (limitStatus.softLimitReached) {
    if (limitStatus.dailyRemaining < 10) {
      return {
        type: 'warning',
        message: `Você tem apenas ${limitStatus.dailyRemaining} mensagens restantes hoje. Considere fazer upgrade.`,
        action: 'info',
      };
    }
    if (limitStatus.monthlyRemaining < 50) {
      return {
        type: 'warning',
        message: `Você tem apenas ${limitStatus.monthlyRemaining} mensagens restantes este mês. Considere fazer upgrade.`,
        action: 'info',
      };
    }
  }
  
  return null;
};

// Verificar se especialista está disponível no plano
export const canUseSpecialist = (userPlan, specialistId) => {
  const plan = plans[userPlan] || plans.free;
  
  if (plan.limits.specialists === 'all') {
    return true;
  }
  
  return plan.limits.specialists.includes(specialistId);
};

// Obter modelo de IA baseado no plano e modo
export const getAIModel = (userPlan, mode = 'standard') => {
  const plan = plans[userPlan] || plans.free;
  const planId = plan.id;
  
  // Dev Plan: Full Hybrid Stack
  if (planId === 'dev') {
    if (mode === 'turbo') return 'groq-llama-70b';
    if (mode === 'fallback') return 'claude-3.5-sonnet';
    if (mode === 'advanced') return 'gemini-1.5-pro';
    return 'gemini-2.0-flash'; // Default: Gemini 2.0 Flash
  }
  
  // Ultra Plan: Hybrid Stack (Gemini + Claude + Groq)
  if (planId === 'ultra') {
    if (mode === 'turbo') return 'groq-llama-70b';
    if (mode === 'fallback') return 'claude-3.5-sonnet';
    if (mode === 'advanced') return 'gemini-1.5-pro';
    return 'gemini-2.0-flash'; // Default: Gemini 2.0 Flash
  }
  
  // Premium Plan: Gemini 1.5 Pro
  if (planId === 'premium') {
    return 'gemini-1.5-pro';
  }
  
  // Intermediate Plan: Gemini 2.0 Flash
  if (planId === 'intermediate') {
    return 'gemini-2.0-flash';
  }
  
  // Basic Plan: Gemini 2.0 Flash
  if (planId === 'basic') {
    return 'gemini-2.0-flash';
  }
  
  // Free Plan: Gemini 2.0 Flash (default)
  return 'gemini-2.0-flash';
};

// Calcular custo estimado por mensagem
export const estimateMessageCost = (userPlan, tokens, mode = 'standard') => {
  const model = getAIModel(userPlan, mode);
  
  const pricing = {
    'gemini-2.0-flash': 0.000000075, // $0.075 per 1M tokens (= $0.000000075 per token)
    'gemini-1.5-pro': 0.0000025, // $2.50 per 1M tokens
    'claude-3.5-sonnet': 0.000003, // $3.00 per 1M tokens
    'groq-llama-70b': 0.0000008, // $0.80 per 1M tokens
    'gpt-4.1-mini': 0.0000008, // $0.80 per 1M tokens
  };
  
  const costPerToken = pricing[model] || pricing['gemini-2.0-flash'];
  const costUSD = tokens * costPerToken;
  const costBRL = costUSD * 5; // Conversão aproximada
  
  return {
    model,
    tokens,
    costUSD,
    costBRL,
  };
};

