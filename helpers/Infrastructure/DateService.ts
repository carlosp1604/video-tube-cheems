import { DateTime } from 'luxon'
import { DateServiceInterface } from '../Domain/DateServiceInterface'

export class DateService implements DateServiceInterface {
  public nowDate(): Date {
    return new Date()
  }

  public formatAgoLike(date: DateTime): string {
    const units: Intl.RelativeTimeFormatUnit[] = [
      'year',
      'month',
      'week',
      'day',
      'hour',
      'minute',
      'second',
    ]

    const diff = date.diffNow().shiftTo(...units)
    const unit = units.find((unit) => diff.get(unit) !== 0) || 'second'

    const relativeFormatter = new Intl.RelativeTimeFormat('en', {
      numeric: 'auto',
    })

    return relativeFormatter.format(Math.trunc(diff.as(unit)), unit)
  }
}