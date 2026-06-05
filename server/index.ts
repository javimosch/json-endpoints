import { load } from "dotenv";
import { Application, Router, send } from "oak";
import rpcRouter from "./routes/rpc.ts";
import { getJsonItems } from "./routes/rpc.ts";
import { connectDB } from "./utils/db.ts";
import { JsonEndpointModel } from "./models/JsonEndpoints.ts";

// Parse command line arguments for --env-file
const args = Deno.args;

// Show help if requested
if (args.includes("--help") || args.includes("-h")) {
  console.log(`
json-endpoints - JSON Endpoints Server

Usage:
  json-endpoints [options]

Options:
  --env-file <path>    Load environment variables from specified file
                       (default: .env in current directory)
  --help, -h          Show this help message

Environment Variables:
  MONGODB_URI         MongoDB connection string (required)
  PORT                Server port (default: 3000)
  NODE_ENV            Environment mode (default: production)
  API_KEY             API key for authentication (required for production)
  REFERER_WHITELIST   Comma-separated list of allowed domains (optional)

Examples:
  json-endpoints                          # Load .env from current directory
  json-endpoints --env-file /path/to/.env # Load from custom path
  MONGODB_URI="..." json-endpoints        # Use system environment
`);
  Deno.exit(0);
}

const envFileIndex = args.indexOf("--env-file");
let envPath = ".env"; // Default to current directory

if (envFileIndex !== -1 && args[envFileIndex + 1]) {
  envPath = args[envFileIndex + 1];
  console.log(`Loading environment from: ${envPath}`);
}

// Load environment variables from .env file
try {
  await load({ export: true, allowEmptyValues: true, envPath });
  console.log(`Environment loaded successfully from: ${envPath}`);
} catch (error) {
  console.warn(`Warning: Could not load .env file from ${envPath}: ${error instanceof Error ? error.message : String(error)}`);
  console.log("Continuing with system environment variables...");
}

const app = new Application();
const router = new Router();

// API Key middleware
const API_KEY = Deno.env.get('API_KEY');
app.use(async (ctx, next) => {
  // Skip API key check for static files in development
  if (Deno.env.get("NODE_ENV") !== 'production' && ctx.request.url.pathname.startsWith('/dist')) {
    await next();
    return;
  }
  
  // Skip API key check for static files in production (served by Traefik)
  if (ctx.request.url.pathname === '/' || ctx.request.url.pathname.startsWith('/assets') || ctx.request.url.pathname.endsWith('.html') || ctx.request.url.pathname.endsWith('.css') || ctx.request.url.pathname.endsWith('.js')) {
    await next();
    return;
  }
  
  // Require API key for all API routes
  if (ctx.request.url.pathname.startsWith('/api')) {
    const providedKey = ctx.request.headers.get('x-api-key');
    const referer = ctx.request.headers.get('referer');
    const host = ctx.request.headers.get('host');
    
    // Check if request is from same origin (frontend)
    const isSameOrigin = referer && host && referer.includes(host);
    
    // Skip API key check for same-origin requests (from frontend)
    if (isSameOrigin) {
      await next();
      return;
    }
    
    // For cross-origin requests, require API key
    if (!API_KEY) {
      console.warn('API_KEY not set in environment - allowing all cross-origin requests (INSECURE)');
      await next();
      return;
    }
    
    if (providedKey !== API_KEY) {
      ctx.response.status = 401;
      ctx.response.body = { error: "Unauthorized: Invalid API key" };
      return;
    }
  }
  
  await next();
});

// Connect to MongoDB and setup models
await connectDB();

// API routes
router.get("/api", (ctx) => {
  ctx.response.body = { message: "Hello World" };
});

// Public JSON retrieval route
router.get("/api/jsons/:title.json", async (ctx) => {
  const title = ctx.params.title;
  if (!title) {
    ctx.response.status = 400;
    ctx.response.body = { error: "Title parameter is required" };
    return;
  }

  try {
    const item = await JsonEndpointModel.findOne({ title });
    if (!item) {
      ctx.response.status = 404;
      ctx.response.body = { error: "JSON not found" };
      return;
    }

    ctx.response.headers.set("Content-Type", "application/json");
    ctx.response.body = JSON.parse(item.json);
  } catch (error) {
    console.error("Error fetching JSON:", error);
    ctx.response.status = 500;
    ctx.response.body = { error: "Internal server error" };
  }
});

// Use RPC router
app.use(rpcRouter.routes());
app.use(rpcRouter.allowedMethods());

// Static file middleware for production
if (Deno.env.get("NODE_ENV") === "production") {
  router.get("/(.*)", async (ctx) => {
    const path = ctx.params[0];
    
    try {
      // Try to serve the file from dist directory
      await send(ctx, path, {
        root: `${Deno.cwd()}/dist`,
        index: "index.html",
      });
    } catch {
      // If file not found, serve index.html for client-side routing
      await send(ctx, "index.html", {
        root: `${Deno.cwd()}/dist`,
      });
    }
  });
}

app.use(router.routes());
app.use(router.allowedMethods());

const port = parseInt(Deno.env.get("PORT") || "3000");
console.log(`Server running on port ${port}`);
console.log(`Environment: ${Deno.env.get("NODE_ENV")||'Development'}`);

await app.listen({ port });
