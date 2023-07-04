export interface DateServiceInterface {
  formatAgoLike(date: Date, locale: string): string
  formatSecondsToHHMMSSFormat(seconds: number): string
  formatDateToDateMedFromIso(isoDate: string, locale: string): string
}
