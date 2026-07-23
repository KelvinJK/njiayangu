import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import type { z } from "zod";

// Per-actor sliding-window rate limits (in seconds and max calls).
const RATE_WINDOW_SECONDS = 60;
const RATE_MAX_CALLS = 60; // 60 calls / minute / actor

type ToolInput = Record<string, z.ZodTypeAny>;
type ToolResult = {
  content: Array<{ type: "text"; text: string } | Record<string, unknown>>;
  structuredContent?: unknown;
  isError?: boolean;
};
type Handler<I extends ToolInput> = (
  input: { [K in keyof I]: z.infer<I[K]> },
  ctx: ToolContext,
) => Promise<ToolResult> | ToolResult;

type DefineToolInput<I extends ToolInput> = {
  name: string;
  title: string;
  description: string;
  inputSchema: I;
  annotations?: Record<string, unknown>;
  handler: Handler<I>;
};

function resolveActor(ctx: ToolContext): { actor: string; actor_type: "user" | "client" | "anon" } {
  if (ctx.isAuthenticated?.()) {
    const uid = ctx.getUserId?.();
    if (uid) return { actor: `user:${uid}`, actor_type: "user" };
  }
  const cid = ctx.getClientId?.();
  if (cid) return { actor: `client:${cid}`, actor_type: "client" };
  return { actor: "anon", actor_type: "anon" };
}

function classifyError(err: unknown): string {
  if (err instanceof Error) return err.name || "Error";
  return typeof err;
}

async function logCall(entry: {
  actor: string;
  actor_type: string;
  tool_name: string;
  status: "ok" | "error" | "rate_limited" | "unauthenticated";
  error_class: string | null;
  duration_ms: number;
}) {
  // Structured single-line JSON log for easy grepping in server-function logs.
  try {
    console.log(JSON.stringify({ evt: "mcp_tool_call", ts: new Date().toISOString(), ...entry }));
  } catch {
    /* noop */
  }
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("mcp_tool_calls").insert(entry);
  } catch (e) {
    console.warn("mcp_tool_calls insert failed", (e as Error)?.message);
  }
}

async function withinRateLimit(actor: string): Promise<boolean> {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin.rpc("mcp_check_rate_limit", {
      _actor: actor,
      _window_seconds: RATE_WINDOW_SECONDS,
      _max_calls: RATE_MAX_CALLS,
    });
    if (error) {
      console.warn("mcp_check_rate_limit failed, allowing call", error.message);
      return true;
    }
    return data === true;
  } catch (e) {
    console.warn("rate-limit check threw, allowing call", (e as Error)?.message);
    return true;
  }
}

export function instrumentTool<I extends ToolInput>(def: DefineToolInput<I>) {
  return defineTool({
    ...def,
    handler: async (input, ctx) => {
      const started = Date.now();
      const { actor, actor_type } = resolveActor(ctx);
      const allowed = await withinRateLimit(actor);
      if (!allowed) {
        const duration_ms = Date.now() - started;
        void logCall({
          actor,
          actor_type,
          tool_name: def.name,
          status: "rate_limited",
          error_class: null,
          duration_ms,
        });
        return {
          content: [
            {
              type: "text" as const,
              text: `Rate limit exceeded: max ${RATE_MAX_CALLS} calls per ${RATE_WINDOW_SECONDS}s. Please retry shortly.`,
            },
          ],
          isError: true,
        };
      }
      try {
        const result = (await def.handler(input, ctx)) as ToolResult;
        const duration_ms = Date.now() - started;
        void logCall({
          actor,
          actor_type,
          tool_name: def.name,
          status: result?.isError ? "error" : "ok",
          error_class: result?.isError ? "HandlerReturnedError" : null,
          duration_ms,
        });
        return result;
      } catch (err) {
        const duration_ms = Date.now() - started;
        const error_class = classifyError(err);
        void logCall({
          actor,
          actor_type,
          tool_name: def.name,
          status: "error",
          error_class,
          duration_ms,
        });
        throw err;
      }
    },
  } as DefineToolInput<I>);
}
