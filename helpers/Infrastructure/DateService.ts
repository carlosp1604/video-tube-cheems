import { DateServiceInterface } from '~/helpers/Domain/DateServiceInterface'
import { DateTime } from 'luxon'

export class DateService implements DateServiceInterface {
  public formatAgoLike (date: Date, locale: string): string {
    if (DateTime.now() < DateTime.fromJSDate(date)) {
      throw Error('Date to format must be less or equal to current date')
    }

    return DateTime.fromJSDate(date).toRelativeCalendar(
      {
        locale,
      }) ?? ''
  }

  public formatHugeDate (date: Date, locale: string): string {
    return DateTime.fromJSDate(date)
      .setLocale(locale)
      .toLocaleString(DateTime.DATETIME_MED)
  }

  public formatSecondsToHHMMSSFormat (seconds: number): string {
    if (seconds < 3600) {
      return new Date(seconds * 1000).toISOString().substring(14, 19)
    }

    return new Date(seconds * 1000).toISOString().substring(11, 19)
  }

  public formatDateToDateMedFromIso (isoDate: string, locale: string): string {
    return DateTime.fromISO(isoDate).setLocale(locale).toLocaleString(DateTime.DATE_MED)
  }
}
