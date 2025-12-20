/**
 * 🌍 SISTEMA DE DETECÇÃO DE IDIOMA - KIZI GLOBAL
 * 
 * Detecta automaticamente o idioma baseado na localização do usuário:
 * - Brasil → Português Brasileiro
 * - Portugal → Português Europeu
 * - EUA/UK/Austrália → Inglês
 * - Espanha/México/Argentina → Espanhol
 * - França → Francês
 * - Alemanha → Alemão
 * - Itália → Italiano
 * - Japão → Japonês
 * - China → Chinês
 * - Outros → Inglês (padrão internacional)
 */

// Mapeamento de países para idiomas
const COUNTRY_LANGUAGE_MAP = {
  // Português
  'BR': { code: 'pt-BR', name: 'Português Brasileiro', instruction: 'Responda em Português Brasileiro.' },
  'PT': { code: 'pt-PT', name: 'Português Europeu', instruction: 'Responda em Português Europeu.' },
  'AO': { code: 'pt-BR', name: 'Português', instruction: 'Responda em Português.' },
  'MZ': { code: 'pt-BR', name: 'Português', instruction: 'Responda em Português.' },
  
  // Inglês
  'US': { code: 'en-US', name: 'English (US)', instruction: 'Respond in American English.' },
  'GB': { code: 'en-GB', name: 'English (UK)', instruction: 'Respond in British English.' },
  'AU': { code: 'en-AU', name: 'English (AU)', instruction: 'Respond in Australian English.' },
  'CA': { code: 'en-CA', name: 'English (CA)', instruction: 'Respond in Canadian English.' },
  'NZ': { code: 'en-NZ', name: 'English (NZ)', instruction: 'Respond in New Zealand English.' },
  'IE': { code: 'en-IE', name: 'English (IE)', instruction: 'Respond in English.' },
  
  // Espanhol
  'ES': { code: 'es-ES', name: 'Español (España)', instruction: 'Responde en Español de España.' },
  'MX': { code: 'es-MX', name: 'Español (México)', instruction: 'Responde en Español de México.' },
  'AR': { code: 'es-AR', name: 'Español (Argentina)', instruction: 'Responde en Español de Argentina.' },
  'CO': { code: 'es-CO', name: 'Español (Colombia)', instruction: 'Responde en Español de Colombia.' },
  'CL': { code: 'es-CL', name: 'Español (Chile)', instruction: 'Responde en Español de Chile.' },
  'PE': { code: 'es-PE', name: 'Español (Perú)', instruction: 'Responde en Español de Perú.' },
  
  // Francês
  'FR': { code: 'fr-FR', name: 'Français', instruction: 'Répondez en Français.' },
  'BE': { code: 'fr-BE', name: 'Français (Belgique)', instruction: 'Répondez en Français.' },
  'CH': { code: 'fr-CH', name: 'Français (Suisse)', instruction: 'Répondez en Français.' },
  
  // Alemão
  'DE': { code: 'de-DE', name: 'Deutsch', instruction: 'Antworten Sie auf Deutsch.' },
  'AT': { code: 'de-AT', name: 'Deutsch (Österreich)', instruction: 'Antworten Sie auf Deutsch.' },
  
  // Italiano
  'IT': { code: 'it-IT', name: 'Italiano', instruction: 'Rispondi in Italiano.' },
  
  // Japonês
  'JP': { code: 'ja-JP', name: '日本語', instruction: '日本語で回答してください。' },
  
  // Chinês
  'CN': { code: 'zh-CN', name: '简体中文', instruction: '请用简体中文回答。' },
  'TW': { code: 'zh-TW', name: '繁體中文', instruction: '請用繁體中文回答。' },
  'HK': { code: 'zh-HK', name: '繁體中文 (香港)', instruction: '請用繁體中文回答。' },
  
  // Coreano
  'KR': { code: 'ko-KR', name: '한국어', instruction: '한국어로 답변해 주세요.' },
  
  // Russo
  'RU': { code: 'ru-RU', name: 'Русский', instruction: 'Отвечайте на русском языке.' },
  
  // Árabe
  'SA': { code: 'ar-SA', name: 'العربية', instruction: 'أجب باللغة العربية.' },
  'AE': { code: 'ar-AE', name: 'العربية', instruction: 'أجب باللغة العربية.' },
  
  // Hindi
  'IN': { code: 'hi-IN', name: 'हिन्दी', instruction: 'कृपया हिंदी में उत्तर दें।' },
  
  // Holandês
  'NL': { code: 'nl-NL', name: 'Nederlands', instruction: 'Antwoord in het Nederlands.' },
  
  // Polonês
  'PL': { code: 'pl-PL', name: 'Polski', instruction: 'Odpowiedz po polsku.' },
  
  // Turco
  'TR': { code: 'tr-TR', name: 'Türkçe', instruction: 'Türkçe cevap verin.' },
};

