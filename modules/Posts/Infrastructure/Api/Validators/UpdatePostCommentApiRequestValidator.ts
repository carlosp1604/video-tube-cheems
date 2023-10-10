import { z, ZodError } from 'zod'
import { PostCommentApiRequestValidatorError } from './PostCommentApiRequestValidatorError'
import { UpdatePostCommentApiRequestDto } from '~/modules/Posts/Infrastructure/Api/Requests/UpdatePostCommentApiRequestDto'

export class UpdatePostCommentApiRequestValidator {
  private static createPostApiRequestSchema = z.object({
    comment: z
      .string()
      .trim()
      .min(1, { message: 'Comment cannot be empty' }),
    postId: z.string({}).uuid(),
    parentCommentId: z.string().uuid().nullable(),
    userId: z.string().uuid(),
    postCommentId: z.string().uuid(),
  })

  public static validate (request: UpdatePostCommentApiRequestDto): PostCommentApiRequestValidatorError | void {
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
