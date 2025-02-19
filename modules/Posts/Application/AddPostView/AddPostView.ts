import { AddPostViewApplicationRequest } from '~/modules/Posts/Application/AddPostView/AddPostViewApplicationRequest'
import { Post } from '~/modules/Posts/Domain/Post'
import { User } from '~/modules/Auth/Domain/User'
import { randomUUID } from 'crypto'
import { DateTime } from 'luxon'
import { UserRepositoryInterface } from '~/modules/Auth/Domain/UserRepositoryInterface'
import { PostRepositoryInterface } from '~/modules/Posts/Domain/PostRepositoryInterface'
import {
  AddPostViewApplicationException
} from '~/modules/Posts/Application/AddPostView/AddPostViewApplicationException'
import { View } from '~/modules/Views/Domain/View'
import {
  AddPostViewApplicationResponseDto
} from '~/modules/Posts/Application/AddPostView/AddPostViewApplicationResponseDto'

export class AddPostView {
  // eslint-disable-next-line no-useless-constructor
  constructor (
    private readonly postRepository: PostRepositoryInterface,
    private readonly userRepository: UserRepositoryInterface
  ) {}

  public async add (request: AddPostViewApplicationRequest): Promise<AddPostViewApplicationResponseDto> {
    const post = await this.getPost(request.postId)

    if (request.userId !== null) {
      await this.getUser(request.userId)
    }

    try {
      const postView = new View(
        randomUUID(),
        post.id,
        'Post',
        request.userId,
        DateTime.now()
      )

      const postViews = await this.postRepository.createPostView(post.id, postView)

      return {
        postViews,
      }
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

    return post as Post
  }

  private async getUser (userId: AddPostViewApplicationRequest['userId']): Promise<User> {
    const user = await this.userRepository.findById(userId as string)

    if (user === null) {
      throw AddPostViewApplicationException.userNotFound(userId as string)
    }

    return user
  }
}
