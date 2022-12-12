import { PostMeta } from '../../Domain/PostMeta'
import { MetaApplicationDto } from '../Dtos/MetaApplicationDto'

export class MetaApplicationDtoTranslator {
  public static fromDomain(meta: PostMeta): MetaApplicationDto {
    return {
      type: meta.type,
      value: meta.value,
      createdAt: meta.createdAt.toISO(),
      postId: meta.postId
    }
  }
}