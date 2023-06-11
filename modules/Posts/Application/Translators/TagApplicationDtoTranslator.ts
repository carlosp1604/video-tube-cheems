import { TagApplicationDto } from '~/modules/Posts/Application/Dtos/TagApplicationDto'
import { PostTag } from '~/modules/Posts/Domain/PostTag'

export class TagApplicationDtoTranslator {
  public static fromDomain (postTag: PostTag): TagApplicationDto {
    return {
      id: postTag.id,
      name: postTag.name,
      imageUrl: postTag.imageUrl,
      description: postTag.description,
    }
  }
}
