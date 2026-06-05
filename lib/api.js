// HTTP request helper and API interaction
import { loadConfig, getDefaultApiUrl, getDefaultApiKey } from './config.js';

export async function getApiUrl(args) {
  const urlIndex = args.indexOf('--api-url');
  if (urlIndex !== -1 && args[urlIndex + 1]) {
    return args[urlIndex + 1];
  }
  
  const config = await loadConfig();
  return config.apiUrl || getDefaultApiUrl();
}

export async function getApiKey(args) {
  const keyIndex = args.indexOf('--api-key');
  if (keyIndex !== -1 && args[keyIndex + 1]) {
    return args[keyIndex + 1];
  }
  
  const config = await loadConfig();
  return config.apiKey || getDefaultApiKey();
}

export async function apiRequest(method, endpoint, data = null, args, humanMode) {
  const apiUrl = await getApiUrl(args);
  const apiKey = await getApiKey(args);
  const url = `${apiUrl}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
  };
  
  // Add API key if available
  if (apiKey) {
    headers['X-API-Key'] = apiKey;
  }
  
  const options = {
    method: method,
    headers: headers,
  };
  
  if (data) {
    options.body = JSON.stringify(data);
  }
  
  try {
    const response = await fetch(url, options);
    const responseData = await response.json();
    
    if (!response.ok) {
      throw new Error(responseData.error || `HTTP ${response.status}`);
    }
    
    return responseData;
  } catch (error) {
    if (humanMode) {
      console.error(`❌ Error: ${error.message}`);
      process.exit(1);
    }
    throw error;
  }
}
