
CREATE TABLE public.mcp_tool_calls (
  id BIGSERIAL PRIMARY KEY,
  actor TEXT NOT NULL,
  actor_type TEXT NOT NULL CHECK (actor_type IN ('user','client','anon')),
  tool_name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('ok','error','rate_limited','unauthenticated')),
  error_class TEXT,
  duration_ms INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX mcp_tool_calls_actor_created_idx ON public.mcp_tool_calls (actor, created_at DESC);
CREATE INDEX mcp_tool_calls_created_idx ON public.mcp_tool_calls (created_at DESC);

GRANT ALL ON public.mcp_tool_calls TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.mcp_tool_calls_id_seq TO service_role;

ALTER TABLE public.mcp_tool_calls ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view MCP call log"
  ON public.mcp_tool_calls
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

GRANT SELECT ON public.mcp_tool_calls TO authenticated;

CREATE OR REPLACE FUNCTION public.mcp_check_rate_limit(
  _actor TEXT,
  _window_seconds INTEGER,
  _max_calls INTEGER
) RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT (
    SELECT COUNT(*) FROM public.mcp_tool_calls
    WHERE actor = _actor
      AND created_at > now() - make_interval(secs => _window_seconds)
  ) < _max_calls;
$$;

REVOKE ALL ON FUNCTION public.mcp_check_rate_limit(TEXT, INTEGER, INTEGER) FROM PUBLIC, anon, authenticated;
