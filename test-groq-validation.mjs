/**
 * Test script for Groq API validation
 * Tests the validateGroqApiKey and validatePromptSize functions
 */

import { validateGroqApiKey, validatePromptSize } from './src/utils/groqValidation.js';

console.log('🧪 Testing Groq API Validation...\n');

// Test 1: Missing API key
console.log('Test 1: Missing API key');
try {
  validateGroqApiKey('');
  console.log('❌ FAILED: Should have thrown error for missing key');
} catch (error) {
  console.log('✅ PASSED: Correctly caught missing key error');
  console.log('   Error message:', error.message.split('\n')[0]);
}

// Test 2: Invalid API key format (doesn't start with gsk_)
console.log('\nTest 2: Invalid API key format');
try {
  validateGroqApiKey('invalid_key_123');
  console.log('❌ FAILED: Should have thrown error for invalid format');
} catch (error) {
  console.log('✅ PASSED: Correctly caught invalid format error');
  console.log('   Error message:', error.message.split('\n')[0]);
}

// Test 3: Too short API key
console.log('\nTest 3: Too short API key');
try {
  validateGroqApiKey('gsk_short');
  console.log('❌ FAILED: Should have thrown error for short key');
} catch (error) {
  console.log('✅ PASSED: Correctly caught short key error');
  console.log('   Error message:', error.message.split('\n')[0]);
}

// Test 4: Valid API key
console.log('\nTest 4: Valid API key format');
try {
  const result = validateGroqApiKey('gsk_' + 'x'.repeat(50));
  console.log('✅ PASSED: Valid key accepted');
  console.log('   Result:', result);
} catch (error) {
  console.log('❌ FAILED: Should have accepted valid key');
  console.log('   Error:', error.message);
}

// Test 5: Prompt size validation - short prompt
console.log('\nTest 5: Short prompt (should not truncate)');
const shortPrompt = 'This is a short prompt';
const result1 = validatePromptSize(shortPrompt, 2000);
if (result1 === shortPrompt) {
  console.log('✅ PASSED: Short prompt not truncated');
} else {
  console.log('❌ FAILED: Short prompt should not be truncated');
}

// Test 6: Prompt size validation - long prompt
console.log('\nTest 6: Long prompt (should truncate)');
const longPrompt = 'x'.repeat(2500);
const result2 = validatePromptSize(longPrompt, 2000);
if (result2.length < longPrompt.length && result2.includes('prompt truncado para otimização')) {
  console.log('✅ PASSED: Long prompt truncated correctly');
  console.log('   Original length:', longPrompt.length);
  console.log('   Truncated length:', result2.length);
} else {
  console.log('❌ FAILED: Long prompt should be truncated');
}

// Test 7: Empty prompt
console.log('\nTest 7: Empty prompt');
const result3 = validatePromptSize('');
if (result3 === '') {
  console.log('✅ PASSED: Empty prompt handled correctly');
} else {
  console.log('❌ FAILED: Empty prompt should return empty string');
}

console.log('\n✅ All validation tests completed!');
