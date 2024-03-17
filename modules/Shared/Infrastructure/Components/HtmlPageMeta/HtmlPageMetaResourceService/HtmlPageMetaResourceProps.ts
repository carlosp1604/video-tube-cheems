export class HtmlPageMetaResourceProps {
  public readonly title: string
  public readonly description: string
  public readonly siteName: string
  public readonly resourceType: string
  public readonly image: string
  public readonly canonical: string | null

  constructor (
    title: string,
    description: string,
    siteName: string,
    resourceType: string,
    image: string,
    canonical: string | null
  ) {
    this.title = title
    this.description = description
    this.siteName = siteName
    this.resourceType = resourceType
    this.image = image
    this.canonical = canonical

    Object.setPrototypeOf(this, HtmlPageMetaResourceProps)
  }
}

export class HtmlPageMetaVideoProps extends HtmlPageMetaResourceProps {
  public readonly videoUrl: string
  public readonly duration: string
  public readonly width: string
  public readonly height: string

  constructor (title: string,
    description: string,
    siteName: string,
    resourceType: string,
    canonical: string | null,
    image: string,
    videoUrl: string,
    duration: string,
    width: string,
    height: string
  ) {
    super(title, description, siteName, resourceType, image, canonical)
    this.videoUrl = videoUrl
    this.duration = duration
    this.width = width
    this.height = height

    Object.setPrototypeOf(this, HtmlPageMetaVideoProps)
  }
}
