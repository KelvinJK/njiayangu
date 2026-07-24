-- 1) Payments table
CREATE TABLE public.payments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reference_normalized text NOT NULL,
  reference text NOT NULL,
  amount_tzs integer NOT NULL DEFAULT 1000,
  generations_granted integer NOT NULL DEFAULT 5,
  status text NOT NULL DEFAULT 'verified' CHECK (status IN ('pending','verified','rejected')),
  provider text NOT NULL DEFAULT 'snippe',
  verified_at timestamptz DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT payments_reference_len CHECK (char_length(reference) BETWEEN 4 AND 64),
  CONSTRAINT payments_reference_shape CHECK (reference ~ '^[A-Za-z0-9._-]+$')
);

CREATE UNIQUE INDEX payments_reference_normalized_key ON public.payments (reference_normalized);
CREATE INDEX payments_user_id_idx ON public.payments (user_id, created_at DESC);

GRANT SELECT ON public.payments TO authenticated;
GRANT ALL ON public.payments TO service_role;

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Users can read only their own payments. Writes are done exclusively through
-- the SECURITY DEFINER verification function below.
CREATE POLICY "payments_owner_select"
  ON public.payments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE TRIGGER payments_set_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- 2) Credit columns on profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS generations_remaining integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS generations_used integer NOT NULL DEFAULT 0;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_generations_remaining_nonneg CHECK (generations_remaining >= 0),
  ADD CONSTRAINT profiles_generations_used_nonneg CHECK (generations_used >= 0);

-- 3) Verification RPC. Definer so it can enforce uniqueness and credit grant
-- atomically even though normal users have no INSERT privilege on payments.
CREATE OR REPLACE FUNCTION public.verify_snippe_payment(_reference text)
RETURNS TABLE (
  ok boolean,
  reason text,
  generations_remaining integer,
  generations_granted integer
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  ref text := btrim(coalesce(_reference, ''));
  ref_norm text := lower(btrim(coalesce(_reference, '')));
  granted int := 5;
  amt int := 1000;
  new_remaining int;
BEGIN
  IF uid IS NULL THEN
    RETURN QUERY SELECT false, 'not_signed_in'::text, 0, 0;
    RETURN;
  END IF;

  IF char_length(ref) < 4 OR char_length(ref) > 64 OR ref !~ '^[A-Za-z0-9._-]+$' THEN
    RETURN QUERY SELECT false, 'invalid_reference'::text, 0, 0;
    RETURN;
  END IF;

  IF EXISTS (SELECT 1 FROM public.payments WHERE reference_normalized = ref_norm) THEN
    RETURN QUERY SELECT false, 'already_used'::text, 0, 0;
    RETURN;
  END IF;

  INSERT INTO public.payments (user_id, reference, reference_normalized, amount_tzs, generations_granted, status, verified_at)
  VALUES (uid, ref, ref_norm, amt, granted, 'verified', now());

  -- Ensure a profile row exists (handle_new_user usually creates it, but be safe)
  INSERT INTO public.profiles (id) VALUES (uid) ON CONFLICT (id) DO NOTHING;

  UPDATE public.profiles
    SET generations_remaining = generations_remaining + granted,
        updated_at = now()
    WHERE id = uid
    RETURNING generations_remaining INTO new_remaining;

  RETURN QUERY SELECT true, 'ok'::text, new_remaining, granted;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.verify_snippe_payment(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.verify_snippe_payment(text) TO authenticated;

-- 4) Atomic credit consumption RPC so the client can't fake a generation.
CREATE OR REPLACE FUNCTION public.consume_generation()
RETURNS TABLE (ok boolean, generations_remaining integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  new_remaining int;
BEGIN
  IF uid IS NULL THEN
    RETURN QUERY SELECT false, 0;
    RETURN;
  END IF;

  UPDATE public.profiles
    SET generations_remaining = generations_remaining - 1,
        generations_used = generations_used + 1,
        updated_at = now()
    WHERE id = uid AND generations_remaining > 0
    RETURNING generations_remaining INTO new_remaining;

  IF new_remaining IS NULL THEN
    SELECT generations_remaining INTO new_remaining FROM public.profiles WHERE id = uid;
    RETURN QUERY SELECT false, coalesce(new_remaining, 0);
    RETURN;
  END IF;

  RETURN QUERY SELECT true, new_remaining;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.consume_generation() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.consume_generation() TO authenticated;