/**
 * GROQ API KEY VALIDATION UTILITY
 * Validates Groq API keys before making requests
 * Provides detailed error messages for debugging
 */

/**
 * Valida API key do Groq
 * @param {string} apiKey - The Groq API key to validate
 * @throws {Error} If API key is invalid or missing
 * @returns {boolean} true if valid
 */
export function validateGroqApiKey(apiKey) {
  if (!apiKey) {
    throw new Error(
      '❌ GROQ_API_KEY não configurada!\n' +
      'Configure a variável de ambiente no Vercel:\n' +
      'GROQ_API_KEY=gsk_...\n' +
      'Obtenha sua chave em: https://console.groq.com/keys'
    );
  }
  
  if (!apiKey.startsWith('gsk_')) {
    throw new Error(
      '❌ GROQ_API_KEY inválida!\n' +
      'A chave deve começar com "gsk_".\n' +
      'Chave fornecida: ' + apiKey.substring(0, 8) + '...'
    );
  }
  
  if (apiKey.length < 20) {
    throw new Error(
      '❌ GROQ_API_KEY parece incompleta!\n' +
      'Comprimento esperado: 50+ caracteres\n' +
      'Comprimento atual: ' + apiKey.length
    );
  }
  
  return true;
}

// Default maximum prompt length
const DEFAULT_MAX_PROMPT_LENGTH = 2000;

/**
 * Validate prompt size and optionally truncate if too long
 * @param {string} prompt - The prompt to validate
 * @param {number} maxLength - Maximum allowed length (default: 2000)
 * @returns {string} The validated/truncated prompt
 */
export function validatePromptSize(prompt, maxLength = DEFAULT_MAX_PROMPT_LENGTH) {
  if (!prompt) {
    return '';
  }
  
  if (prompt.length > maxLength) {
    console.warn(`⚠️ System prompt muito longo: ${prompt.length} caracteres (máximo recomendado: ${maxLength})`);
    console.warn('Considere reduzir o tamanho para melhor performance');
    return prompt.substring(0, maxLength) + '\n\n[... prompt truncado para otimização ...]';
  }
  
  return prompt;
}

export default {
  validateGroqApiKey,
  validatePromptSize,
};
