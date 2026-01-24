/**
 * WebBrowserService - Web Search Service (The Eyes)
 * Uses Tavily API for intelligent web search
 * Part of Layer 2: Execution and Automation Layer
 */

import { tavily } from '@tavily/core';

/**
 * Search the web using Tavily API
 * 
 * @param {string} query - The search query
 * @param {Object} options - Additional search options
 * @param {number} options.maxResults - Maximum number of results to return (default: 5)
 * @param {string} options.searchDepth - Search depth: 'basic' or 'advanced' (default: 'basic')
 * @param {boolean} options.includeAnswer - Include AI-generated answer (default: true)
 * @param {boolean} options.includeRawContent - Include raw content from sources (default: false)
 * @returns {Promise<Object>} - Structured search results with answer and sources
 */
export async function search(query, options = {}) {
  try {
    // Check if API key is available
    const apiKey = process.env.REACT_APP_TAVILY_API_KEY;
    
    if (!apiKey) {
      // Gracefully handle missing API key
      return {
        success: false,
        error: 'API key not configured',
        message: 'Tavily API key is missing. Please add REACT_APP_TAVILY_API_KEY to your environment variables.',
        query,
        answer: null,
        sources: [],
        timestamp: new Date().toISOString(),
      };
    }

    // Default options
    const {
      maxResults = 5,
      searchDepth = 'basic',
      includeAnswer = true,
      includeRawContent = false,
    } = options;

    // Initialize Tavily client
    const client = tavily({ apiKey });

    // Perform search
    const response = await client.search(query, {
      maxResults,
      searchDepth,
      includeAnswer,
      includeRawContent,
    });

    // Structure the response
    return {
      success: true,
      query,
      answer: response.answer || null,
      sources: response.results?.map(result => ({
        title: result.title,
        url: result.url,
        content: result.content,
        score: result.score,
        publishedDate: result.published_date || null,
      })) || [],
      imagesResults: response.images || [],
      timestamp: new Date().toISOString(),
    };

  } catch (error) {
    console.error('WebBrowserService error:', error);
    
    // Graceful error handling
    return {
      success: false,
      error: error.message || 'Unknown error',
      message: 'Failed to perform web search. Please try again.',
      query,
      answer: null,
      sources: [],
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Perform a quick search and return only the answer
 * 
 * @param {string} query - The search query
 * @returns {Promise<string|null>} - Quick answer or null if not available
 */
export async function quickSearch(query) {
  try {
    const result = await search(query, {
      maxResults: 3,
      searchDepth: 'basic',
      includeAnswer: true,
    });

    return result.success ? result.answer : null;
  } catch (error) {
    console.error('QuickSearch error:', error);
    return null;
  }
}

/**
 * Perform a deep search with more comprehensive results
 * 
 * @param {string} query - The search query
 * @returns {Promise<Object>} - Comprehensive search results
 */
export async function deepSearch(query) {
  return search(query, {
    maxResults: 10,
    searchDepth: 'advanced',
    includeAnswer: true,
    includeRawContent: true,
  });
}

const WebBrowserService = {
  search,
  quickSearch,
  deepSearch,
};

export default WebBrowserService;
