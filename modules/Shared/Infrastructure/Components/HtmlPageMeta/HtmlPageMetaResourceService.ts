import { HtmlPageMetaResourceServiceInterface } from './HtmlPageMetaResourceServiceInterface'
import { HtmlPageMetaResourceProps } from './HtmlPageMetaResourceProps'

/**
 * Service to extract metadata properties which are dependent on a specific resource.
 */
export class HtmlPageMetaResourceService implements HtmlPageMetaResourceServiceInterface {
  private siteName = 'Cheems'
  private resourceType = 'website'

  private title: string
  private description: string
  private image: string

  public constructor (
    title: string,
    description: string,
    // TODO: Set an image here
    image = ''
  ) {
    this.title = title
    this.description = description
    this.image = image
  }

  public getProperties (): HtmlPageMetaResourceProps {
    return {
      title: this.getTitle(),
      description: this.getDescription(),
      siteName: this.getSiteName(),
      resourceType: this.getResourceType(),
      image: this.getImage(),
    }
  }

  private getTitle (): string {
    return this.title.startsWith(this.siteName) ? this.title : `${this.siteName} | ${this.title}`
  }

  private getDescription (): string {
    return this.description
  }

  private getSiteName (): string {
    return this.siteName
  }

  private getResourceType (): string {
    return this.resourceType
  }

  private getImage (): string {
    return this.image
  }
}
