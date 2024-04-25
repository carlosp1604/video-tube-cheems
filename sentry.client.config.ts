import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: 'https://89ee6d911be955f2d89274bfec92eb82@o4507147065098240.ingest.de.sentry.io/4507147066736720',
  // Replay may only be enabled for the client-side
  integrations: [
    Sentry.replayIntegration(),
    Sentry.captureConsoleIntegration({
    // array of methods that should be captured
    // defaults to ['log', 'info', 'warn', 'error', 'debug', 'assert']
      levels: ['error'],
    }),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,

  // Capture Replay for 10% of all sessions,
  // plus for 100% of sessions with an error
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  // ...

  // Note: if you want to override the automatic release value, do not set a
  // `release` value here - use the environment variable `SENTRY_RELEASE`, so
  // that it will also get attached to your source maps
})
