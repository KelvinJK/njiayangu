import { createClient } from "@supabase/supabase-js";
import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import { HESLB_CHECKLIST, HESLB_ACADEMIC_YEAR, HESLB_STEPS, HESLB_MISTAKES } from "@/data/heslb";

function supabaseForUser(ctx: ToolContext) {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export default defineTool({
  name: "get_heslb_checklist",
  title: "Get HESLB checklist",
  description:
    "Return the HESLB loan-application checklist with per-item status for the signed-in NjiaYangu user (done / not done), plus the current academic year, key steps, and common mistakes.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("heslb_progress")
      .select("checklist_item, done")
      .eq("user_id", ctx.getUserId());
    if (error) {
      return { content: [{ type: "text", text: error.message }], isError: true };
    }
    const done = new Set((data ?? []).filter((r) => r.done).map((r) => r.checklist_item));
    const items = HESLB_CHECKLIST.map((c) => ({
      id: c.id,
      label: c.label.en,
      required: c.required,
      done: done.has(c.id),
    }));
    const summary = {
      academicYear: HESLB_ACADEMIC_YEAR,
      completed: items.filter((i) => i.done).length,
      total: items.length,
      items,
      steps: HESLB_STEPS.map((s) => s.en),
      commonMistakes: HESLB_MISTAKES.map((m) => m.en),
    };
    return {
      content: [{ type: "text", text: JSON.stringify(summary, null, 2) }],
      structuredContent: summary,
    };
  },
});
