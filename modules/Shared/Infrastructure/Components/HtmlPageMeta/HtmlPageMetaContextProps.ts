export interface AlternateUrl {
  locale: string
  alternateUrl: string
}

export interface HtmlPageMetaContextProps {
  url: string
  locale: string
  alternateLocaleWithTerritory: string[]
  alternateLocale: AlternateUrl[]
}
