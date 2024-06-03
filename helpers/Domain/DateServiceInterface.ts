export interface DateServiceInterface {
  getCurrentDayWithoutTime(): Date
  getCurrentMonthFirstDay(): Date
  getCurrentWeekFirstDay(): Date
  formatAgoLike(isoDate: string, locale: string): string
  formatSecondsToHHMMSSFormat(seconds: number): string
  formatDateToDateMedFromIso(isoDate: string, locale: string): string
}
