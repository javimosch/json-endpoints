import { Router } from "oak";
import { JsonEndpointModel, validateJson } from "../models/JsonEndpoints.ts";

interface JsonItem {
  id?: string;
  title: string;
  json: string;
}

// Export function to get JSON items
export const getJsonItems = async () => {
  const items = await JsonEndpointModel.find();
  return items.map(item => ({
    id: item._id?.toString(),
    title: item.title,
    json: item.json
  }));
};

const router = new Router();

router.post("/api/rpc", async (ctx) => {
  // Check referer for localhost
  const referer = ctx.request.headers.get('referer');
  if (!referer || !referer.match(/^https?:\/\/localhost(:\d+)?/)) {
    ctx.response.status = 401;
    ctx.response.body = { error: "Unauthorized: Only localhost requests allowed" };
    return;
  }

  const body = await ctx.request.body().value;
  const { type, payload } = body;

  try {
    switch (type) {
      case "createUpdate": {
        const { title, json } = payload;
        
        // Validate JSON
        if (!await validateJson(json)) {
          ctx.response.status = 400;
          ctx.response.body = { error: "Invalid JSON format" };
          return;
        }

        if (!title) {
          ctx.response.status = 400;
          ctx.response.body = { error: "Title is required" };
          return;
        }

        if (payload.id) {
          // Update
          const updated = await JsonEndpointModel.findByIdAndUpdate(
            payload.id,
            { title, json },
            { new: true }
          );
          
          if (!updated) {
            ctx.response.status = 404;
            ctx.response.body = { error: "Item not found" };
            return;
          }
          
          ctx.response.body = {
            id: updated._id?.toString(),
            title: updated.title,
            json: updated.json
          };
          return;
        } else {
          // Create
          const newItem = await JsonEndpointModel.create({ title, json });
          ctx.response.body = {
            id: newItem._id?.toString(),
            title: newItem.title,
            json: newItem.json
          };
          return;
        }
      }
      
      case "remove": {
        const { id } = payload;
        const deleted = await JsonEndpointModel.findByIdAndDelete(id);
        
        if (!deleted) {
          ctx.response.status = 404;
          ctx.response.body = { error: "Item not found" };
          return;
        }
        
        ctx.response.body = { success: true };
        return;
      }

      case "readAll": {
        const items = await JsonEndpointModel.find();
        ctx.response.body = items.map(item => ({
          id: item._id?.toString(),
          title: item.title,
          json: item.json
        }));
        return;
      }

      default:
        ctx.response.status = 400;
        ctx.response.body = { error: "Invalid operation type" };
        return;
    }
  } catch (error) {
    console.error("RPC Error:", error);
    ctx.response.status = 500;
    ctx.response.body = { error: "Internal server error" };
    return;
  }
});

export default router;
