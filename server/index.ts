import { load } from "dotenv";
import { Application, Router, send } from "oak";
import rpcRouter from "./routes/rpc.ts";
import { getJsonItems } from "./routes/rpc.ts";
import { connectDB } from "./utils/db.ts";
import { JsonEndpointModel } from "./models/JsonEndpoints.ts";

// Load environment variables from .env file
await load({ export: true });

const app = new Application();
const router = new Router();

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
