import { HtmlPageMetaResourceServiceInterface } from './HtmlPageMetaResourceServiceInterface'
import { HtmlPageMetaResourceProps } from './HtmlPageMetaResourceProps'

export enum HtmlPageMetaContextResourceType {
  WEBSITE = 'website',
  VIDEO_MOVIE = 'video.movie',
}

/**
 * Service to extract metadata properties which are dependent on a specific resource.
 */
export class HtmlPageMetaResourceService implements HtmlPageMetaResourceServiceInterface {
  public readonly siteName = 'Cheems'
  private readonly title: string
  public readonly description: string
  public readonly resourceType: HtmlPageMetaContextResourceType
  public readonly image: string

  public constructor (
    title: string,
    description: string,
    resourceType: HtmlPageMetaContextResourceType,
    // TODO: Set a default image here
    image = ''
  ) {
    this.title = title
    this.resourceType = resourceType
    this.description = description
    this.image = image
  }

  public getProperties (): HtmlPageMetaResourceProps {
    return {
      title: this.getTitle(),
      description: this.description,
      siteName: this.siteName,
      resourceType: this.resourceType,
      image: this.image,
    }
  }

  private getTitle (): string {
    return this.title.startsWith(this.siteName) ? this.title : `${this.siteName} | ${this.title}`
  }
}
