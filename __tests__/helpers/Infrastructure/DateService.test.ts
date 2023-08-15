import { DateTime, Settings } from 'luxon'
import { DateService } from '~/helpers/Infrastructure/DateService'

describe('~/helpers/Infrastructure/DateService.ts', () => {
  beforeEach(() => {
    Settings.defaultLocale = 'es-ES'
    Settings.defaultZone = 'Europe/Madrid'
  })

  describe('formatAgoLike method', () => {
    const nowDate = DateTime.now()

    const testData = [
      [nowDate.toJSDate(), 'es', 'hoy'],
      [nowDate.minus({ day: 1 }).toJSDate(), 'es', 'ayer'],
      [nowDate.minus({ month: 1 }).toJSDate(), 'es', 'el mes pasado'],
      [nowDate.minus({ year: 1 }).toJSDate(), 'es', 'el año pasado'],
      [nowDate.toJSDate(), 'en', 'today'],
      [nowDate.minus({ day: 1 }).toJSDate(), 'en', 'yesterday'],
      [nowDate.minus({ month: 1 }).toJSDate(), 'en', 'last month'],
      [nowDate.minus({ year: 1 }).toJSDate(), 'en', 'last year'],
    ]

    it.each(testData)('should format data correctly', (date, locale, output) => {
      const formattedDate = (new DateService()).formatAgoLike(date as Date, locale as string)

      expect(formattedDate).toStrictEqual(output)
    })

    it('should throw exception if date is greater than current date', () => {
      expect(() => (new DateService()).formatAgoLike(DateTime.now().plus({ minute: 10 }).toJSDate(), 'es'))
        .toThrowError(Error('Date to format must be less or equal to current date'))
    })
  })

  describe('formatSecondsToHHMMSSFormat method', () => {
    it('should format data correctly if seconds are less than 3600', () => {
      const formattedDate = (new DateService()).formatSecondsToHHMMSSFormat(3500)

      expect(formattedDate).toStrictEqual('58:20')
    })

    it('should format data correctly if seconds are greater or equal than 3600', () => {
      const formattedDate = (new DateService()).formatSecondsToHHMMSSFormat(3700)

      expect(formattedDate).toStrictEqual('01:01:40')
    })
  })

  describe('formatDateToDateMedFromIso method', () => {
    const testData = [
      ['2007-05-24T07:18:31.000Z', 'es', '24 may 2007'],
      ['2007-05-24T07:18:31.000Z', 'en', 'May 24, 2007'],
      ['2023-07-04T21:20:10.000Z', 'es', '4 jul 2023'],
      ['2023-07-04T21:20:10.000Z', 'en', 'Jul 4, 2023'],
    ]

    it.each(testData)('should format data correctly', (isoDate, locale, output) => {
      const formattedDate = (new DateService()).formatDateToDateMedFromIso(isoDate, locale)

      expect(formattedDate).toStrictEqual(output)
    })
  })
})
