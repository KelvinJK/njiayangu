import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'

if (typeof window !== 'undefined') {
  const posthogKey = import.meta.env.VITE_POSTHOG_KEY || 'phc_oRwfTSQhKdg7NC0OcBK9sGKuRRZEzWfdS892rZ6GF62';
  const posthogHost = import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com';

  if (posthogKey && posthogHost) {
    posthog.init(posthogKey, {
      api_host: posthogHost,
      person_profiles: 'identified_only', // or 'always' to create profiles for anonymous users as well
      capture_pageview: false // Disable automatic pageview capture, as we capture manually
    })
  } else {
    console.warn("PostHog environment variables (VITE_POSTHOG_KEY or VITE_POSTHOG_HOST) are missing. Analytics will be disabled.");
  }
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return <PHProvider client={posthog}>{children}</PHProvider>
}
