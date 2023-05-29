import { AddPostViewApplicationRequest } from '~/modules/Posts/Application/AddPostView/AddPostViewApplicationRequest'
import { Post } from '~/modules/Posts/Domain/Post'
import { User } from '~/modules/Auth/Domain/User'
import { PostView } from '~/modules/Posts/Domain/PostView'
import { randomUUID } from 'crypto'
import { DateTime } from 'luxon'
import { UserRepositoryInterface } from '~/modules/Auth/Domain/UserRepositoryInterface'
import { PostRepositoryInterface } from '~/modules/Posts/Domain/PostRepositoryInterface'
import { AddPostViewApplicationException } from '~/modules/Posts/Application/AddPostView/AddPostViewApplicationException'

export class AddPostView {
  // eslint-disable-next-line no-useless-constructor
  constructor (
    private readonly postRepository: PostRepositoryInterface,
    private readonly userRepository: UserRepositoryInterface
  ) {}

  public async add (request: AddPostViewApplicationRequest): Promise<void> {
    const post = await this.getPost(request.postId)

    if (request.userId !== null) {
      await this.getUser(request.userId)
    }

    try {
      const postView = new PostView(
        randomUUID(),
        request.userId,
        post.id,
        DateTime.now()
      )

      await this.postRepository.createPostView(post.id, postView)
    } catch (exception: unknown) {
      console.error(exception)
      throw AddPostViewApplicationException.cannotCreatePostView(request.postId)
    }
  }

  private async getPost (postId: AddPostViewApplicationRequest['postId']): Promise<Post> {
    const post = await this.postRepository.findById(postId)

    if (post === null) {
      throw AddPostViewApplicationException.postNotFound(postId)
    }

    return post
  }

  private async getUser (userId: AddPostViewApplicationRequest['userId']): Promise<User> {
    const user = await this.userRepository.findById(userId as string)

    if (user === null) {
      throw AddPostViewApplicationException.userNotFound(userId as string)
    }

    return user
  }
}
