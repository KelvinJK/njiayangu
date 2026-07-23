import { createClient } from "@supabase/supabase-js";
import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { PROGRAMMES } from "@/data/programmes";

function supabaseForUser(ctx: ToolContext) {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export default defineTool({
  name: "save_programme",
  title: "Bookmark a programme",
  description:
    "Bookmark a programme to the signed-in NjiaYangu user's saved list so it appears in their in-app Saved area.",
  inputSchema: {
    slug: z.string().describe("Programme slug to save."),
  },
  annotations: { readOnlyHint: false, idempotentHint: true, destructiveHint: false, openWorldHint: false },
  handler: async ({ slug }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    if (!PROGRAMMES.some((p) => p.slug === slug)) {
      return { content: [{ type: "text", text: `Unknown programme slug '${slug}'` }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    const { error } = await supabase
      .from("saved_programmes")
      .upsert(
        { user_id: ctx.getUserId(), programme_slug: slug },
        { onConflict: "user_id,programme_slug" },
      );
    if (error) {
      return { content: [{ type: "text", text: error.message }], isError: true };
    }
    return {
      content: [{ type: "text", text: `Saved '${slug}'.` }],
      structuredContent: { saved: true, slug },
    };
  },
});
