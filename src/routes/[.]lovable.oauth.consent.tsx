import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

// Minimal typed wrapper around the beta supabase.auth.oauth namespace so
// TypeScript can see the three methods we call.
type OAuthDetails = {
  client?: { name?: string; redirect_uri?: string; scopes?: string[] };
  scopes?: string[];
  redirect_url?: string;
  redirect_to?: string;
};
type OAuthClient = {
  getAuthorizationDetails: (id: string) => Promise<{ data: OAuthDetails | null; error: { message: string } | null }>;
  approveAuthorization: (id: string) => Promise<{ data: OAuthDetails | null; error: { message: string } | null }>;
  denyAuthorization: (id: string) => Promise<{ data: OAuthDetails | null; error: { message: string } | null }>;
};
const supabaseAuthOAuth = (): OAuthClient =>
  (supabase.auth as unknown as { oauth: OAuthClient }).oauth;

export const Route = createFileRoute("/.lovable/oauth/consent")({
  ssr: false,
  validateSearch: (s: Record<string, unknown>) => ({
    authorization_id: typeof s.authorization_id === "string" ? s.authorization_id : "",
  }),
  beforeLoad: async ({ search, location }) => {
    if (!search.authorization_id) throw new Error("Missing authorization_id");
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      const next = location.pathname + location.searchStr;
      throw redirect({ to: "/auth", search: { next } });
    }
  },
  loader: async ({ location }) => {
    const authorizationId = new URLSearchParams(location.search).get("authorization_id")!;
    const { data, error } = await supabaseAuthOAuth().getAuthorizationDetails(authorizationId);
    if (error) throw new Error(error.message);
    const immediate = data?.redirect_url ?? data?.redirect_to;
    if (immediate && !data?.client) throw redirect({ href: immediate });
    return data;
  },
  component: ConsentPage,
  errorComponent: ({ error }) => (
    <main className="mx-auto max-w-md p-8">
      <h1 className="text-xl font-semibold mb-2">Could not load this authorization request</h1>
      <p className="text-sm text-muted-foreground">{String((error as Error)?.message ?? error)}</p>
    </main>
  ),
});

function ConsentPage() {
  const details = Route.useLoaderData();
  const { authorization_id } = Route.useSearch();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function decide(approve: boolean) {
    setBusy(true);
    setError(null);
    const oauth = supabaseAuthOAuth();
    const { data, error } = approve
      ? await oauth.approveAuthorization(authorization_id)
      : await oauth.denyAuthorization(authorization_id);
    if (error) {
      setBusy(false);
      setError(error.message);
      return;
    }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setBusy(false);
      setError("No redirect returned by the authorization server.");
      return;
    }
    window.location.href = target;
  }

  const clientName = details?.client?.name ?? "an app";
  const scopes = details?.client?.scopes ?? details?.scopes ?? [];

  return (
    <main className="mx-auto max-w-md p-6 md:p-10">
      <div className="rounded-2xl border bg-surface p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Connect {clientName} to NjiaYangu</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This lets {clientName} use NjiaYangu as you — searching programmes, checking eligibility, and managing your
          saved programmes and HESLB checklist on your behalf.
        </p>
        {details?.client?.redirect_uri && (
          <p className="mt-3 text-xs text-muted-foreground break-all">
            Redirect URI: <span className="font-mono">{details.client.redirect_uri}</span>
          </p>
        )}
        {scopes.length > 0 && (
          <div className="mt-4">
            <p className="text-xs font-medium text-muted-foreground">Requested permissions</p>
            <ul className="mt-1 list-disc pl-5 text-sm">
              {scopes.map((s: string) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        )}
        <p className="mt-4 text-xs text-muted-foreground">
          This does not bypass NjiaYangu's row-level security. Admin-only tools remain admin-only.
        </p>
        {error && (
          <p role="alert" className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}
        <div className="mt-6 flex gap-2">
          <Button onClick={() => decide(true)} disabled={busy} className="flex-1">
            Approve
          </Button>
          <Button onClick={() => decide(false)} disabled={busy} variant="outline" className="flex-1">
            Cancel connection
          </Button>
        </div>
      </div>
    </main>
  );
}
