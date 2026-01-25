/**
 * Tests for Serginho Layer 3 and Layer 4 Integration
 */

const Serginho = require('../Serginho');

// Mock AutomationEngine
jest.mock('../../../automation/AutomationEngine', () => {
  return jest.fn().mockImplementation(() => ({
    initializeGitHub: jest.fn(),
    executeAutomation: jest.fn().mockResolvedValue({
      status: 'SUCCESS',
      steps: [
        { phase: 'ANALYSIS', status: 'COMPLETED' },
        { phase: 'SPECIALIST_SELECTION', status: 'COMPLETED', specialist: 'didak' },
        { phase: 'CODE_GENERATION', status: 'COMPLETED', filesGenerated: 2 },
        { phase: 'SECURITY_VALIDATION', status: 'COMPLETED' },
        { phase: 'GIT_COMMIT', status: 'COMPLETED', commitHash: 'abc123' },
      ],
      output: {
        commit: { sha: 'abc123def456' },
      },
    }),
  }));
});

// Mock WebBrowserService
jest.mock('../../../services/WebBrowserService', () => null);

describe('Serginho - Layer 3 and Layer 4 Integration', () => {
  let serginho;

  beforeEach(() => {
    serginho = new Serginho();
  });

  describe('_detectIntent - Layer 3 (Automation)', () => {
    test('detects AUTOMATION intent for "automate commit"', () => {
      const intent = serginho._detectIntent('automate commit');
      expect(intent.type).toBe('AUTOMATION');
      expect(intent.confidence).toBe(0.9);
    });

    test('detects AUTOMATION intent for "create PR"', () => {
      const intent = serginho._detectIntent('create PR automatically');
      expect(intent.type).toBe('AUTOMATION');
    });

    test('detects AUTOMATION intent for "fix issue auto"', () => {
      const intent = serginho._detectIntent('fix issue automatically');
      expect(intent.type).toBe('AUTOMATION');
    });

    test('detects AUTOMATION intent for "auto deploy"', () => {
      const intent = serginho._detectIntent('auto deploy the changes');
      expect(intent.type).toBe('AUTOMATION');
    });

    test('does not detect AUTOMATION for regular conversation', () => {
      const intent = serginho._detectIntent('hello, how are you?');
      expect(intent.type).not.toBe('AUTOMATION');
    });
  });

  describe('_handleAutomation - Layer 3', () => {
    test('handles automation request successfully', async () => {
      const prompt = 'automate commit and create PR';
      const context = {
        userId: 'user123',
        username: 'testuser',
        mode: 'OPTIMIZED',
      };

      const result = await serginho._handleAutomation(prompt, context);

      expect(result.status).toBe('SUCCESS');
      expect(result.source).toBe('AUTOMATION');
      expect(result.intent).toBe('AUTOMATION');
      expect(result.responseType).toBe('AUTOMATION_STATUS');
      expect(result.response).toContain('Layer 3: Automation');
      expect(result.response).toContain('Automation completed successfully');
    });

    test('includes automation result in response', async () => {
      const prompt = 'create automated PR';
      const context = { userId: 'user123' };

      const result = await serginho._handleAutomation(prompt, context);

      expect(result.automationResult).toBeDefined();
      expect(result.automationResult.status).toBe('SUCCESS');
      expect(result.automationResult.steps).toBeDefined();
    });
  });

  describe('_applyCompliance - Layer 4', () => {
    test('returns response as-is when no compliance needed', () => {
      const responseData = {
        status: 'SUCCESS',
        response: 'Test response',
      };
      const context = {};

      const result = serginho._applyCompliance(responseData, context);

      expect(result).toEqual(responseData);
      expect(result.complianceApplied).toBeUndefined();
    });

    test('applies compliance when formal context', () => {
      const responseData = {
        status: 'SUCCESS',
        response: 'Test response',
      };
      const context = { formal: true };

      const result = serginho._applyCompliance(responseData, context);

      expect(result.complianceApplied).toBe(true);
      expect(result.compliance).toBeDefined();
      expect(result.responseType).toBe('COMPLIANCE_CHECKED');
      expect(result.layer4).toBeDefined();
    });

    test('applies compliance when academic context', () => {
      const responseData = {
        status: 'SUCCESS',
        response: 'Test response',
      };
      const context = { academic: true };

      const result = serginho._applyCompliance(responseData, context);

      expect(result.complianceApplied).toBe(true);
      expect(result.response).toContain('[ABNT Formatted]');
    });

    test('applies compliance with formal tone', () => {
      const responseData = {
        status: 'SUCCESS',
        response: 'Test response',
      };
      const context = { tone: 'formal' };

      const result = serginho._applyCompliance(responseData, context);

      expect(result.complianceApplied).toBe(true);
    });
  });

  describe('_performComplianceChecks - Layer 4', () => {
    test('performs basic compliance checks', () => {
      const content = 'This is test content';
      const context = {};

      const compliance = serginho._performComplianceChecks(content, context);

      expect(compliance.overall).toBe('COMPLIANT');
      expect(compliance.abnt).toBeDefined();
      expect(compliance.legal).toBeDefined();
      expect(compliance.privacy).toBeDefined();
    });

    test('detects informal language in academic context', () => {
      const content = 'Tipo assim, né, isso é legal';
      const context = { academic: true };

      const compliance = serginho._performComplianceChecks(content, context);

      expect(compliance.abnt.status).toBe('WARNING');
      const informalCheck = compliance.abnt.checks.find(c => c.name === 'Academic Tone');
      expect(informalCheck).toBeDefined();
      expect(informalCheck.status).toBe('WARNING');
    });

    test('detects potential personal data', () => {
      const content = 'Contact me at user@example.com';
      const context = {};

      const compliance = serginho._performComplianceChecks(content, context);

      expect(compliance.privacy.status).toBe('WARNING');
      expect(compliance.overall).toBe('WARNING');
    });

    test('all checks pass for clean content', () => {
      const content = 'This is a professional response with proper formatting.';
      const context = {};

      const compliance = serginho._performComplianceChecks(content, context);

      expect(compliance.abnt.status).toBe('PASS');
      expect(compliance.legal.status).toBe('PASS');
      expect(compliance.privacy.status).toBe('PASS');
    });
  });

  describe('_applyABNTFormatting - Layer 4', () => {
    test('applies ABNT formatting', () => {
      const content = 'Test content\n\n\n\nwith multiple newlines';

      const formatted = serginho._applyABNTFormatting(content);

      expect(formatted).toContain('[ABNT Formatted]');
      expect(formatted).not.toContain('\n\n\n\n');
    });
  });

  describe('Integration - Full 4-Layer Flow', () => {
    test('processes automation request through all layers', async () => {
      const prompt = 'automate commit and push';
      const context = {
        userId: 'user123',
        formal: true,
      };

      const result = await serginho.process(prompt, context);

      // Layer 1: Orchestration
      expect(result.status).toBe('SUCCESS');
      expect(result.agent).toContain('serginho');

      // Layer 3: Automation
      expect(result.source).toBe('AUTOMATION');
      expect(result.responseType).toBe('COMPLIANCE_CHECKED');

      // Layer 4: Compliance
      expect(result.complianceApplied).toBe(true);
      expect(result.compliance).toBeDefined();
    });
  });
});
