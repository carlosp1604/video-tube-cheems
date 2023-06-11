import { z, ZodError } from 'zod'
import { PostCommentApiRequestValidatorError } from './PostCommentApiRequestValidatorError'
import { DeletePostCommentApiRequestDto } from '~/modules/Posts/Infrastructure/Dtos/DeletePostCommentApiRequestDto'

export class DeletePostCommentApiRequestValidator {
  private static createPostApiRequestSchema = z.object({
    postId: z.string({}).uuid(),
    parentCommentId: z.string().uuid().nullable(),
    postCommentId: z.string().uuid().nullable(),
    userId: z.string().uuid(),
  })

  public static validate (request: DeletePostCommentApiRequestDto): PostCommentApiRequestValidatorError | void {
    try {
      this.createPostApiRequestSchema.parse(request)
    } catch (exception: unknown) {
      if (!(exception instanceof ZodError)) {
        throw exception
      }

      return PostCommentApiRequestValidatorError.updatePostCommentValidation(exception.issues)
    }
  }
}
