// src/config/fairUse.test.js
import { plans, getAIModel, estimateMessageCost } from './fairUse.js';

describe('fairUse - AI Tier System', () => {
  describe('plans', () => {
    test('should have ultra plan with correct properties', () => {
      expect(plans.ultra).toBeDefined();
      expect(plans.ultra.id).toBe('ultra');
      expect(plans.ultra.name).toBe('Ultra');
      expect(plans.ultra.price).toBe(150);
      expect(plans.ultra.limits.messagesPerDay).toBe(800);
      expect(plans.ultra.limits.features.ultraAIStack).toBe(true);
    });

    test('should have dev plan with correct properties', () => {
      expect(plans.dev).toBeDefined();
      expect(plans.dev.id).toBe('dev');
      expect(plans.dev.name).toBe('Dev');
      expect(plans.dev.price).toBe(200);
      expect(plans.dev.limits.messagesPerDay).toBe(1000);
      expect(plans.dev.limits.features.devAIStack).toBe(true);
    });
  });

  describe('getAIModel', () => {
    test('should return gemini-2.0-flash for basic plan', () => {
      expect(getAIModel('basic')).toBe('gemini-2.0-flash');
    });

    test('should return gemini-2.0-flash for intermediate plan', () => {
      expect(getAIModel('intermediate')).toBe('gemini-2.0-flash');
    });

    test('should return gemini-1.5-pro for premium plan', () => {
      expect(getAIModel('premium')).toBe('gemini-1.5-pro');
    });

    test('should return gemini-2.0-flash for ultra plan (default mode)', () => {
      expect(getAIModel('ultra')).toBe('gemini-2.0-flash');
    });

    test('should return groq-llama-70b for ultra plan (turbo mode)', () => {
      expect(getAIModel('ultra', 'turbo')).toBe('groq-llama-70b');
    });

    test('should return claude-3.5-sonnet for ultra plan (fallback mode)', () => {
      expect(getAIModel('ultra', 'fallback')).toBe('claude-3.5-sonnet');
    });

    test('should return gemini-1.5-pro for ultra plan (advanced mode)', () => {
      expect(getAIModel('ultra', 'advanced')).toBe('gemini-1.5-pro');
    });

    test('should return gemini-2.0-flash for dev plan (default mode)', () => {
      expect(getAIModel('dev')).toBe('gemini-2.0-flash');
    });

    test('should return groq-llama-70b for dev plan (turbo mode)', () => {
      expect(getAIModel('dev', 'turbo')).toBe('groq-llama-70b');
    });

    test('should return claude-3.5-sonnet for dev plan (fallback mode)', () => {
      expect(getAIModel('dev', 'fallback')).toBe('claude-3.5-sonnet');
    });

    test('should return gemini-1.5-pro for dev plan (advanced mode)', () => {
      expect(getAIModel('dev', 'advanced')).toBe('gemini-1.5-pro');
    });

    test('should return gemini-2.0-flash for free plan', () => {
      expect(getAIModel('free')).toBe('gemini-2.0-flash');
    });

    test('should return gemini-2.0-flash for undefined plan', () => {
      expect(getAIModel()).toBe('gemini-2.0-flash');
    });
  });

  describe('estimateMessageCost', () => {
    test('should calculate cost for basic plan with gemini-2.0-flash', () => {
      const result = estimateMessageCost('basic', 1000);
      expect(result.model).toBe('gemini-2.0-flash');
      expect(result.tokens).toBe(1000);
      expect(result.costUSD).toBeCloseTo(0.000075, 6);
    });

    test('should calculate cost for premium plan with gemini-1.5-pro', () => {
      const result = estimateMessageCost('premium', 1000);
      expect(result.model).toBe('gemini-1.5-pro');
      expect(result.tokens).toBe(1000);
      expect(result.costUSD).toBeCloseTo(0.0025, 6);
    });

    test('should calculate cost for ultra plan with turbo mode', () => {
      const result = estimateMessageCost('ultra', 1000, 'turbo');
      expect(result.model).toBe('groq-llama-70b');
      expect(result.tokens).toBe(1000);
      expect(result.costUSD).toBeCloseTo(0.0008, 6);
    });

    test('should calculate cost for dev plan with fallback mode', () => {
      const result = estimateMessageCost('dev', 1000, 'fallback');
      expect(result.model).toBe('claude-3.5-sonnet');
      expect(result.tokens).toBe(1000);
      expect(result.costUSD).toBeCloseTo(0.003, 6);
    });
  });
});
