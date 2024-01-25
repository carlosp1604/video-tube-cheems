import { ParsedUrlQuery } from 'querystring'
import { GetServerSidePropsContext, PreviewData } from 'next'
import nextI18nextConfig from '~/next-i18next.config'
import { localeWithTerritory } from '~/modules/Shared/Domain/Locale'
import { HtmlPageMetaContextServiceInterface } from './HtmlPageMetaContextServiceInterface'
import { HtmlPageMetaContextProps } from './HtmlPageMetaContextProps'

/**
 * Service to extract metadata properties which are dependent on the context.
 */
export class HtmlPageMetaContextService implements HtmlPageMetaContextServiceInterface {
  private context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>

  public constructor (context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>) {
    this.context = context
  }

  public getProperties (): HtmlPageMetaContextProps {
    return {
      url: this.getUrl(),
      locale: this.getExtendedLocale(),
      alternateLocale: this.getExtendedAlternateLocale(),
    }
  }

  private getLocale (): string {
    return this.context.locale ? this.context.locale : nextI18nextConfig.i18n.defaultLocale
  }

  private getExtendedLocale (): string {
    return localeWithTerritory(this.getLocale())
  }

  private getAlternateLocale (): string[] {
    return this.context.locales?.filter((locale) => locale !== this.getLocale()) || []
  }

  private getExtendedAlternateLocale (): string[] {
    return this.getAlternateLocale().map(localeWithTerritory)
  }

  private getUrl (): string {
    const env = process.env
    const baseUrl = env.BASE_URL

    return `${baseUrl}/${this.getLocale()}${this.context.req.url}`
  }
}
