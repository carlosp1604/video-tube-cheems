import { PostTagRepositoryInterface } from '~/modules/PostTag/Domain/PostTagRepositoryInterface'
import { TagApplicationDto } from '~/modules/PostTag/Application/TagApplicationDto'
import { TagApplicationDtoTranslator } from '~/modules/PostTag/Application/TagApplicationDtoTranslator'

export class GetAllTags {
  // eslint-disable-next-line no-useless-constructor
  public constructor (private tagRepository: PostTagRepositoryInterface) {}

  public async get (): Promise<TagApplicationDto[]> {
    const tags = await this.tagRepository.getAll()

    return tags.map(TagApplicationDtoTranslator.fromDomain)
  }
}
