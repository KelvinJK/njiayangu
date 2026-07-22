import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { StudentAcademics, StudentPreferences } from "./eligibility";

const KEY_PROFILE = "nj.profile";
const KEY_SAVED = "nj.saved";
const KEY_COMPARE = "nj.compare";
const KEY_HESLB = "nj.heslb";

export interface StudentProfile {
  academics?: StudentAcademics;
  preferences?: StudentPreferences;
}

interface StoreCtx {
  profile: StudentProfile;
  setProfile: (p: StudentProfile) => void;
  saved: string[];
  toggleSaved: (id: string) => void;
  compare: string[];
  toggleCompare: (id: string) => void;
  clearCompare: () => void;
  heslb: Record<string, "ready" | "missing" | "verify" | "na">;
  setHeslb: (id: string, v: "ready" | "missing" | "verify" | "na") => void;
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

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileState] = useState<StudentProfile>({});
  const [saved, setSaved] = useState<string[]>([]);
  const [compare, setCompare] = useState<string[]>([]);
  const [heslb, setHeslbState] = useState<Record<string, "ready" | "missing" | "verify" | "na">>({});

  useEffect(() => {
    setProfileState(readJSON<StudentProfile>(KEY_PROFILE, {}));
    setSaved(readJSON<string[]>(KEY_SAVED, []));
    setCompare(readJSON<string[]>(KEY_COMPARE, []));
    setHeslbState(readJSON(KEY_HESLB, {}));
  }, []);

  const setProfile = useCallback((p: StudentProfile) => {
    setProfileState(p);
    window.localStorage.setItem(KEY_PROFILE, JSON.stringify(p));
  }, []);

  const toggleSaved = useCallback((id: string) => {
    setSaved((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      window.localStorage.setItem(KEY_SAVED, JSON.stringify(next));
      return next;
    });
  }, []);

  const toggleCompare = useCallback((id: string) => {
    setCompare((prev) => {
      let next: string[];
      if (prev.includes(id)) next = prev.filter((x) => x !== id);
      else if (prev.length >= 5) next = prev; // cap 5
      else next = [...prev, id];
      window.localStorage.setItem(KEY_COMPARE, JSON.stringify(next));
      return next;
    });
  }, []);

  const clearCompare = useCallback(() => {
    setCompare([]);
    window.localStorage.setItem(KEY_COMPARE, JSON.stringify([]));
  }, []);

  const setHeslb = useCallback((id: string, v: "ready" | "missing" | "verify" | "na") => {
    setHeslbState((prev) => {
      const next = { ...prev, [id]: v };
      window.localStorage.setItem(KEY_HESLB, JSON.stringify(next));
      return next;
    });
  }, []);

  return (
    <Ctx.Provider value={{ profile, setProfile, saved, toggleSaved, compare, toggleCompare, clearCompare, heslb, setHeslb }}>
      {children}
    </Ctx.Provider>
  );
}

export function useStore() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useStore must be used inside AppStoreProvider");
  return c;
}
