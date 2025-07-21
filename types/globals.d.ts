export {}

declare global {
  interface Window {
    aclib?: {
      runBanner: (options: { zoneId: string }) => void
      runInterstitial: (options: { zoneId: string }) => void
      runPop: (options: { zoneId: string }) => void
    }
    ugimay?: (code: number) => void
  }
}
