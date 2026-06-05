// Utility functions for JSON Endpoints CLI
import fs from 'fs';

export function formatOutput(data, humanMode = false) {
  if (humanMode) {
    return formatHuman(data);
  }
  return JSON.stringify(data, null, 2);
}

export function formatHuman(data) {
  if (Array.isArray(data)) {
    if (data.length === 0) {
      return 'No JSON endpoints found.';
    }
    return data.map(item => 
      `📄 ${item.title}\n   ID: ${item.id}\n   Updated: ${new Date(item.updatedAt).toLocaleString()}`
    ).join('\n\n');
  } else if (data.title && data.json) {
    try {
      const parsedJson = JSON.parse(data.json);
      return `📄 ${data.title}\n\n${JSON.stringify(parsedJson, null, 2)}`;
    } catch {
      return `📄 ${data.title}\n\n${data.json}`;
    }
  } else if (data.success !== undefined) {
    return data.success ? '✅ Success' : '❌ Failed';
  }
  return JSON.stringify(data, null, 2);
}

export async function fileExists(filePath) {
  try {
    await fs.promises.access(filePath);
    return true;
  } catch {
    return false;
  }
}
