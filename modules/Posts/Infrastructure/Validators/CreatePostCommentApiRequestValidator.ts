import { z, ZodError } from 'zod'
import { CreatePostCommentApiRequestDto } from '../Dtos/CreatePostCommentApiRequestDto'
import { CreatePostCommentApiRequestValidatorError } from './CreatePostCommentApiRequestValidatorError'

export class CreatePostCommentApiRequestValidator {
  private static createPostApiRequestSchema = z.object({
    comment: z
      .string()
      .trim()
      .min(1, { message: 'Comment cannot be empty' }),
    postId: z.string({}).uuid(),
    parentCommentId: z.string().uuid().nullable(),
    userId: z.string().uuid(),
  })

  public static validate(request: CreatePostCommentApiRequestDto): CreatePostCommentApiRequestValidatorError | void {
    try {
      this.createPostApiRequestSchema.parse(request)
    }
    catch (exception: unknown) {
      if (!(exception instanceof ZodError)) {
        throw exception
      }

      return new CreatePostCommentApiRequestValidatorError(exception.issues)
    }

    return
  }
}