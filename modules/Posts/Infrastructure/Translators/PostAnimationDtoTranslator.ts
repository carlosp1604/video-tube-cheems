import { PostApplicationDto } from '~/modules/Posts/Application/Dtos/PostApplicationDto'
import { PostAnimationDto } from '~/modules/Posts/Infrastructure/Dtos/PostAnimationDto'

export class PostAnimationDtoTranslator {
  public static fromApplication (applicationDto: PostApplicationDto): PostAnimationDto | null {
    const animation = applicationDto.meta.find((meta) => {
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
