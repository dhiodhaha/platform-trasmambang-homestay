import posthog from 'posthog-js'

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  api_host: '/ingest',
  ui_host: 'https://us.posthog.com',
  defaults: '2026-01-30',
  capture_exceptions: true,
  autocapture: process.env.NODE_ENV === 'production',
  debug: process.env.NODE_ENV === 'development',
  loaded: function (ph) {
    if (process.env.NODE_ENV === 'development') {
      ph.opt_out_capturing() // opts a user out of event capture
      ph.set_config({ disable_session_recording: true })
    }
  },
})
