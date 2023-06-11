import { PostMeta } from '~/modules/Posts/Domain/PostMeta'
import { MetaApplicationDto } from '~/modules/Posts/Application/Dtos/MetaApplicationDto'

export class MetaApplicationDtoTranslator {
  public static fromDomain (meta: PostMeta): MetaApplicationDto {
    return {
      type: meta.type,
      value: meta.value,
      createdAt: meta.createdAt.toISO(),
      postId: meta.postId,
    }
  }
}
