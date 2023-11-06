import { DateServiceInterface } from '~/helpers/Domain/DateServiceInterface'
import { DateTime } from 'luxon'

export class DateService implements DateServiceInterface {
  public formatAgoLike (isoDate: string, locale: string): string {
    if (DateTime.now() < DateTime.fromISO(isoDate)) {
      throw Error('Date to format must be less or equal to current date')
    }

    return DateTime.fromISO(isoDate).toRelativeCalendar(
      {
        locale,
      }) ?? ''
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

  public formatDateToDatetimeMedFromIso (isoDate: string, locale: string): string {
    return DateTime.fromISO(isoDate).setLocale(locale).toLocaleString(DateTime.DATETIME_MED)
  }
}
