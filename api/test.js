/**
 * TEST ENDPOINT
 * Para diagnosticar problemas
 */

async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    console.log('🧪 TEST ENDPOINT CHAMADO');
    console.log('Método:', req.method);
    console.log('URL:', req.url);
    console.log('Body:', req.body);

    // Teste 1: Verificar variáveis de ambiente
    const hasGeminiKey = !!process.env.GEMINI_API_KEY;
    const hasGithubToken = !!process.env.GITHUB_TOKEN;

    console.log('✅ GEMINI_API_KEY:', hasGeminiKey ? 'CONFIGURADO' : 'NÃO CONFIGURADO');
    console.log('✅ GITHUB_TOKEN:', hasGithubToken ? 'CONFIGURADO' : 'NÃO CONFIGURADO');

    // Teste 2: Testar Gemini API
    let geminiTest = { success: false, error: 'Não testado' };
    if (hasGeminiKey) {
      try {
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + process.env.GEMINI_API_KEY, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: 'Teste simples: responda com "OK"' }]
            }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 100,
            },
          }),
        });

        if (response.ok) {
          const data = await response.json();
          geminiTest = {
            success: true,
            response: data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sem resposta',
          };
        } else {
          geminiTest = {
            success: false,
            error: `HTTP ${response.status}`,
            body: await response.text(),
          };
        }
      } catch (error) {
        geminiTest = {
          success: false,
          error: error.message,
        };
      }
    }

    console.log('🤖 Gemini Test:', geminiTest);

    // Responder
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: {
        geminiKey: hasGeminiKey,
        githubToken: hasGithubToken,
      },
      tests: {
        gemini: geminiTest,
      },
      message: 'Sistema de teste funcionando!',
    });
  } catch (error) {
    console.error('❌ Erro no teste:', error);
    res.status(500).json({
      error: 'Erro ao executar teste',
      message: error.message,
      stack: error.stack,
    });
  }
}

module.exports = handler;

