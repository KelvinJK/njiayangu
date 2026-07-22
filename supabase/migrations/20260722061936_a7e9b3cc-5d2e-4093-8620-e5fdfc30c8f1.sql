
CREATE OR REPLACE FUNCTION public.feedback_autoflag_spam()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  msg text := coalesce(NEW.message, '');
  nm  text := coalesce(NEW.name, '');
  em  text := coalesce(NEW.email, '');
  low text := lower(msg);
  score int := 0;
  url_count int := 0;
  letter_count int := 0;
  upper_count int := 0;
  recent_count int := 0;
BEGIN
  -- Only auto-classify newly submitted rows
  IF NEW.status IS DISTINCT FROM 'new' THEN
    RETURN NEW;
  END IF;

  -- 1) URL / link density
  url_count := (length(low) - length(replace(low, 'http', ''))) / 4
             + (length(low) - length(replace(low, 'www.', ''))) / 4;
  IF url_count >= 1 THEN score := score + 2; END IF;
  IF url_count >= 3 THEN score := score + 3; END IF;

  -- 2) Known spam keywords (case-insensitive)
  IF low ~ '(viagra|cialis|casino|crypto|bitcoin|forex|loan offer|seo service|backlink|porn|xxx|escort|hookup|nude|onlyfans|telegram\s*@|whatsapp\s*\+?\d|earn \$|make money|work from home|click here|buy now|free money|investment opportunity|guaranteed win|lottery|prince|inheritance)' THEN
    score := score + 4;
  END IF;

  -- 3) Very short or empty-ish messages
  IF char_length(btrim(msg)) < 15 THEN score := score + 2; END IF;
  IF char_length(btrim(msg)) < 5  THEN score := score + 3; END IF;

  -- 4) Excessive repetition (aaaaaa, !!!!!, etc.)
  IF msg ~ '(.)\1{6,}' THEN score := score + 3; END IF;

  -- 5) Shouting: >70% uppercase letters in a long-ish message
  letter_count := length(regexp_replace(msg, '[^A-Za-z]', '', 'g'));
  upper_count  := length(regexp_replace(msg, '[^A-Z]', '', 'g'));
  IF letter_count >= 20 AND upper_count::numeric / letter_count > 0.7 THEN
    score := score + 2;
  END IF;

  -- 6) Disposable / suspicious email domains
  IF em ~* '@(mailinator|tempmail|10minutemail|guerrillamail|yopmail|trashmail|sharklasers|discard\.email|getnada|maildrop)\.' THEN
    score := score + 3;
  END IF;

  -- 7) Name looks like a URL or contains digits-heavy pattern
  IF nm ~* '(http|www\.|\.com|\.ru|\.xyz)' THEN score := score + 3; END IF;
  IF length(regexp_replace(nm, '[^0-9]', '', 'g')) >= 4 THEN score := score + 1; END IF;

  -- 8) Name equals email local-part exactly and message is very short
  IF lower(nm) = split_part(lower(em), '@', 1) AND char_length(msg) < 30 THEN
    score := score + 1;
  END IF;

  -- 9) Flood control — >3 submissions from same email in last 10 minutes
  SELECT count(*) INTO recent_count
  FROM public.feedback
  WHERE lower(email) = lower(em)
    AND created_at > now() - interval '10 minutes';
  IF recent_count >= 3 THEN score := score + 4; END IF;

  -- 10) BBCode / HTML injection markers
  IF low ~ '(<a\s|</a>|\[url=|\[/url\]|<script)' THEN score := score + 4; END IF;

  -- Classify
  IF score >= 6 THEN
    NEW.status := 'spam';
    NEW.admin_notes := coalesce(NEW.admin_notes || E'\n', '')
      || '[auto] flagged as spam (score=' || score
      || ', urls=' || url_count || ') on ' || now()::text;
  ELSIF score >= 3 THEN
    -- Keep visible but mark for review
    NEW.admin_notes := coalesce(NEW.admin_notes || E'\n', '')
      || '[auto] suspicious (score=' || score
      || ', urls=' || url_count || ') on ' || now()::text;
  END IF;

  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.feedback_autoflag_spam() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trg_feedback_autoflag_spam ON public.feedback;
CREATE TRIGGER trg_feedback_autoflag_spam
BEFORE INSERT ON public.feedback
FOR EACH ROW EXECUTE FUNCTION public.feedback_autoflag_spam();
