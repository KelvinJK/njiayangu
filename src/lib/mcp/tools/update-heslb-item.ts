import { createClient } from "@supabase/supabase-js";
import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { HESLB_CHECKLIST } from "@/data/heslb";

function supabaseForUser(ctx: ToolContext) {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export default defineTool({
  name: "update_heslb_item",
  title: "Update a HESLB checklist item",
  description: "Mark a HESLB checklist item as done or not-done for the signed-in NjiaYangu user.",
  inputSchema: {
    itemId: z.string().describe("Checklist item id."),
    done: z.boolean().describe("New done state."),
  },
  annotations: { readOnlyHint: false, idempotentHint: true, destructiveHint: false, openWorldHint: false },
  handler: async ({ itemId, done }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    if (!HESLB_CHECKLIST.some((c) => c.id === itemId)) {
      return { content: [{ type: "text", text: `Unknown checklist item '${itemId}'` }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    const { error } = await supabase
      .from("heslb_progress")
      .upsert(
        { user_id: ctx.getUserId(), checklist_item: itemId, done },
        { onConflict: "user_id,checklist_item" },
      );
    if (error) {
      return { content: [{ type: "text", text: error.message }], isError: true };
    }
    return {
      content: [{ type: "text", text: `Set ${itemId} = ${done}.` }],
      structuredContent: { itemId, done },
    };
  },
});