// Idioma padrão (inglês internacional)
const DEFAULT_LANGUAGE = { 
  code: 'en-US', 
  name: 'English', 
  instruction: 'Respond in English.' 
};

// Cache para evitar múltiplas requisições
let cachedLocation = null;
let cacheTimestamp = null;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 horas

/**
 * Detecta o país do usuário usando múltiplas fontes
 */
export async function detectUserCountry() {
  // Verificar cache
  if (cachedLocation && cacheTimestamp && (Date.now() - cacheTimestamp < CACHE_DURATION)) {
    return cachedLocation;
  }

  try {
    // Método 1: API de geolocalização gratuita
    const response = await fetch('https://ipapi.co/json/', {
      timeout: 5000
    });
    
    if (response.ok) {
      const data = await response.json();
      cachedLocation = data.country_code;
      cacheTimestamp = Date.now();
      
      // Salvar no localStorage para persistência
      try {
        localStorage.setItem('kizi_user_country', cachedLocation);
        localStorage.setItem('kizi_country_timestamp', cacheTimestamp.toString());
      } catch (e) {
        console.warn('Não foi possível salvar localização no localStorage');
      }
      
      return cachedLocation;
    }
  } catch (error) {
    console.warn('Erro ao detectar país via API:', error);
  }

  try {
    // Método 2: Fallback - usar timezone do navegador
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const countryFromTimezone = getCountryFromTimezone(timezone);
    if (countryFromTimezone) {
      cachedLocation = countryFromTimezone;
      cacheTimestamp = Date.now();
      return cachedLocation;
    }
  } catch (error) {
    console.warn('Erro ao detectar país via timezone:', error);
  }

  try {
    // Método 3: Fallback - usar idioma do navegador
    const browserLang = navigator.language || navigator.userLanguage;
    const countryFromLang = getCountryFromBrowserLanguage(browserLang);
    if (countryFromLang) {
      cachedLocation = countryFromLang;
      cacheTimestamp = Date.now();
      return cachedLocation;
    }
  } catch (error) {
    console.warn('Erro ao detectar país via idioma do navegador:', error);
  }

  // Método 4: Verificar localStorage (pode ter sido salvo antes)
  try {
    const savedCountry = localStorage.getItem('kizi_user_country');
    const savedTimestamp = localStorage.getItem('kizi_country_timestamp');
    
    if (savedCountry && savedTimestamp) {
      const timestamp = parseInt(savedTimestamp);
      if (Date.now() - timestamp < CACHE_DURATION) {
        cachedLocation = savedCountry;
        cacheTimestamp = timestamp;
        return cachedLocation;
      }
    }
  } catch (e) {
    console.warn('Não foi possível ler localização do localStorage');
  }

  // Padrão: Brasil (já que o sistema foi criado para o Brasil)
  return 'BR';
}

/**
 * Mapeia timezone para país
 */
function getCountryFromTimezone(timezone) {
  const timezoneMap = {
    'America/Sao_Paulo': 'BR',
    'America/Rio_Branco': 'BR',
    'America/Manaus': 'BR',
    'America/Belem': 'BR',
    'America/Fortaleza': 'BR',
    'America/Recife': 'BR',
    'America/Bahia': 'BR',
    'America/Cuiaba': 'BR',
    'America/Porto_Velho': 'BR',
    'America/Boa_Vista': 'BR',
    'America/Campo_Grande': 'BR',
    'Europe/Lisbon': 'PT',
    'America/New_York': 'US',
    'America/Los_Angeles': 'US',
    'America/Chicago': 'US',
    'America/Denver': 'US',
    'Europe/London': 'GB',
    'Europe/Paris': 'FR',
    'Europe/Berlin': 'DE',
    'Europe/Madrid': 'ES',
    'Europe/Rome': 'IT',
    'Asia/Tokyo': 'JP',
    'Asia/Shanghai': 'CN',
    'Asia/Seoul': 'KR',
    'Australia/Sydney': 'AU',
    'America/Mexico_City': 'MX',
    'America/Buenos_Aires': 'AR',
    'America/Bogota': 'CO',
    'America/Santiago': 'CL',
    'America/Lima': 'PE',
  };
  
  return timezoneMap[timezone] || null;
}

