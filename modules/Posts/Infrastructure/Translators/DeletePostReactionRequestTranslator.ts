import { DeletePostReactionApiRequestDto } from '~/modules/Posts/Infrastructure/Dtos/DeletePostReactionApiRequestDto'
import {
  DeletePostReactionApplicationRequestDto
} from '~/modules/Posts/Application/DeletePostReaction/DeletePostReactionApplicationRequestDto'

export class DeletePostReactionRequestTranslator {
  public static fromApiDto (request: DeletePostReactionApiRequestDto): DeletePostReactionApplicationRequestDto {
    return {
      postId: request.postId,
      userId: request.userId,
    }
  }
}
