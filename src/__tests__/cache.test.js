/**
 * TESTES - IntelligentCache
 * Validação de cache, TTL, evicção e economia de API
 */

const IntelligentCache = require('../cache/IntelligentCache');

describe('IntelligentCache - Intelligent Caching', () => {
  let cache;

  beforeEach(() => {
    cache = new IntelligentCache({ maxMemory: 512 });
  });

  describe('Key Generation', () => {
    test('should generate consistent keys for same input', () => {
      const key1 = cache.generateKey('agent-1', 'What is AI?', {});
      const key2 = cache.generateKey('agent-1', 'What is AI?', {});

      expect(key1).toBe(key2);
    });

    test('should generate different keys for different agents', () => {
      const key1 = cache.generateKey('agent-1', 'What is AI?', {});
      const key2 = cache.generateKey('agent-2', 'What is AI?', {});

      expect(key1).not.toBe(key2);
    });

    test('should generate different keys for different prompts', () => {
      const key1 = cache.generateKey('agent-1', 'What is AI?', {});
      const key2 = cache.generateKey('agent-1', 'What is ML?', {});

      expect(key1).not.toBe(key2);
    });

    test('should be case-insensitive', () => {
      const key1 = cache.generateKey('agent-1', 'What is AI?', {});
      const key2 = cache.generateKey('agent-1', 'WHAT IS AI?', {});

      expect(key1).toBe(key2);
    });
  });

  describe('Cache Operations', () => {
    test('should store and retrieve values', () => {
      const key = 'test-key';
      const value = { response: 'Test response' };

      cache.set(key, value);
      const retrieved = cache.get(key);

      expect(retrieved).toEqual(value);
    });

    test('should return null for non-existent keys', () => {
      const retrieved = cache.get('non-existent-key');

      expect(retrieved).toBeNull();
    });

    test('should increment hit count on cache hit', () => {
      const key = 'test-key';
      cache.set(key, { response: 'Test' });

      cache.get(key);
      const stats = cache.getStats();

      expect(stats.hits).toBe(1);
    });

    test('should increment miss count on cache miss', () => {
      cache.get('non-existent-key');
      const stats = cache.getStats();

      expect(stats.misses).toBe(1);
    });
  });

  describe('TTL and Expiration', () => {
    test('should expire entries based on TTL', (done) => {
      const key = 'test-key';
      cache.ttlConfig['test-category'] = 0.1; // 100ms
      cache.set(key, { response: 'Test' }, 'test-category');

      setTimeout(() => {
        const retrieved = cache.get(key);
        expect(retrieved).toBeNull();
        done();
      }, 150);
    });

    test('should use correct TTL for different categories', () => {
      const key1 = 'key1';
      const key2 = 'key2';

      cache.set(key1, { response: 'Test1' }, 'specialist-response');
      cache.set(key2, { response: 'Test2' }, 'real-time-data');

      const entry1 = cache.cache.get(key1);
      const entry2 = cache.cache.get(key2);

      expect(entry1.ttl).toBeGreaterThan(entry2.ttl);
    });
  });

  describe('Memory Management', () => {
    test('should track memory usage', () => {
      const key = 'test-key';
      const value = { response: 'Test response' };

      cache.set(key, value);
      const stats = cache.getStats();

      expect(parseFloat(stats.memoryUsage)).toBeGreaterThan(0);
    });

    test('should evict items when memory limit is exceeded', () => {
      const smallCache = new IntelligentCache({ maxMemory: 0.01 }); // 10KB
      const largeValue = { response: 'x'.repeat(10000) };

      smallCache.set('key1', largeValue);
      smallCache.set('key2', largeValue);

      const stats = smallCache.getStats();
      expect(stats.evictions).toBeGreaterThan(0);
    });
  });

  describe('Eviction Policy', () => {
    test('should use LRU eviction policy', () => {
      const smallCache = new IntelligentCache({ maxMemory: 0.05 }); // 50KB

      smallCache.set('key1', { response: 'x'.repeat(5000) });
      smallCache.set('key2', { response: 'x'.repeat(5000) });

      // Access key1 to make it more recent
      smallCache.get('key1');

      // Add new item to trigger eviction
      smallCache.set('key3', { response: 'x'.repeat(5000) });

      // key2 should be evicted (least recently used)
      expect(smallCache.get('key2')).toBeNull();
    });

    test('should prioritize older entries for eviction', () => {
      const smallCache = new IntelligentCache({ maxMemory: 0.05 });

      smallCache.set('key1', { response: 'x'.repeat(5000) });

      // Wait a bit
      setTimeout(() => {
        smallCache.set('key2', { response: 'x'.repeat(5000) });
        smallCache.set('key3', { response: 'x'.repeat(5000) });

        // key1 should be evicted (oldest)
        expect(smallCache.get('key1')).toBeNull();
      }, 10);
    });
  });

  describe('Similarity Search', () => {
    test('should find similar keys', () => {
      const key1 = cache.generateKey('agent-1', 'What is artificial intelligence?', {});
      const key2 = cache.generateKey('agent-1', 'What is artificial intelligence', {});

      cache.set(key1, { response: 'AI is...' });

      // Get with similar key
      const retrieved = cache.get(key2, 0.8);

      expect(retrieved).not.toBeNull();
    });

    test('should respect similarity threshold', () => {
      const key1 = cache.generateKey('agent-1', 'What is AI?', {});
      const key2 = cache.generateKey('agent-1', 'What is ML?', {});

      cache.set(key1, { response: 'AI is...' });

      // Get with very different key and high threshold
      const retrieved = cache.get(key2, 0.99);

      expect(retrieved).toBeNull();
    });
  });

  describe('Statistics and Reporting', () => {
    test('should calculate hit rate correctly', () => {
      const key = 'test-key';
      cache.set(key, { response: 'Test' });

      cache.get(key); // hit
      cache.get(key); // hit
      cache.get('non-existent'); // miss

      const stats = cache.getStats();
      expect(stats.hitRate).toBe('66.67%');
    });

    test('should estimate API savings', () => {
      const key = 'test-key';
      cache.set(key, { response: 'Test' });

      for (let i = 0; i < 10; i++) {
        cache.get(key);
      }

      const stats = cache.getStats();
      expect(stats.estimatedSavings).toContain('$');
      expect(parseFloat(stats.estimatedSavings)).toBeGreaterThan(0);
    });

    test('should generate comprehensive report', () => {
      const key = 'test-key';
      cache.set(key, { response: 'Test' });
      cache.get(key);

      const report = cache.generateReport();

      expect(report).toContain('INTELLIGENT CACHE');
      expect(report).toContain('Hit Rate');
      expect(report).toContain('Memory Usage');
    });
  });

  describe('Cache Clearing', () => {
    test('should clear all cache entries', () => {
      cache.set('key1', { response: 'Test1' });
      cache.set('key2', { response: 'Test2' });

      cache.clear();

      expect(cache.get('key1')).toBeNull();
      expect(cache.get('key2')).toBeNull();
      expect(cache.getStats().cacheSize).toBe(0);
    });

    test('should reset statistics on clear', () => {
      cache.set('key1', { response: 'Test' });
      cache.get('key1');

      cache.clear();

      const stats = cache.getStats();
      expect(stats.hits).toBe(0);
      expect(stats.misses).toBe(0);
    });
  });

  describe('Edge Cases', () => {
    test('should handle null values', () => {
      cache.set('null-key', null);
      const retrieved = cache.get('null-key');

      expect(retrieved).toBeNull();
    });

    test('should handle large objects', () => {
      const largeObject = {
        data: 'x'.repeat(100000),
        nested: { deep: { value: 'test' } },
      };

      cache.set('large-key', largeObject);
      const retrieved = cache.get('large-key');

      expect(retrieved).toEqual(largeObject);
    });

    test('should handle special characters in keys', () => {
      const specialKey = 'key-with-special-!@#$%^&*()_+-=[]{}|;:,.<>?';
      cache.set(specialKey, { response: 'Test' });

      const retrieved = cache.get(specialKey);
      expect(retrieved).not.toBeNull();
    });
  });
});

