const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyCIFewwXkuzVmUH1ycEnyVfb1WtSCZ';

async function testGemini3() {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-preview:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: "Diga 'olá' em uma palavra" }]
          }]
        })
      }
    );

    console.log('Status:', response.status);
    const data = await response.json();
    console.log('Response:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testGemini3();
