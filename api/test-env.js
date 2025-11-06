/**
 * Test endpoint to verify environment variables
 */
async function handler(req, res) {
  return res.status(200).json({
    GEMINI_API_KEY: process.env.GEMINI_API_KEY ? 'SET' : 'NOT SET',
    GEMINI_API_KEY_LENGTH: process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.length : 0,
    GEMINI_API_KEY_FIRST_10: process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.substring(0, 10) : 'N/A',
    NODE_ENV: process.env.NODE_ENV,
    ALL_KEYS: Object.keys(process.env).filter(k => k.includes('GEMINI') || k.includes('API')).join(', ')
  });
}

module.exports = handler;

