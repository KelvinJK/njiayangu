import { instrument } from "../instrument";
import { createClient } from "@supabase/supabase-js";
import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import { z } from "zod";

function supabaseForUser(ctx: ToolContext) {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export default defineTool({
  name: "remove_saved_programme",
  title: "Remove a saved programme",
  description: "Remove a programme from the signed-in NjiaYangu user's saved list.",
  inputSchema: {
    slug: z.string().describe("Programme slug to unsave."),
  },
  annotations: { readOnlyHint: false, idempotentHint: true, destructiveHint: true, openWorldHint: false },
  handler: instrument("remove_saved_programme", async ({ slug }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    const { error } = await supabase
      .from("saved_programmes")
      .delete()
      .eq("user_id", ctx.getUserId())
      .eq("programme_slug", slug);
    if (error) {
      return { content: [{ type: "text", text: error.message }], isError: true };
    }
    return {
      content: [{ type: "text", text: `Removed '${slug}'.` }],
      structuredContent: { removed: true, slug },
    };
  }),
});
