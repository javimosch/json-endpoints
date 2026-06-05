#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { homedir } from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SKILLS_DIR = path.join(homedir(), '.agents/skills');
const API_URL = process.env.JSON_ENDPOINTS_API_URL || 'https://json-endpoints.dk2.intrane.fr';
const API_KEY = process.env.JSON_ENDPOINTS_API_KEY || '3d9a997beaabbbd88a1cd7794f0672c25a30c47865cdd83d70d744fe3555d2ab';

// Function to read all skill files
async function readAllSkills() {
  const skills = [];
  
  try {
    const skillDirs = await fs.promises.readdir(SKILLS_DIR);
    
    for (const skillDir of skillDirs) {
      // Skip hidden directories and files
      if (skillDir.startsWith('.')) continue;
      
      const skillPath = path.join(SKILLS_DIR, skillDir, 'SKILL.md');
      
      try {
        await fs.promises.access(skillPath);
        const content = await fs.promises.readFile(skillPath, 'utf8');
        
        // Extract YAML frontmatter
        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
        let metadata = { name: skillDir, description: '' };
        
        if (frontmatterMatch) {
          try {
            // Parse YAML frontmatter (simple key-value pairs)
            const frontmatter = frontmatterMatch[1];
            const lines = frontmatter.split('\n');
            for (const line of lines) {
              const match = line.match(/^(\w+):\s*"(.+)"$/);
              if (match) {
                metadata[match[1]] = match[2];
              }
            }
          } catch (e) {
            console.warn(`Failed to parse frontmatter for ${skillDir}`);
          }
        }
        
        // Remove frontmatter from content
        const cleanContent = content.replace(/^---\n[\s\S]*?\n---\n/, '');
        
        skills.push({
          name: metadata.name || skillDir,
          description: metadata.description || '',
          content: cleanContent,
          path: skillDir,
          updatedAt: new Date().toISOString()
        });
        
        console.log(`✅ Read skill: ${metadata.name || skillDir}`);
      } catch (error) {
        // Skip if not a directory or no SKILL.md
        if (error.code === 'ENOENT' || error.code === 'ENOTDIR') {
          continue;
        }
        console.warn(`⚠️  Could not read skill ${skillDir}:`, error.message);
      }
    }
    
    return skills;
  } catch (error) {
    console.error('❌ Error reading skills directory:', error.message);
    process.exit(1);
  }
}

// Function to upsert skills to JSON endpoint
async function upsertSkillsToAPI(skills) {
  const skillsJson = JSON.stringify(skills, null, 2);
  
  try {
    const response = await fetch(`${API_URL}/api/rpc`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY
      },
      body: JSON.stringify({
        type: 'createUpdate',
        payload: {
          title: 'jar-skills',
          json: skillsJson
        }
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }
    
    const result = await response.json();
    console.log('✅ Successfully upserted jar-skills to API');
    console.log(`📊 Total skills: ${skills.length}`);
    return result;
  } catch (error) {
    console.error('❌ Error upserting to API:', error.message);
    process.exit(1);
  }
}

// Main execution
async function main() {
  console.log('🔍 Reading skills from ~/.agents/skills...');
  const skills = await readAllSkills();
  
  console.log(`\n📝 Found ${skills.length} skills`);
  console.log('📤 Upserting to JSON endpoint...');
  
  await upsertSkillsToAPI(skills);
  
  console.log('\n✅ Skills sync complete!');
  console.log(`🌐 Access at: ${API_URL}/api/jsons/jar-skills.json`);
}

main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
