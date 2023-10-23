import { UserRepositoryInterface } from '~/modules/Auth/Domain/UserRepositoryInterface'
import { PostRepositoryInterface } from '~/modules/Posts/Domain/PostRepositoryInterface'
import { User } from '~/modules/Auth/Domain/User'
import {
  AddSavedPostApplicationException
} from '~/modules/Auth/Application/AddSavedPost/AddSavedPostApplicationException'
import { UserDomainException } from '~/modules/Auth/Domain/UserDomainException'
import {
  DeleteSavedPostApplicationRequest
} from '~/modules/Auth/Application/DeleteSavedPost/DeleteSavedPostApplicationRequest'
import {
  DeleteSavedPostApplicationException
} from '~/modules/Auth/Application/DeleteSavedPost/DeleteSavedPostApplicationException'

export class DeleteSavedPost {
  // eslint-disable-next-line no-useless-constructor
  constructor (
    private readonly userRepository: UserRepositoryInterface,
    private readonly postRepository: PostRepositoryInterface
  ) {}

  public async delete (request: DeleteSavedPostApplicationRequest): Promise<void> {
    const user = await this.getUser(request.userId)

    await this.checkPostExists(request.postId)

    DeleteSavedPost.deletePostFromUserSavedPosts(user, request.postId)

    await this.userRepository.deletePostFromSavedPosts(user.id, request.postId)
  }

  public async getUser (userId: DeleteSavedPostApplicationRequest['userId']): Promise<User> {
    const user = await this.userRepository.findById(userId, ['savedPosts'])

    if (user === null) {
      throw AddSavedPostApplicationException.userNotFound(userId)
    }

    return user
  }

  public async checkPostExists (postId: DeleteSavedPostApplicationRequest['postId']): Promise<void> {
    const post = await this.postRepository.findById(postId)

    if (post === null) {
      throw AddSavedPostApplicationException.postNotFound(postId)
    }
  }

  public static deletePostFromUserSavedPosts (user: User, postId: DeleteSavedPostApplicationRequest['postId']): void {
    try {
      user.removeSavedPost(postId)
    } catch (exception: unknown) {
      if (!(exception instanceof UserDomainException)) {
        throw exception
      }

      switch (exception.id) {
        case UserDomainException.postDoesNotExisOnSavedPostsId:
          throw DeleteSavedPostApplicationException.postDoesNotExistOnSavedPosts(user.id, postId)

        case UserDomainException.cannotDeletePostFromSavedPostsId:
          throw DeleteSavedPostApplicationException.cannotDeletePostFromSavedPosts(user.id, postId)

        default:
          throw exception
      }
    }
  }
}
