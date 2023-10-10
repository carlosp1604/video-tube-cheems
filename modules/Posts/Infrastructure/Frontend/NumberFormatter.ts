export class NumberFormatter {
  public static compatFormat (value: number, locale: string): string {
    return Intl.NumberFormat(locale, { notation: 'compact' }).format(value)
  }
}
