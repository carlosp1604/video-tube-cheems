import { GetServerSidePropsContext, GetStaticPropsContext } from 'next'
import { i18nConfig } from '~/i18n.config'
import { HtmlPageMetaContextServiceInterface } from './HtmlPageMetaContextServiceInterface'
import {
  AlternateUrl, CanonicalUrl,
  HtmlPageMetaContextProps,
  HtmlPageMetaRobots
} from './HtmlPageMetaContextProps'

export interface StaticContext extends GetStaticPropsContext {
  pathname: string
  locale: string
  resolvedUrl: string
}

export class HtmlPageMetaContextService implements HtmlPageMetaContextServiceInterface {
  public constructor (
    private context: GetServerSidePropsContext | StaticContext,
    private readonly canonicalUrl: CanonicalUrl = null,
    private readonly robots: HtmlPageMetaRobots = { index: true, follow: true }
  ) {
    this.context = context
    this.canonicalUrl = canonicalUrl
    this.robots = robots
  }

  public getProperties (): HtmlPageMetaContextProps {
    return {
      url: this.getFullUrl(this.getLocale()),
      locale: this.getExtendedLocale(),
      alternateLocale: this.getAlternateLocaleWithAlternateUrl(),
      canonicalUrl: this.getCanonicalUrl(),
      robots: this.robots,
    }
  }

  private getLocale (): string {
    return this.context.locale ? this.context.locale : i18nConfig.defaultLocale
  }

  private getExtendedLocale (): string {
    return this.getLocale()
  }

  private getAlternateLocale (): string[] {
    return i18nConfig.locales
  }

  private getAlternateLocaleWithAlternateUrl (): AlternateUrl[] {
    const locales = this.getAlternateLocale()

    const alternateLocale: AlternateUrl[] = []

    locales.forEach((locale) => {
      const alternateUrl = this.getFullUrl(locale === i18nConfig.defaultLocale ? null : locale)

      alternateLocale.push({ locale, alternateUrl })
    })

    return alternateLocale
  }

  private getFullUrl (locale: string | null): string {
    const env = process.env
    const baseUrl = env.BASE_URL

    if (!locale) {
      return `${baseUrl}${this.context.resolvedUrl}`
    }

    return `${baseUrl}/${locale}${this.context.resolvedUrl}`
  }

  private getCanonicalUrl (): string | null {
    if (!this.canonicalUrl) {
      return null
    }

    const env = process.env
    const baseUrl = env.BASE_URL

    if (typeof this.canonicalUrl === 'string') {
      return `${baseUrl}/${this.canonicalUrl}`
    }

    let canonicalUrl = baseUrl

    if (this.canonicalUrl.includeLocale && this.getLocale() !== i18nConfig.defaultLocale) {
      canonicalUrl = `${canonicalUrl}/${this.getLocale()}`
    }

    if (this.canonicalUrl.includeQuery) {
      canonicalUrl = `${canonicalUrl}${this.context.resolvedUrl}`
    } else {
      canonicalUrl = `${canonicalUrl}${(this.context.resolvedUrl ?? '').split('?')[0]}`
    }

    return canonicalUrl
  }
}
