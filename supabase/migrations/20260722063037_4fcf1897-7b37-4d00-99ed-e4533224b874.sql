-- has_role only ever checks the caller's own row (has_role(auth.uid(), ...)),
-- and user_roles has a SELECT policy that lets authenticated users read their own roles.
-- Switching to SECURITY INVOKER removes the definer-bypass surface while keeping RLS working.
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- claim_first_admin must remain SECURITY DEFINER because authenticated users
-- have no INSERT privilege on user_roles by design. Tighten it so it is a
-- true no-op the moment any admin exists (already the case) and keep EXECUTE
-- restricted to authenticated only (revoke from PUBLIC/anon).
REVOKE ALL ON FUNCTION public.claim_first_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.claim_first_admin() TO authenticated;

-- Ensure has_role executable set is also minimal
REVOKE ALL ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;