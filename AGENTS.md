# AGENTS.md - JSON Endpoints Project Guide

This document guides AI agents in understanding, extending, and maintaining the JSON Endpoints project.

## Project Philosophy

JSON Endpoints implements **agent-first CLI design**:

- **JSON-by-default**: All CLI commands output JSON unless `--human` flag
- **Structured errors**: Error objects with clear messages
- **Output separation**: stdout for data, stderr for logs
- **API-first**: RESTful API at `/api/*`, React UI at `/`
- **No interactivity by default**: All operations non-interactive unless explicitly requested
- **Security-first**: API key authentication for all API operations

## Project Structure

```
json-endpoints/
├── cli.js                  # CLI entry point and command routing
├── lib/
│   ├── utils.js            # Output formatting and utility functions
│   ├── config.js           # Configuration management
│   ├── api.js              # HTTP request helper and API interaction
│   ├── commands.js         # Individual command implementations
│   └── interactive.js      # Interactive CLI class
├── scripts/
│   └── sync-skills.js      # Skills synchronization script
├── server/
│   ├── index.ts            # Deno server entry point
│   ├── routes/
│   │   └── rpc.ts          # RPC API routes
│   ├── models/
│   │   └── JsonEndpoints.ts # MongoDB model
│   └── utils/
│       └── db.ts           # Database connection
├── src/                    # React frontend
│   ├── pages/
│   │   └── JsonEndpoints.tsx
│   └── components/ui/     # Shadcn/UI components
├── build-deno.js           # Deno binary build script
├── run-binary.sh           # Binary execution helper
└── package.json
```

## Coding Rules

### File Size Limits

- **Max 500 LOC per file** - Split files that exceed this
- **Max 300 LOC per documentation file** - Keep docs concise
- **Max 200 LOC per test file** - Split complex tests

### Module Organization

| Directory | Responsibility |
|-----------|----------------|
| `cli.js` | CLI entry point, argument parsing, command routing |
| `lib/` | Reusable CLI utilities and business logic |
| `scripts/` | Utility scripts for project maintenance |
| `server/` | Deno backend server and API routes |
| `src/` | React frontend application |

### Naming Conventions

- **JS files**: `kebab-case.js` for files
- **TS files**: `kebab-case.ts` for TypeScript files
- **Functions**: `camelCase` for functions
- **Classes**: `PascalCase` for classes
- **Constants**: `UPPER_SNAKE_CASE` for constants
- **Config keys**: `camelCase` in JSON

### Agent-First Output Patterns

**Default JSON Output (CLI):**
```javascript
// Always output JSON by default
const result = {
  status: "success",
  data: { /* ... */ },
  timestamp: new Date().toISOString()
};
console.log(JSON.stringify(result, null, 2));
```

**Human-Readable Output (opt-in):**
```javascript
// Only when --human flag is passed
if (humanMode) {
  console.log(`✅ Success: ${result.data.id}`);
} else {
  console.log(JSON.stringify(result, null, 2));
}
```

**Structured Errors:**
```javascript
try {
  const result = await apiRequest(...);
  console.log(formatOutput(result, humanMode));
} catch (error) {
  if (!humanMode) {
    console.error(JSON.stringify({ error: error.message }, null, 2));
    process.exit(1);
  }
}
```

## API Response Patterns

### JSON Response Structure

```typescript
// Success response
ctx.response.body = {
  id: newItem._id?.toString(),
  title: newItem.title,
  json: newItem.json
};

// Error response
ctx.response.status = 400;
ctx.response.body = { error: "Invalid JSON format" };
```

### RPC API Pattern

```typescript
// RPC endpoint structure
router.post("/api/rpc", async (ctx) => {
  const { type, payload } = await ctx.request.body().value;
  
  switch (type) {
    case "createUpdate":
      // Handle create/update
      break;
    case "remove":
      // Handle delete
      break;
    case "readAll":
      // Handle list
      break;
  }
});
```

## Configuration Management

### Environment Variables

- `MONGODB_URI` - MongoDB connection string (required)
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment mode (default: production)
- `API_KEY` - API key for authentication (required for production)
- `REFERER_WHITELIST` - Comma-separated list of allowed domains (optional)

### Config File Pattern

```javascript
// CLI configuration file (.json-endpoints-config.json)
{
  "apiUrl": "http://localhost:3000",
  "apiKey": "your-api-key-here"
}
```

## Adding New CLI Commands

### 1. Add Command Handler (in lib/commands.js)

```javascript
export async function myCommand(param, args, humanMode) {
  if (!param) {
    console.error('❌ Parameter required');
    process.exit(1);
  }
  
  try {
    const result = await apiRequest('POST', '/api/rpc', {
      type: 'myOperation',
      payload: { param }
    }, args, humanMode);
    
    console.log(formatOutput(result, humanMode));
  } catch (error) {
    if (!humanMode) {
      console.error(JSON.stringify({ error: error.message }, null, 2));
      process.exit(1);
    }
  }
}
```

### 2. Add CLI Routing (in cli.js)

```javascript
case 'mycommand':
  commands.myCommand(subcommandArgs[0], args, hasHumanFlag);
  break;
```

### 3. Add Interactive Menu Option (in lib/interactive.js)

```javascript
async myCommand() {
  console.log('🔧 My Command');
  console.log('═'.repeat(30));
  console.log();
  
  const param = await this.question('Enter parameter: ');
  
  await commands.myCommand(param, this.args, this.humanMode);
  await this.question('Press Enter to continue...');
}
```

