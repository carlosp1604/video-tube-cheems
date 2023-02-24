import { PostApplicationDto } from '../../Application/Dtos/PostApplicationDto'
import { PostAnimationDto } from '../Dtos/PostAnimationDto'

export class PostAnimationDtoTranslator {
  public static fromApplication(applicationDto: PostApplicationDto): PostAnimationDto | null {
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