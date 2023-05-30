import { PostView as PrismaPostViewModel } from '@prisma/client'
import { PostView } from '~/modules/Posts/Domain/PostView'

export class PostViewModelTranslator {
  public static toDatabase (postView: PostView): PrismaPostViewModel {
    return {
      id: postView.id,
      userId: postView.userId,
      postId: postView.postId,
      createdAt: postView.createdAt.toJSDate(),
    }
  }
}
