// Environment configuration
require('dotenv').config();

/**
 * Configuration object with all environment variables
 * Validates required variables and provides defaults for optional ones
 */
const config = {
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // API Keys
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS || '1000', 10)
  },
  
  // Server configuration
  server: {
    corsOrigin: process.env.CORS_ORIGIN || '*'
  }
};

// Validate required environment variables
function validateEnv() {
  const requiredVars = ['OPENAI_API_KEY'];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
}

module.exports = { config, validateEnv };