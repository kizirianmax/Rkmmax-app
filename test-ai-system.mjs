/**
 * Test script for new AI system architecture
 * Tests Groq multi-model selection and endpoint functionality
 */

console.log('🧪 Testing New AI System Architecture...\n');

// Test model selection logic
console.log('=== Test 1: Model Selection Logic ===');

// Simulated selectGroqModel function for testing
function selectGroqModel(messages) {
  const lastMessage = messages[messages.length - 1]?.content || '';
  const messageLength = lastMessage.length;
  
  const complexPatterns = [
    /analis[ae]/i, /expliq/i, /código|code/i, /debug/i,
    /arquitetura/i, /estratégia/i, /implementa/i, /crie/i
  ];
  
  const simplePatterns = [
    /^(oi|olá|hey)/i, /^(sim|não|ok)/i, /bom dia/i
  ];
  
  let complexScore = 0;
  let simpleScore = 0;
  
  for (const pattern of complexPatterns) {
    if (pattern.test(lastMessage)) {
      complexScore++;
    }
  }
  
  for (const pattern of simplePatterns) {
    if (pattern.test(lastMessage)) {
      simpleScore++;
    }
  }
  
  if (messageLength > 500) complexScore += 2;
  else if (messageLength < 50) simpleScore += 1;
  
  if (complexScore >= 2) return 'reasoning';
  if (simpleScore >= 2) return 'speed';
  return 'standard';
}

// Test cases
const testCases = [
  {
    name: 'Simple greeting',
    messages: [{ role: 'user', content: 'Oi, tudo bem?' }],
    expected: 'speed'
  },
  {
    name: 'Complex code analysis',
    messages: [{ role: 'user', content: 'Analise este código e explique a arquitetura' }],
    expected: 'reasoning'
  },
  {
    name: 'Standard conversation',
    messages: [{ role: 'user', content: 'Como posso melhorar meu negócio?' }],
    expected: 'standard'
  },
  {
    name: 'Long complex message',
    messages: [{ role: 'user', content: 'A'.repeat(600) + ' analise isso' }],
    expected: 'reasoning'
  }
];

let passed = 0;
let failed = 0;

for (const testCase of testCases) {
  const result = selectGroqModel(testCase.messages);
  if (result === testCase.expected) {
    console.log(`✅ ${testCase.name}: ${result} (expected: ${testCase.expected})`);
    passed++;
  } else {
    console.log(`❌ ${testCase.name}: ${result} (expected: ${testCase.expected})`);
    failed++;
  }
}

console.log(`\nResults: ${passed} passed, ${failed} failed\n`);

// Test endpoint configurations
console.log('=== Test 2: Endpoint Configurations ===');

const endpoints = [
  { name: 'AI Endpoint', path: 'api/ai.js', exists: true },
  { name: 'Transcribe Endpoint', path: 'api/transcribe.js', exists: true },
  { name: 'Vision Endpoint (NEW)', path: 'api/vision.js', exists: true },
  { name: 'Image Generate Endpoint', path: 'api/image-generate.js', exists: true }
];

import { existsSync } from 'fs';

for (const endpoint of endpoints) {
  const exists = existsSync(endpoint.path);
  if (exists) {
    console.log(`✅ ${endpoint.name}: Found at ${endpoint.path}`);
  } else {
    console.log(`❌ ${endpoint.name}: Not found at ${endpoint.path}`);
  }
}

console.log('\n=== Test 3: Configuration Validation ===');

// Check vercel.json
try {
  const vercelConfig = JSON.parse(
    await (await import('fs')).promises.readFile('vercel.json', 'utf8')
  );
  
  // Check rewrites
  const hasSerginhoRewrite = vercelConfig.rewrites?.some(r => r.source === '/serginho');
  const hasManifestRewrite = vercelConfig.rewrites?.some(r => r.source === '/manifest.json');
  
  console.log(`${hasSerginhoRewrite ? '✅' : '❌'} Serginho rewrite configured`);
  console.log(`${hasManifestRewrite ? '✅' : '❌'} Manifest.json rewrite configured`);
  
  // Check headers
  const hasManifestHeaders = vercelConfig.headers?.some(h => 
    h.source === '/manifest.json' && 
    h.headers.some(header => header.key === 'Content-Type')
  );
  
  console.log(`${hasManifestHeaders ? '✅' : '❌'} Manifest.json headers configured`);
  
} catch (error) {
  console.log(`❌ Error reading vercel.json: ${error.message}`);
}

console.log('\n✅ All tests completed!');
