
-- Lock down SECURITY DEFINER functions: revoke public execution, grant only where needed
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.tg_set_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
REVOKE EXECUTE ON FUNCTION public.claim_first_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.claim_first_admin() TO authenticated;

-- Harden feedback table with length/format constraints to limit abuse of open INSERT policy
ALTER TABLE public.feedback
  ADD CONSTRAINT feedback_name_len CHECK (char_length(name) BETWEEN 1 AND 100),
  ADD CONSTRAINT feedback_email_len CHECK (char_length(email) BETWEEN 3 AND 255),
  ADD CONSTRAINT feedback_email_fmt CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  ADD CONSTRAINT feedback_message_len CHECK (char_length(message) BETWEEN 1 AND 4000),
  ADD CONSTRAINT feedback_category_allowed CHECK (category IN ('general','bug','feature','account','data','other')),
  ADD CONSTRAINT feedback_status_allowed CHECK (status IN ('new','in_progress','resolved','spam')),
  ADD CONSTRAINT feedback_admin_notes_len CHECK (admin_notes IS NULL OR char_length(admin_notes) <= 4000),
  ADD CONSTRAINT feedback_user_agent_len CHECK (user_agent IS NULL OR char_length(user_agent) <= 500);

-- Tighten insert policy: keep public but disallow submitting on behalf of another authenticated user
DROP POLICY IF EXISTS "anyone can submit feedback" ON public.feedback;
CREATE POLICY "anyone can submit feedback"
  ON public.feedback FOR INSERT
  TO anon, authenticated
  WITH CHECK (user_id IS NULL OR user_id = auth.uid());

-- Explicit deny-by-omission for user_roles writes (RLS already blocks; add clarity)
COMMENT ON TABLE public.user_roles IS 'Role assignments. No INSERT/UPDATE/DELETE policies by design — modified only via SECURITY DEFINER functions or service_role.';
