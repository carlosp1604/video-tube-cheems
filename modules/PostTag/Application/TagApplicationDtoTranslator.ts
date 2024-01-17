import { TagApplicationDto } from '~/modules/PostTag/Application/TagApplicationDto'
import { PostTag } from '~/modules/PostTag/Domain/PostTag'
import {
  PostTagTranslationTranslatorDto
} from '~/modules/PostTag/Application/PostTagTranslationTranslatorDto'

// NOTE: We are not testing this due to this class does not have logic to be tested
export class TagApplicationDtoTranslator {
  public static fromDomain (postTag: PostTag): TagApplicationDto {
    return {
      id: postTag.id,
      slug: postTag.slug,
      name: postTag.name,
      imageUrl: postTag.imageUrl,
      description: postTag.description,
      translations: PostTagTranslationTranslatorDto.fromDomain(postTag),
    }
  }
}
