import {
  HtmlPageMetaContextResourceType,
  HtmlPageMetaResourceService
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaResourceService/HtmlPageMetaResourceService'
import {
  HtmlPageMetaVideoProps
} from '~/modules/Shared/Infrastructure/Components/HtmlPageMeta/HtmlPageMetaResourceService/HtmlPageMetaResourceProps'

export class HtmlPageMetaVideoService extends HtmlPageMetaResourceService {
  public readonly videoUrl: string
  public readonly duration: string
  public readonly width = '640'
  public readonly height = '360'

  public constructor (
    title: string,
    description: string,
    image: string,
    videoUrl: string,
    duration: string
  ) {
    super(title, description, HtmlPageMetaContextResourceType.VIDEO_MOVIE, image)
    this.videoUrl = videoUrl
    this.duration = duration
  }

  public getProperties (): HtmlPageMetaVideoProps {
    const props = super.getProperties()

    return {
      ...props,
      videoUrl: this.videoUrl,
      duration: this.duration,
      width: this.width,
      height: this.height,
    }
  }
}
