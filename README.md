# JSON Endpoints

A full-stack application for managing JSON endpoints with a React frontend, Deno backend, and CLI access. Features API key authentication, modular CLI architecture, and skills synchronization.

## 🚀 Tech Stack

- **Frontend**: React + Vite + TypeScript
- **Backend**: Deno + Oak + MongoDB
- **UI Components**: Shadcn/UI + Radix UI
- **CLI**: Node.js with modular architecture
- **Build**: Deno compile for standalone binary
- **Deployment**: Hotify CLI on dk2
- **Security**: API key authentication

## 📁 Project Structure

```
json-endpoints/
├── cli.js                  # CLI entry point (121 LOC)
├── lib/                    # Modular CLI utilities
│   ├── utils.js           # Output formatting (39 LOC)
│   ├── config.js          # Configuration management (27 LOC)
│   ├── api.js             # HTTP requests (63 LOC)
│   ├── commands.js        # Command implementations (197 LOC)
│   └── interactive.js     # Interactive CLI (233 LOC)
├── scripts/
│   └── sync-skills.js     # Skills sync script (132 LOC)
├── server/                # Deno backend
│   ├── index.ts          # Server entry point (158 LOC)
│   ├── routes/rpc.ts     # RPC API routes
│   ├── models/           # MongoDB models
│   └── utils/db.ts       # Database connection
├── src/                  # React frontend
│   ├── pages/
│   │   └── JsonEndpoints.tsx
│   └── components/ui/   # Shadcn/UI components
├── build-deno.js         # Binary build script
├── run-binary.sh         # Binary execution helper
├── AGENTS.md             # Agent development guide
└── package.json
```

## 🌐 Deployment

**Live URL**: https://json-endpoints.dk2.intrane.fr

The application is deployed on dk2 via Hotify with:
- Traefik reverse proxy for SSL
- vps1 shared MongoDB instance
- API key authentication

## 🛠️ Development

### Prerequisites

- Node.js 24+
- Deno 1.40+
- MongoDB access

### Local Development

```bash
# Install dependencies
npm install

# Run frontend dev server
npm run dev

# Run both frontend and backend
npm run dev:all

# Run CLI
node cli.js --help

# Run interactive CLI
node cli.js interactive
```

### Building Binary

```bash
# Build standalone binary with embedded frontend
npm run build:binary

# Run the binary
./dist/json-endpoints --help

# Run with custom env file
./dist/json-endpoints --env-file /path/to/.env
```

## 🔧 Configuration

### Environment Variables

**Required:**
- `MONGODB_URI` - MongoDB connection string
- `API_KEY` - API key for authentication (required for production)

**Optional:**
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (default: production)
- `REFERER_WHITELIST` - Comma-separated list of allowed domains for RPC calls

### Binary Details

- **Size**: ~90MB (includes Deno runtime)
- **Platform**: Matches your build platform (Linux, macOS, Windows)
- **Dependencies**: None (fully self-contained)

## 🖥️ CLI Usage

A Node.js CLI is available for controlling the application via command line.

### Installation

```bash
# Link the CLI globally (optional)
npm link
# Or run directly
node cli.js <command>
```

### Commands

```bash
# List all JSON endpoints
node cli.js list
node cli.js list --human
node cli.js list --api-url https://json-endpoints.dk2.intrane.fr

# Get a specific endpoint
node cli.js get <title>
node cli.js get my-config --human

# Create a new endpoint (from file)
node cli.js create <title> <file.json>
node cli.js create my-config config.json --api-url https://json-endpoints.dk2.intrane.fr

# Update an existing endpoint (from file)
node cli.js update <title> <file.json>
node cli.js update my-config config.json

# Delete an endpoint
node cli.js delete <title>
node cli.js delete my-config

# Interactive mode
node cli.js interactive
```

### CLI Options

