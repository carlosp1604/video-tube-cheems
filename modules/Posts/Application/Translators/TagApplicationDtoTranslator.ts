import { TagApplicationDto } from '~/modules/Posts/Application/Dtos/TagApplicationDto'
import { PostTag } from '~/modules/Posts/Domain/PostTag'
import {
  PostTagTranslationTranslatorDto
} from '~/modules/Posts/Application/Translators/PostTagTranslationTranslatorDto'

// NOTE: We are not testing this due to this class does not have logic to be tested
export class TagApplicationDtoTranslator {
  public static fromDomain (postTag: PostTag): TagApplicationDto {
    return {
      id: postTag.id,
      name: postTag.name,
      imageUrl: postTag.imageUrl,
      description: postTag.description,
      translations: PostTagTranslationTranslatorDto.fromDomain(postTag),
    }
  }
}
