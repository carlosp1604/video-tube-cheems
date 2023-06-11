import { PostApplicationDto } from '~/modules/Posts/Application/Dtos/PostApplicationDto'
import { VideoComponentDto, VideoQualityDto } from '~/modules/Posts/Infrastructure/Dtos/VideoComponentDto'
import { supportedQualities } from '~/modules/Posts/Domain/Post'
import { MetaApplicationDto } from '~/modules/Posts/Application/Dtos/MetaApplicationDto'

export class VideoComponentDtoTranslator {
  public static fromApplicationDto (applicationDto: PostApplicationDto): VideoComponentDto {
    const thumb = this.findMeta('thumb', applicationDto)
    const download = this.findMeta('download_url', applicationDto)

    const qualities: VideoQualityDto[] = []

    for (const supportedQuality of supportedQualities) {
      const quality = this.findMeta(supportedQuality, applicationDto)

      if (quality) {
        qualities.push({ title: quality.type, value: quality.value })
      }
    }

    return {
      poster: thumb ? thumb.value : '',
      qualities,
      download: download ? download.value : '',
    }
  }

  private static findMeta (type: string, applicationDto: PostApplicationDto): MetaApplicationDto | undefined {
    const meta = applicationDto.meta.find((meta) => {
      return meta.type === type
    })

    return meta
  }
}
