import { auth, defineMcp } from "@lovable.dev/mcp-js";
import searchProgrammes from "./tools/search-programmes";
import getProgramme from "./tools/get-programme";
import checkEligibility from "./tools/check-eligibility";
import listSavedProgrammes from "./tools/list-saved-programmes";
import saveProgramme from "./tools/save-programme";
import removeSavedProgramme from "./tools/remove-saved-programme";
import getHeslbChecklist from "./tools/get-heslb-checklist";
import updateHeslbItem from "./tools/update-heslb-item";
import listCareers from "./tools/list-careers";
import whoami from "./tools/whoami";

// The OAuth issuer must be the direct Supabase host, not the .lovable.cloud
// proxy. VITE_SUPABASE_PROJECT_ID is inlined at build time by Vite.
const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "njiayangu",
  title: "NjiaYangu",
  version: "0.1.0",
  instructions:
    "NjiaYangu is a Tanzanian Form Six leavers' guide. Tools let assistants search undergraduate programmes, run the deterministic admission-eligibility engine, manage the signed-in student's saved programmes, and track their HESLB loan-application checklist. Read-only tools work without login; per-user tools require Supabase OAuth sign-in and act as that student under row-level security.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [
    searchProgrammes,
    getProgramme,
    checkEligibility,
    listCareers,
    whoami,
    listSavedProgrammes,
    saveProgramme,
    removeSavedProgramme,
    getHeslbChecklist,
    updateHeslbItem,
  ],
});
