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

  public getCurrentDayWithoutTime (): Date {
    const todayDate = new Date()
    const day = todayDate.getDate()
    const month = todayDate.getMonth()
    const year = todayDate.getFullYear()

    return new Date(Date.UTC(year, month, day, 0, 0, 0, 0))
  }

  public getCurrentMonthFirstDay (): Date {
    const nowDate = new Date()
    const monthFirstDayUTC = Date.UTC(nowDate.getFullYear(), nowDate.getMonth(), 1)

    return new Date(monthFirstDayUTC)
  }

  public getCurrentWeekFirstDay (): Date {
    const nowDate = new Date()
    const day = nowDate.getDay()
    const diff = nowDate.getDate() - day + (day === 0 ? -6 : 1)
    const month = nowDate.getMonth()
    const year = nowDate.getFullYear()

    return new Date(Date.UTC(year, month, diff))
  }
}
