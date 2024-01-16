import { TagApplicationDto } from '~/modules/PostTag/Application/TagApplicationDto'
import { PostPostTagComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostPostTagComponentDto'

export class TagComponentDtoTranslator {
  public static fromApplicationDto (applicationDto: TagApplicationDto): PostPostTagComponentDto {
    return {
      id: applicationDto.id,
      name: applicationDto.name,
      slug: applicationDto.slug,
    }
  }
}
