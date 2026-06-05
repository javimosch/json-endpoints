// Configuration management for JSON Endpoints CLI
import fs from 'fs';

const CONFIG_FILE = '.json-endpoints-config.json';
const DEFAULT_API_URL = 'http://localhost:3000';
const DEFAULT_API_KEY = process.env.JSON_ENDPOINTS_API_KEY || '';

export async function loadConfig() {
  try {
    const configContent = await fs.promises.readFile(CONFIG_FILE, 'utf8');
    return JSON.parse(configContent);
  } catch (error) {
    return { apiUrl: DEFAULT_API_URL, apiKey: DEFAULT_API_KEY };
  }
}

export async function saveConfig(config) {
  await fs.promises.writeFile(CONFIG_FILE, JSON.stringify(config, null, 2));
}

export function getDefaultApiUrl() {
  return DEFAULT_API_URL;
}

export function getDefaultApiKey() {
  return DEFAULT_API_KEY;
}
