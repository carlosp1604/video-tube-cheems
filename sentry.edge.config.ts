import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: 'https://89ee6d911be955f2d89274bfec92eb82@o4507147065098240.ingest.de.sentry.io/4507147066736720',

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,

  // ...

  // Note: if you want to override the automatic release value, do not set a
  // `release` value here - use the environment variable `SENTRY_RELEASE`, so
  // that it will also get attached to your source maps
})
