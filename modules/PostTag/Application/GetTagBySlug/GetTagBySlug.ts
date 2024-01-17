import { PostTagRepositoryInterface } from '~/modules/PostTag/Domain/PostTagRepositoryInterface'
import { PostTag } from '~/modules/PostTag/Domain/PostTag'
import {
  GetTagBySlugApplicationException
} from '~/modules/PostTag/Application/GetTagBySlug/GetTagBySlugApplicationException'
import { TagApplicationDtoTranslator } from '~/modules/PostTag/Application/TagApplicationDtoTranslator'
import {
  GetTagBySlugApplicationResponseDto
} from '~/modules/PostTag/Application/GetTagBySlug/GetTagBySlugApplicationResponseDto'

export class GetTagBySlug {
  // eslint-disable-next-line no-useless-constructor
  public constructor (readonly tagRepository: PostTagRepositoryInterface) {}

  public async get (tagSlug: PostTag['slug']): Promise<GetTagBySlugApplicationResponseDto> {
    const tag = await this.tagRepository.findBySlug(tagSlug)

    if (tag === null) {
      throw GetTagBySlugApplicationException.tagNotFound(tagSlug)
    }

    return TagApplicationDtoTranslator.fromDomain(tag)
  }
}
