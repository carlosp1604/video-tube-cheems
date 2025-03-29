export interface AlternateUrl {
  locale: string
  alternateUrl: string
}

export interface HtmlPageMetaRobots {
  index: boolean
  follow: boolean
}

export interface CanonicalCurrentUrl {
  includeQuery: boolean
  includeLocale: boolean
}

export type CanonicalUrl = string | CanonicalCurrentUrl | null

export interface HtmlPageMetaContextProps {
  url: string
  locale: string
  alternateLocale: AlternateUrl[]
  canonicalUrl: string | null
  robots: HtmlPageMetaRobots
}
