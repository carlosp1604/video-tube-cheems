import { HtmlPageMetaResourceServiceInterface } from './HtmlPageMetaResourceServiceInterface'
import { HtmlPageMetaResourceProps } from './HtmlPageMetaResourceProps'

export enum HtmlPageMetaContextResourceType {
  WEBSITE = 'website',
  VIDEO_MOVIE = 'video.movie',
  ARTICLE = 'article'
}

/**
 * Service to extract metadata properties which are dependent on a specific resource.
 */
export class HtmlPageMetaResourceService implements HtmlPageMetaResourceServiceInterface {
  public readonly siteName = process.env.NEXT_PUBLIC_WEBSITE_NAME ?? ''
  private readonly title: string
  public readonly description: string
  public readonly resourceType: HtmlPageMetaContextResourceType
  public readonly image: string
  public readonly canonical: string | null

  public constructor (
    title: string,
    description: string,
    resourceType: HtmlPageMetaContextResourceType,
    canonical: string | null,
    image: string = process.env.NEXT_PUBLIC_WEBSITE_IMAGE_URL ?? ''
  ) {
    this.title = title
    this.resourceType = resourceType
    this.description = description
    this.image = image
    this.canonical = canonical
  }

  public getProperties (): HtmlPageMetaResourceProps {
    return {
      title: this.getTitle(),
      description: this.description,
      siteName: this.siteName,
      resourceType: this.resourceType,
      image: this.image,
      canonical: this.canonical
    }
  }

  private getTitle (): string {
    return this.title.startsWith(this.siteName) ? this.title : `${this.siteName} | ${this.title}`
  }
}
