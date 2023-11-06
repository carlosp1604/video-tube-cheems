export interface DateServiceInterface {
  formatAgoLike(isoDate: string, locale: string): string
  formatSecondsToHHMMSSFormat(seconds: number): string
  formatDateToDateMedFromIso(isoDate: string, locale: string): string
}
