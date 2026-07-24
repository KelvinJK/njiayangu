import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import type { StudentAcademics, StudentPreferences } from "./eligibility";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./auth";

const KEY_PROFILE = "nj.profile";
const KEY_SAVED = "nj.saved";
const KEY_COMPARE = "nj.compare";
const KEY_HESLB = "nj.heslb";
const KEY_DIRTY = "nj.dirty";

export interface PaymentRecord {
  reference: string;
  at: string;
  amount: number;
  generationsGranted: number;
}

export interface StudentProfile {
  academics?: StudentAcademics;
  preferences?: StudentPreferences;
  fullName?: string;
  phone?: string;
  region?: string;
  searchAttempts?: number;
  /** Legacy flag kept for backwards compat; no longer read by the UI. */
  hasPaid?: boolean;
  /** Number of remaining programme-match generations the user has paid for. */
  generationsRemaining?: number;
  /** Total number of generations ever run by this user. */
  generationsUsed?: number;
  /** Log of Snippe payment references submitted by the user. */
  paymentHistory?: PaymentRecord[];
}

export const PAYMENT_AMOUNT_TZS = 1000;
export const GENERATIONS_PER_PAYMENT = 5;

export type HeslbStatus = "ready" | "missing" | "verify" | "na";
export type SyncStatus = "offline" | "idle" | "syncing" | "synced" | "error" | "signed-out";

interface StoreCtx {
  profile: StudentProfile;
  setProfile: (p: StudentProfile) => void;
  saved: string[];
  toggleSaved: (id: string) => void;
  compare: string[];
  toggleCompare: (id: string) => void;
  clearCompare: () => void;
  heslb: Record<string, HeslbStatus>;
  setHeslb: (id: string, v: HeslbStatus) => void;
  syncStatus: SyncStatus;
  online: boolean;
  lastSyncedAt: number | null;
  sync: () => Promise<void>;
  incrementAttempts: () => void;
  resetAttempts: () => void;
  /** @deprecated use redeemPayment(reference) */
  markPaid: () => void;
  /** Redeem a Snippe payment reference. Grants GENERATIONS_PER_PAYMENT more runs. */
  redeemPayment: (reference: string) => { ok: true } | { ok: false; reason: string };
  /** Consume one generation. Returns true if allowed, false if the user is out. */
  consumeGeneration: () => boolean;
}

const Ctx = createContext<StoreCtx | null>(null);

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try { window.localStorage.setItem(key, JSON.stringify(value)); } catch { /* quota */ }
}

