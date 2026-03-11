import { PostHog } from 'posthog-node'

export function getPostHogClient() {
  const isProd = process.env.NODE_ENV === 'production'
  const posthogClient = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    disabled: !isProd, // Disable tracking in non-prod environments
    flushAt: 1,
    flushInterval: 0,
  })
  return posthogClient
}
