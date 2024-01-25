export function localeWithTerritory (locale: string): string {
  switch (locale) {
    case 'en':
      return 'en_US'

    case 'es':
      return 'es_ES'

    default:
      return locale
  }
}
