export class HtmlPageMetaResourceProps {
  public readonly title: string
  public readonly description: string
  public readonly siteName: string
  public readonly resourceType: string
  public readonly image: string

  constructor (
    title: string,
    description: string,
    siteName: string,
    resourceType: string,
    image: string
  ) {
    this.title = title
    this.description = description
    this.siteName = siteName
    this.resourceType = resourceType
    this.image = image

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
    image: string,
    videoUrl: string,
    duration: string,
    width: string,
    height: string
  ) {
    super(title, description, siteName, resourceType, image)
    this.videoUrl = videoUrl
    this.duration = duration
    this.width = width
    this.height = height

    Object.setPrototypeOf(this, HtmlPageMetaVideoProps)
  }
}
