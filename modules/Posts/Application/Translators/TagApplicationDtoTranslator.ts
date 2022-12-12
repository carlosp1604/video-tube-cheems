import { PostTag } from '../../Domain/PostTag'
import { TagApplicationDto } from '../Dtos/TagApplicationDto'

export class TagApplicationDtoTranslator {
  public static fromDomain(postTag: PostTag): TagApplicationDto {
    return {
      id: postTag.id,
      name: postTag.name,
      imageUrl: postTag.imageUrl,
      description: postTag.description
    }
  }
}