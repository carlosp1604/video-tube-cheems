import { UserApplicationDto } from '~/modules/Auth/Application/Dtos/UserApplicationDto'
import { UserPostCommentComponentDto } from '~/modules/Posts/Infrastructure/Dtos/UserPostCommentComponentDto'

export class UserPostCommentComponentDtoTranslator {
  public static fromApplication (application: UserApplicationDto): UserPostCommentComponentDto {
    return {
      id: application.id,
      name: application.name,
      imageUrl: application.imageUrl,
    }
  }
}
