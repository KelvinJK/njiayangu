import { createClient } from "@supabase/supabase-js";
import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import { PROGRAMMES } from "@/data/programmes";
import { INSTITUTIONS } from "@/data/institutions";

function supabaseForUser(ctx: ToolContext) {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export default defineTool({
  name: "list_saved_programmes",
  title: "List my saved programmes",
  description:
    "List the programmes the signed-in NjiaYangu user has bookmarked. Enriches each row with programme name, institution, location, deadline, and official source URL.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("saved_programmes")
      .select("programme_slug, created_at")
      .eq("user_id", ctx.getUserId())
      .order("created_at", { ascending: false });
    if (error) {
      return { content: [{ type: "text", text: error.message }], isError: true };
    }
    const rows = (data ?? []).map((r) => {
      const p = PROGRAMMES.find((x) => x.slug === r.programme_slug);
      if (!p) return { slug: r.programme_slug, savedAt: r.created_at, missing: true };
      const inst = INSTITUTIONS.find((i) => i.id === p.institutionId);
      const campus = inst?.campuses.find((c) => c.id === p.campusId);
      return {
        slug: p.slug,
        name: p.name.en,
        institution: inst?.name ?? p.institutionId,
        location: campus ? `${campus.name}, ${campus.region}` : "",
        category: p.category,
        heslbEligible: p.heslbEligible,
        applicationDeadline: p.applicationDeadline,
        sourceUrl: p.source.url,
        savedAt: r.created_at,
      };
    });
    return {
      content: [{ type: "text", text: JSON.stringify(rows, null, 2) }],
      structuredContent: { count: rows.length, saved: rows },
    };
  },
});
