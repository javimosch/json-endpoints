// Individual command implementations for JSON Endpoints CLI
import { apiRequest } from './api.js';
import { formatOutput, fileExists } from './utils.js';
import fs from 'fs';

export async function listEndpoints(args, humanMode) {
  try {
    const data = await apiRequest('POST', '/api/rpc', {
      type: 'readAll',
      payload: {}
    }, args, humanMode);
    
    console.log(formatOutput(data, humanMode));
  } catch (error) {
    if (!humanMode) {
      console.error(JSON.stringify({ error: error.message }, null, 2));
      process.exit(1);
    }
  }
}

export async function getEndpoint(title, args, humanMode) {
  if (!title) {
    console.error('❌ Title is required');
    process.exit(1);
  }
  
  try {
    const data = await apiRequest('POST', '/api/rpc', {
      type: 'readAll',
      payload: {}
    }, args, humanMode);
    
    const endpoint = data.find(item => item.title === title);
    
    if (!endpoint) {
      if (humanMode) {
        console.error(`❌ JSON endpoint '${title}' not found`);
      } else {
        console.error(JSON.stringify({ error: 'Not found' }, null, 2));
      }
      process.exit(1);
    }
    
    console.log(formatOutput(endpoint, humanMode));
  } catch (error) {
    if (!humanMode) {
      console.error(JSON.stringify({ error: error.message }, null, 2));
      process.exit(1);
    }
  }
}

export async function createEndpoint(title, jsonString, args, humanMode) {
  if (!title) {
    console.error('❌ Title is required');
    process.exit(1);
  }
  
  // Check if jsonString is a file path
  let jsonContent = jsonString;
  if (jsonString && (jsonString.endsWith('.json') || await fileExists(jsonString))) {
    try {
      jsonContent = await fs.promises.readFile(jsonString, 'utf8');
    } catch (error) {
      console.error('❌ Could not read JSON file:', error.message);
      process.exit(1);
    }
  }
  
  if (!jsonContent) {
    console.error('❌ JSON content is required (provide as string or file path)');
    process.exit(1);
  }
  
  // Validate JSON
  try {
    JSON.parse(jsonContent);
  } catch (error) {
    console.error('❌ Invalid JSON format:', error.message);
    process.exit(1);
  }
  
  try {
    const result = await apiRequest('POST', '/api/rpc', {
      type: 'createUpdate',
      payload: { title, json: jsonContent }
    }, args, humanMode);
    
    console.log(formatOutput(result, humanMode));
  } catch (error) {
    if (!humanMode) {
      console.error(JSON.stringify({ error: error.message }, null, 2));
      process.exit(1);
    }
  }
}

export async function updateEndpoint(title, jsonString, args, humanMode) {
  if (!title) {
    console.error('❌ Title is required');
    process.exit(1);
  }
  
  // Check if jsonString is a file path
  let jsonContent = jsonString;
  if (jsonString && (jsonString.endsWith('.json') || await fileExists(jsonString))) {
    try {
      jsonContent = await fs.promises.readFile(jsonString, 'utf8');
    } catch (error) {
      console.error('❌ Could not read JSON file:', error.message);
      process.exit(1);
    }
  }
  
  if (!jsonContent) {
    console.error('❌ JSON content is required (provide as string or file path)');
    process.exit(1);
  }
  
  // Validate JSON
  try {
    JSON.parse(jsonContent);
  } catch (error) {
    console.error('❌ Invalid JSON format:', error.message);
    process.exit(1);
  }
  
  try {
    // First get the existing endpoint to find its ID
    const data = await apiRequest('POST', '/api/rpc', {
      type: 'readAll',
      payload: {}
    }, args, humanMode);
    
    const existing = data.find(item => item.title === title);
    
    if (!existing) {
      if (humanMode) {
        console.error(`❌ JSON endpoint '${title}' not found`);
      } else {
        console.error(JSON.stringify({ error: 'Not found' }, null, 2));
      }
      process.exit(1);
    }
    
    const result = await apiRequest('POST', '/api/rpc', {
      type: 'createUpdate',
      payload: { id: existing.id, title, json: jsonContent }
    }, args, humanMode);
    
    console.log(formatOutput(result, humanMode));
  } catch (error) {
    if (!humanMode) {
      console.error(JSON.stringify({ error: error.message }, null, 2));
      process.exit(1);
    }
  }
}

export async function deleteEndpoint(title, args, humanMode) {
  if (!title) {
    console.error('❌ Title is required');
    process.exit(1);
  }
  
  try {
    // First get the existing endpoint to find its ID
    const data = await apiRequest('POST', '/api/rpc', {
      type: 'readAll',
      payload: {}
    }, args, humanMode);
    
    const existing = data.find(item => item.title === title);
    
    if (!existing) {
      if (humanMode) {
        console.error(`❌ JSON endpoint '${title}' not found`);
      } else {
        console.error(JSON.stringify({ error: 'Not found' }, null, 2));
      }
      process.exit(1);
    }
    
    const result = await apiRequest('POST', '/api/rpc', {
      type: 'remove',
      payload: { id: existing.id }
    }, args, humanMode);
    
    console.log(formatOutput(result, humanMode));
  } catch (error) {
    if (!humanMode) {
      console.error(JSON.stringify({ error: error.message }, null, 2));
      process.exit(1);
    }
  }
}
