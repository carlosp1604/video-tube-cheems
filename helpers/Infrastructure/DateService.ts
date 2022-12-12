import { DateServiceInterface } from '../Domain/DateServiceInterface'

export class DateService implements DateServiceInterface {
  public nowDate(): Date {
    return new Date()
  }
}