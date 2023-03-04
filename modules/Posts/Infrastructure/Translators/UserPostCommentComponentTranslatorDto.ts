import { UserApplicationDto } from '../../../Auth/Application/UserApplicationDto'
import { UserPostCommentComponentDto } from '../Dtos/UserPostCommentComponentDto'

export class UserPostCommentComponentDtoTranslator {
  public static fromApplication(application: UserApplicationDto): UserPostCommentComponentDto {
    return {
      id: application.id,
      name: application.name,
      imageUrl: application.imageUrl
    }
  }
}