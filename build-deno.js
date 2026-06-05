// Build script for creating standalone binary using Deno compile
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

console.log('🔨 Building standalone binary with Deno...\n');

// Paths
const __filename = fileURLToPath(import.meta.url);
const projectDir = path.dirname(__filename);
const distDir = path.join(projectDir, 'dist');
const serverDir = path.join(projectDir, 'server');

// Ensure dist directory exists
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Step 1: Build frontend with Vite
console.log('📦 Building frontend with Vite...');
try {
  execSync('npm run build', {
    cwd: projectDir,
    stdio: 'inherit'
  });
  console.log('✅ Frontend build complete\n');
} catch (err) {
  console.error('❌ Frontend build failed:', err.message);
  process.exit(1);
}

// Step 2: Create Deno compile command
console.log('📝 Compiling Deno server to binary...');

const binaryPath = path.join(distDir, 'json-endpoints');
const denoFlags = [
  'compile',
  '--allow-net',
  '--allow-read',
  '--allow-env',
  '--allow-sys',
  '--allow-write', // Added for potential file operations
  '--allow-run', // Added for Deno.exit()
  `--output=${binaryPath}`,
  path.join(serverDir, 'index.ts')
];

try {
  execSync(`deno ${denoFlags.join(' ')}`, {
    cwd: projectDir,
    stdio: 'inherit'
  });
  console.log('✅ Deno compile complete\n');
} catch (err) {
  console.error('❌ Deno compile failed:', err.message);
  process.exit(1);
}

// Step 3: Make binary executable
try {
  fs.chmodSync(binaryPath, '755');
  console.log('✅ Made binary executable\n');
} catch (err) {
  console.warn('⚠️  Could not make binary executable:', err.message);
}

// Final output
const stats = fs.statSync(binaryPath);
console.log('✅ Build complete!');
console.log(`   Output: ${binaryPath}`);
console.log(`   Size: ${(stats.size / (1024 * 1024)).toFixed(1)}MB`);
console.log(`\n🚀 Test with: ${binaryPath} --help`);
console.log(`\n📝 Usage:`);
console.log(`   ${binaryPath}                    # Load .env from current directory`);
console.log(`   ${binaryPath} --env-file path    # Load from custom path`);
console.log(`   ${binaryPath} --help             # Show help`);