function markDirty() { writeJSON(KEY_DIRTY, true); }
function clearDirty() { writeJSON(KEY_DIRTY, false); }

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [profile, setProfileState] = useState<StudentProfile>({});
  const [saved, setSaved] = useState<string[]>([]);
  const [compare, setCompare] = useState<string[]>([]);
  const [heslb, setHeslbState] = useState<Record<string, HeslbStatus>>({});
  const [online, setOnline] = useState(typeof navigator === "undefined" ? true : navigator.onLine);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("signed-out");
  const [lastSyncedAt, setLastSyncedAt] = useState<number | null>(null);
  const syncTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stateRef = useRef({ profile, saved, heslb });
  stateRef.current = { profile, saved, heslb };

  // Hydrate from localStorage
  useEffect(() => {
    setProfileState(readJSON<StudentProfile>(KEY_PROFILE, {}));
    setSaved(readJSON<string[]>(KEY_SAVED, []));
    setCompare(readJSON<string[]>(KEY_COMPARE, []));
    setHeslbState(readJSON<Record<string, HeslbStatus>>(KEY_HESLB, {}));
  }, []);

  // Online / offline listeners
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onOn = () => setOnline(true);
    const onOff = () => setOnline(false);
    window.addEventListener("online", onOn);
    window.addEventListener("offline", onOff);
    return () => {
      window.removeEventListener("online", onOn);
      window.removeEventListener("offline", onOff);
    };
  }, []);

  // Push everything to server (idempotent upserts)
  const pushToServer = useCallback(async () => {
    if (!user) return;
    setSyncStatus("syncing");
    try {
      const { profile: p, saved: s, heslb: h } = stateRef.current;
      const profileRow = {
        id: user.id,
        full_name: p.fullName ?? null,
        phone: p.phone ?? null,
        region: p.region ?? null,
        combination_code: p.academics?.combinationCode ?? null,
        subject_grades: p.academics?.grades ?? {},
        o_level_grades: p.academics?.oLevel ?? {},
        preferred_campuses: p.preferences?.preferredRegions ?? [],
        preferred_careers: p.preferences?.careerInterests ?? [],
        last_synced_at: new Date().toISOString(),
      };
      const { error: pe } = await supabase.from("profiles").upsert(profileRow, { onConflict: "id" });
      if (pe) throw pe;

      // Saved: reconcile — fetch existing then insert new / delete removed
      const { data: existingSaved } = await supabase
        .from("saved_programmes")
        .select("programme_slug")
        .eq("user_id", user.id);
      const have = new Set((existingSaved ?? []).map((r: { programme_slug: string }) => r.programme_slug));
      const want = new Set(s);
      const toAdd = [...want].filter((x) => !have.has(x));
      const toRemove = [...have].filter((x) => !want.has(x));
      if (toAdd.length > 0) {
        const { error } = await supabase
          .from("saved_programmes")
          .insert(toAdd.map((slug) => ({ user_id: user.id, programme_slug: slug })));
        if (error) throw error;
      }
      if (toRemove.length > 0) {
        const { error } = await supabase
          .from("saved_programmes")
          .delete()
          .eq("user_id", user.id)
          .in("programme_slug", toRemove);
        if (error) throw error;
      }

      // HESLB progress: upsert each
      const rows = Object.entries(h).map(([item_id, status]) => ({ user_id: user.id, item_id, status }));
      if (rows.length > 0) {
        const { error } = await supabase
          .from("heslb_progress")
          .upsert(rows, { onConflict: "user_id,item_id" });
        if (error) throw error;
      }

      clearDirty();
      setLastSyncedAt(Date.now());
      setSyncStatus("synced");
    } catch {
      markDirty();
      setSyncStatus("error");
    }
  }, [user]);

  // Pull server -> merge into local (server wins for profile; unions for sets)
  const pullFromServer = useCallback(async () => {
    if (!user) return;
    setSyncStatus("syncing");
    try {
      const [{ data: p }, { data: s }, { data: h }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
        supabase.from("saved_programmes").select("programme_slug").eq("user_id", user.id),
        supabase.from("heslb_progress").select("item_id,status").eq("user_id", user.id),
      ]);

      // Merge profile: local pending changes win if dirty, else server wins
      const dirty = readJSON<boolean>(KEY_DIRTY, false);
      const localP = stateRef.current.profile;
      if (p && !dirty) {
        const serverProfile: StudentProfile = {
          fullName: p.full_name ?? undefined,
          phone: p.phone ?? undefined,
          region: p.region ?? undefined,
          academics: p.combination_code
            ? {
                combinationCode: p.combination_code as string,
                grades: (p.subject_grades ?? {}) as StudentAcademics["grades"],
                oLevel: (p.o_level_grades ?? {}) as StudentAcademics["oLevel"],
              }
            : localP.academics,
          preferences: {
            careerInterests: (p.preferred_careers ?? []) as string[],
            preferredRegions: (p.preferred_campuses ?? []) as string[],
            institutionType: "any",
            willingToRelocate: true,
            needsFinancing: false,
          },
        };
        setProfileState(serverProfile);
        writeJSON(KEY_PROFILE, serverProfile);
      }

      // Union saved
      const serverSaved = (s ?? []).map((r: { programme_slug: string }) => r.programme_slug);
      const mergedSaved = Array.from(new Set([...(stateRef.current.saved), ...serverSaved]));
      setSaved(mergedSaved);
      writeJSON(KEY_SAVED, mergedSaved);

      // HESLB: server wins per-item unless local dirty
      const serverH: Record<string, HeslbStatus> = {};
      for (const row of h ?? []) serverH[row.item_id] = row.status as HeslbStatus;
      const mergedH = dirty
        ? { ...serverH, ...stateRef.current.heslb }
        : { ...stateRef.current.heslb, ...serverH };
      setHeslbState(mergedH);
      writeJSON(KEY_HESLB, mergedH);

      if (dirty) {
        await pushToServer();
      } else {
        setLastSyncedAt(Date.now());
        setSyncStatus("synced");
      }
    } catch {
      setSyncStatus("error");
    }
  }, [user, pushToServer]);

  // On auth change: pull
  useEffect(() => {
    if (!user) {
      setSyncStatus("signed-out");
      return;
    }
    if (!online) {
      setSyncStatus("offline");
      return;
    }
    void pullFromServer();
  }, [user, online, pullFromServer]);

  // Flush when coming online
  useEffect(() => {
    if (!user) return;
    if (!online) { setSyncStatus("offline"); return; }
    const dirty = readJSON<boolean>(KEY_DIRTY, false);
    if (dirty) void pushToServer();
  }, [online, user, pushToServer]);

  // Debounced write-behind
  const scheduleSync = useCallback(() => {
    markDirty();
    if (!user) return;
    if (!online) { setSyncStatus("offline"); return; }
    setSyncStatus("idle");
    if (syncTimer.current) clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(() => { void pushToServer(); }, 800);
  }, [user, online, pushToServer]);

  const setProfile = useCallback((p: StudentProfile) => {
    setProfileState(p);
    writeJSON(KEY_PROFILE, p);
    scheduleSync();
  }, [scheduleSync]);

  const toggleSaved = useCallback((id: string) => {
    setSaved((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      writeJSON(KEY_SAVED, next);
      return next;
    });
    scheduleSync();
  }, [scheduleSync]);

  const toggleCompare = useCallback((id: string) => {
    setCompare((prev) => {
      let next: string[];
      if (prev.includes(id)) next = prev.filter((x) => x !== id);
      else if (prev.length >= 5) next = prev;
      else next = [...prev, id];
      writeJSON(KEY_COMPARE, next);
      return next;
    });
  }, []);

  const clearCompare = useCallback(() => {
    setCompare([]);
    writeJSON(KEY_COMPARE, []);
  }, []);

  const setHeslb = useCallback((id: string, v: HeslbStatus) => {
    setHeslbState((prev) => {
      const next = { ...prev, [id]: v };
      writeJSON(KEY_HESLB, next);
      return next;
    });
    scheduleSync();
  }, [scheduleSync]);

  const incrementAttempts = useCallback(() => {
    setProfileState((prev) => {
      const next = { ...prev, searchAttempts: (prev.searchAttempts ?? 0) + 1 };
      writeJSON(KEY_PROFILE, next);
      return next;
    });
  }, []);

  const resetAttempts = useCallback(() => {
    setProfileState((prev) => {
      const next = { ...prev, searchAttempts: 0 };
      writeJSON(KEY_PROFILE, next);
      return next;
    });
  }, []);

  const markPaid = useCallback(() => {
    setProfileState((prev) => {
      const next = { ...prev, hasPaid: true };
      writeJSON(KEY_PROFILE, next);
      return next;
    });
  }, []);

  const sync = useCallback(async () => {
    if (!user || !online) return;
    await pushToServer();
  }, [user, online, pushToServer]);

  return (
    <Ctx.Provider
      value={{
        profile, setProfile,
        saved, toggleSaved,
        compare, toggleCompare, clearCompare,
        heslb, setHeslb,
        syncStatus, online, lastSyncedAt, sync,
        incrementAttempts, resetAttempts, markPaid,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useStore() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useStore must be used inside AppStoreProvider");
  return c;
}
