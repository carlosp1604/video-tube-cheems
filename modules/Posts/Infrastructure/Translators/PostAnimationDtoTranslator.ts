import { PostAnimationDto } from '~/modules/Posts/Infrastructure/Dtos/PostAnimationDto'
import { MetaApplicationDto } from '~/modules/Posts/Application/Dtos/MetaApplicationDto'

export class PostAnimationDtoTranslator {
  public static fromApplication (postMeta: MetaApplicationDto[]): PostAnimationDto | null {
    const animation = postMeta.find((meta) => {
      return meta.type === 'trailer'
    })

    if (!animation) {
      return null
    }

    const animationType = animation.type
      .split('.')
      .filter(Boolean)
      .slice(1)
      .join('.')

    return {
      value: animation.value,
      type: animationType,
    }
  }
}