### 4. Update Help Text (in cli.js)

```javascript
Commands:
  list                    List all JSON endpoints
  mycommand <param>       Execute my command
```

## Adding New API Endpoints

### 1. Add RPC Type (in server/routes/rpc.ts)

```typescript
case "myOperation": {
  const { param } = payload;
  // Your logic here
  ctx.response.body = { result: "success" };
  return;
}
```

### 2. Add Frontend Integration (in src/pages/JsonEndpoints.tsx)

```typescript
const handleMyOperation = async () => {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (import.meta.env.VITE_API_KEY) {
    headers["X-API-Key"] = import.meta.env.VITE_API_KEY;
  }
  
  const response = await fetch("/api/rpc", {
    method: "POST",
    headers,
    body: JSON.stringify({
      type: "myOperation",
      payload: { param: "value" }
    })
  });
  
  const result = await response.json();
  // Handle result
};
```

## Security Guidelines

### API Key Authentication

All API requests must include a valid `X-API-Key` header:

```javascript
const headers = {
  'Content-Type': 'application/json',
  'X-API-Key': apiKey
};
```

### Frontend API Key Embedding

The API key is embedded in the frontend during build:

```typescript
// vite.config.ts
define: {
  'import.meta.env.VITE_API_KEY': JSON.stringify(process.env.API_KEY || ''),
}
```

### CLI API Key Configuration

The CLI supports multiple API key configuration methods:

1. Environment variable: `JSON_ENDPOINTS_API_KEY`
2. Command-line flag: `--api-key`
3. Configuration file: `.json-endpoints-config.json`
4. Interactive mode: Option 6

## Build & Deployment

### Development

```bash
npm run dev              # Run React frontend dev server
npm run dev:all          # Run both frontend and backend
npm run cli              # Run CLI
npm run cli:interactive  # Run interactive CLI mode
```

### Production Build

```bash
npm run build:binary     # Build Deno binary with embedded frontend
./dist/json-endpoints --help  # Test binary
```

### Deployment via Hotify

```bash
# Configure app on remote server
hotify-cli setup --id json-endpoints --local

# Copy binary and assets
rsync -avz dist/ dk2:/opt/json-endpoints/dist/
rsync -avz .env dk2:/opt/json-endpoints/

# Start service
hotify-cli start --id json-endpoints --local
```

## Testing Guidelines

### CLI Testing

```bash
# Test basic commands
node cli.js list
node cli.js get jar-skills --human
node cli.js list --api-url https://json-endpoints.dk2.intrane.fr

# Test with API key
node cli.js list --api-key your-key --api-url https://json-endpoints.dk2.intrane.fr
```

### API Testing

```bash
# Test API without key (should fail)
curl -X POST https://json-endpoints.dk2.intrane.fr/api/rpc \
  -H "Content-Type: application/json" \
  -d '{"type":"readAll","payload":{}}'

# Test API with key (should succeed)
curl -X POST https://json-endpoints.dk2.intrane.fr/api/rpc \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-key" \
  -d '{"type":"readAll","payload":{}}'
```

## Agent-First Design Checklist

When extending this project, ensure:

- [ ] CLI commands default to JSON output
- [ ] `--human` flag provides human-readable output
- [ ] All API routes require API key authentication
- [ ] Output separation (stdout data, stderr logs)
- [ ] No interactive prompts by default
- [ ] API endpoints return JSON with stable structure
- [ ] Environment variables for configuration
- [ ] Max 500 LOC per file
- [ ] Clear module responsibilities
- [ ] Comprehensive error handling
- [ ] Proper error propagation

## Common Patterns

### Reading Configuration

```javascript
import { loadConfig } from './lib/config.js';
const config = await loadConfig();
console.log(config.apiUrl);
```

### Making API Requests

```javascript
import { apiRequest } from './lib/api.js';
const result = await apiRequest('POST', '/api/rpc', {
  type: 'readAll',
  payload: {}
}, args, humanMode);
```

### Formatting Output

```javascript
import { formatOutput } from './lib/utils.js';
console.log(formatOutput(data, humanMode));
```

### File Operations

```javascript
import { fileExists } from './lib/utils.js';
if (await fileExists(filePath)) {
  const content = await fs.promises.readFile(filePath, 'utf8');
}
```

## Skills Sync Script

The project includes a utility script to sync Devin skills to a JSON endpoint:

```bash
npm run sync:skills
```

This script:
- Reads all `SKILL.md` files from `~/.agents/skills`
- Extracts YAML frontmatter and content
- Creates structured JSON array
- Upserts to `jar-skills` endpoint

## Future Enhancements

- [ ] Add comprehensive JSON schema validation
- [ ] Add `--help-json` command for machine-readable help
- [ ] Add rate limiting for API endpoints
- [ ] Add request signing for enhanced security
- [ ] Add metrics/monitoring endpoints
- [ ] Add integration tests
- [ ] Add cross-platform binary builds (macOS, Windows)

## References

- [Command Line Interface Guidelines](https://clig.dev/)
- [Agent-Friendly CLI Design](https://www.infoq.com/articles/ai-agent-driven-clis/)
- [Deno Single Executable Applications](https://deno.land/manual@v1.40.0/tools/compiler)
- [Oak Framework Documentation](https://oakserver.github.io/oak/)