/**
 * Mapeia idioma do navegador para país
 */
function getCountryFromBrowserLanguage(lang) {
  if (!lang) return null;
  
  const langMap = {
    'pt-BR': 'BR',
    'pt': 'BR',
    'pt-PT': 'PT',
    'en-US': 'US',
    'en': 'US',
    'en-GB': 'GB',
    'es-ES': 'ES',
    'es': 'ES',
    'es-MX': 'MX',
    'es-AR': 'AR',
    'fr-FR': 'FR',
    'fr': 'FR',
    'de-DE': 'DE',
    'de': 'DE',
    'it-IT': 'IT',
    'it': 'IT',
    'ja-JP': 'JP',
    'ja': 'JP',
    'zh-CN': 'CN',
    'zh': 'CN',
    'zh-TW': 'TW',
    'ko-KR': 'KR',
    'ko': 'KR',
  };
  
  return langMap[lang] || langMap[lang.split('-')[0]] || null;
}

/**
 * Obtém as configurações de idioma para um país
 */
export function getLanguageConfig(countryCode) {
  return COUNTRY_LANGUAGE_MAP[countryCode] || DEFAULT_LANGUAGE;
}

/**
 * Obtém a instrução de idioma para o prompt da IA
 */
export async function getLanguageInstruction() {
  const country = await detectUserCountry();
  const config = getLanguageConfig(country);
  return config.instruction;
}

/**
 * Obtém o código do idioma atual
 */
export async function getCurrentLanguageCode() {
  const country = await detectUserCountry();
  const config = getLanguageConfig(country);
  return config.code;
}

/**
 * Obtém o nome do idioma atual
 */
export async function getCurrentLanguageName() {
  const country = await detectUserCountry();
  const config = getLanguageConfig(country);
  return config.name;
}

/**
 * Força um idioma específico (para configurações manuais)
 */
export function setManualLanguage(countryCode) {
  cachedLocation = countryCode;
  cacheTimestamp = Date.now();
  
  try {
    localStorage.setItem('kizi_user_country', countryCode);
    localStorage.setItem('kizi_country_timestamp', cacheTimestamp.toString());
    localStorage.setItem('kizi_manual_language', 'true');
  } catch (e) {
    console.warn('Não foi possível salvar idioma manual');
  }
}

/**
 * Verifica se o idioma foi definido manualmente
 */
export function isManualLanguage() {
  try {
    return localStorage.getItem('kizi_manual_language') === 'true';
  } catch (e) {
    return false;
  }
}

/**
 * Reseta para detecção automática
 */
export function resetToAutoDetect() {
  cachedLocation = null;
  cacheTimestamp = null;
  
  try {
    localStorage.removeItem('kizi_user_country');
    localStorage.removeItem('kizi_country_timestamp');
    localStorage.removeItem('kizi_manual_language');
  } catch (e) {
    console.warn('Não foi possível resetar configurações de idioma');
  }
}

/**
 * Lista todos os idiomas disponíveis
 */
export function getAvailableLanguages() {
  const languages = {};
  
  Object.entries(COUNTRY_LANGUAGE_MAP).forEach(([country, config]) => {
    if (!languages[config.code]) {
      languages[config.code] = {
        code: config.code,
        name: config.name,
        countries: []
      };
    }
    languages[config.code].countries.push(country);
  });
  
  return Object.values(languages);
}

export default {
  detectUserCountry,
  getLanguageConfig,
  getLanguageInstruction,
  getCurrentLanguageCode,
  getCurrentLanguageName,
  setManualLanguage,
  isManualLanguage,
  resetToAutoDetect,
  getAvailableLanguages,
  COUNTRY_LANGUAGE_MAP,
  DEFAULT_LANGUAGE
};