- `--human, -H` - Human-readable output
- `--json, -j` - JSON output (default)
- `--api-url <url>` - API base URL (default: http://localhost:3000)
- `--api-key <key>` - API key for authentication
- `--help, -h` - Show help message

### Configuration

The CLI creates a `.json-endpoints-config.json` file for storing your API URL and API key preferences.

### Examples

```bash
# Set API URL and key in interactive mode first
node cli.js interactive
# Then use it directly
node cli.js list

# Or specify API URL and key per command
node cli.js list --api-url https://json-endpoints.dk2.intrane.fr --api-key your-api-key

# Set API key as environment variable
export JSON_ENDPOINTS_API_KEY=your-api-key
node cli.js list --api-url https://json-endpoints.dk2.intrane.fr

# Create from JSON file
echo '{"key":"value"}' > my-config.json
node cli.js create my-config my-config.json --api-url https://json-endpoints.dk2.intrane.fr --api-key your-api-key
```

### Security

The API is protected by an API key authentication mechanism. All API requests must include a valid `X-API-Key` header. The web UI automatically includes the API key for its requests, while the CLI can be configured with the key via:
- Environment variable: `JSON_ENDPOINTS_API_KEY`
- Command-line flag: `--api-key`
- Interactive configuration: Option 6 in interactive mode

## 🔄 Skills Sync Script

A script is available to sync all your Devin skills from `~/.agents/skills` into a JSON endpoint called `jar-skills`.

### Usage

```bash
# Sync all skills to the jar-skills endpoint
npm run sync:skills

# Or run directly
node scripts/sync-skills.js
```

### What It Does

- Reads all `SKILL.md` files from `~/.agents/skills`
- Extracts YAML frontmatter (name, description) and content
- Creates a structured JSON array with all skills
- Upserts to the `jar-skills` endpoint on the configured API

### Accessing Synced Skills

```bash
# Get skills via CLI
node cli.js get jar-skills --api-key your-api-key --api-url https://json-endpoints.dk2.intrane.fr

# Access via API (with authentication)
curl -H "X-API-Key: your-api-key" https://json-endpoints.dk2.intrane.fr/api/rpc \
  -H "Content-Type: application/json" \
  -d '{"type":"readAll","payload":{}}'
```

### Skill Data Structure

Each skill in the `jar-skills` endpoint contains:
- `name`: Skill name (from YAML frontmatter or directory name)
- `description`: Skill description (from YAML frontmatter)
- `content`: Full skill content (frontmatter removed)
- `path`: Directory name in `~/.agents/skills`
- `updatedAt`: Timestamp of last sync

## 🏗️ Architecture

### Backend (Deno + Oak)

The backend uses Deno with Oak framework and MongoDB:

- **RPC API**: Single endpoint `/api/rpc` for all operations
- **MongoDB**: Stores JSON endpoints with schema validation
- **API Key Middleware**: Authenticates all API requests
- **Static Files**: Serves React frontend in production

### Frontend (React + Vite)

The frontend uses React with Vite and Shadcn/UI:

- **Monaco Editor**: JSON editing with syntax highlighting
- **Radix UI**: Accessible UI components
- **Tailwind CSS**: Utility-first styling
- **API Integration**: Built-in API key authentication

### CLI (Node.js)

The CLI follows agent-first design principles:

- **Modular Architecture**: Split into focused modules under 500 LOC each
- **JSON-by-default**: All commands output JSON unless `--human` flag
- **API Key Support**: Multiple configuration methods
- **Interactive Mode**: Menu-driven interface for human users

## 📊 Database Schema

```typescript
interface JsonEndpoint {
  _id: ObjectId;
  title: string;        // Unique identifier
  json: string;         // JSON content as string
  createdAt: Date;
  updatedAt: Date;
}
```

## 🔒 Security

### API Key Authentication

All API requests require a valid `X-API-Key` header:

```bash
curl -X POST https://json-endpoints.dk2.intrane.fr/api/rpc \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-api-key" \
  -d '{"type":"readAll","payload":{}}'
```

### Frontend Security

- API key embedded during build (via Vite define)
- Static files served without authentication
- API routes protected by middleware

### CLI Security

- API key stored in config file
- Environment variable support
- Never logs sensitive data

## 🤝 Contributing

See [AGENTS.md](./AGENTS.md) for agent development guidelines including:
- File size limits (max 500 LOC)
- Module organization
- Coding conventions
- Testing guidelines
- API response patterns

## 📝 License

MIT

## 🙏 Acknowledgments

- Built with [Lovable](https://lovable.dev)
- UI components from [Shadcn/UI](https://ui.shadcn.com)
- Backend framework [Oak](https://oakserver.github.io/oak/)
