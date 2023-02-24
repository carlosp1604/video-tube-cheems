import { MetaApplicationDto } from '../../Application/Dtos/MetaApplicationDto'
import { PostApplicationDto } from '../../Application/Dtos/PostApplicationDto'
import { supportedQualities } from '../../Domain/Post'
import { VideoComponentDto, VideoQualityDto } from '../Dtos/VideoComponentDto'

export class VideoComponentDtoTranslator {
  public static fromApplicationDto(applicationDto: PostApplicationDto): VideoComponentDto {
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


  private static findMeta(type: string, applicationDto: PostApplicationDto): MetaApplicationDto | undefined {
    const meta = applicationDto.meta.find((meta) => {
      return meta.type === type
    })

    return meta
  }
}