import { UserPostCommentComponentDtoTranslator } from './UserPostCommentComponentTranslatorDto'
import { PostChildCommentApplicationDto } from '~/modules/Posts/Application/Dtos/PostChildCommentApplicationDto'
import { PostChildCommentComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostChildCommentComponentDto'
import { DateService } from '~/helpers/Infrastructure/DateService'
import {
  ReactionComponentDtoTranslator
} from '~/modules/Reactions/Infrastructure/Components/ReactionComponentDtoTranslator'
import { ModelReactionApplicationDto } from '~/modules/Reactions/Application/ModelReactionApplicationDto'

export class PostChildCommentComponentDtoTranslator {
  public static fromApplication (
    applicationDto: PostChildCommentApplicationDto,
    reactionsNumber: number,
    userReaction: ModelReactionApplicationDto | null,
    locale: string
  ): PostChildCommentComponentDto {
    return {
      id: applicationDto.id,
      comment: applicationDto.comment,
      createdAt: new DateService()
        .formatAgoLike(new Date(applicationDto.createdAt), locale),
      user: UserPostCommentComponentDtoTranslator.fromApplication(applicationDto.user),
      parentCommentId: applicationDto.parentCommentId,
      reactionsNumber,
      userReaction: userReaction !== null ? ReactionComponentDtoTranslator.fromApplicationDto(userReaction) : null,
    }
  }
}
