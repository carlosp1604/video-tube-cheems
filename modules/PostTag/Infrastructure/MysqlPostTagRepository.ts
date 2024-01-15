import { prisma } from '~/persistence/prisma'
import { PostTagRepositoryInterface } from '~/modules/PostTag/Domain/PostTagRepositoryInterface'
import { PostTag } from '~/modules/PostTag/Domain/PostTag'
import { PostTagModelTranslator } from '~/modules/PostTag/Infrastructure/PostTagModelTranslator'

export class MysqlPostTagRepository implements PostTagRepositoryInterface {
  /**
   * Find a Tag given its slug
   * @param tagSlug Tag Slug
   * @return Tag if found or null
   */
  public async findBySlug (tagSlug: PostTag['slug']): Promise<PostTag | null> {
    const tag = await prisma.postTag.findFirst({
      where: {
        slug: tagSlug,
        deletedAt: null,
      },
    })

    if (tag === null) {
      return null
    }

    return PostTagModelTranslator.toDomain(tag)
  }
}
