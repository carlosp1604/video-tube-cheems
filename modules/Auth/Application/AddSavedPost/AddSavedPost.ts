import { UserRepositoryInterface } from '~/modules/Auth/Domain/UserRepositoryInterface'
import { PostRepositoryInterface } from '~/modules/Posts/Domain/PostRepositoryInterface'
import { AddSavedPostApplicationRequest } from '~/modules/Auth/Application/AddSavedPost/AddSavedPostApplicationRequest'
import { Post } from '~/modules/Posts/Domain/Post'
import { User } from '~/modules/Auth/Domain/User'
import {
  AddSavedPostApplicationException
} from '~/modules/Auth/Application/AddSavedPost/AddSavedPostApplicationException'
import { UserDomainException } from '~/modules/Auth/Domain/UserDomainException'
import {
  PostWithProducerAndMetaApplicationDtoTranslator
} from '~/modules/Posts/Application/Translators/PostWithProducerAndMetaApplicationDtoTranslator'
import {
  PostWithProducerAndMetaApplicationDto
} from '~/modules/Posts/Application/Dtos/PostWithProducerAndMetaApplicationDto'

export class AddSavedPost {
  // eslint-disable-next-line no-useless-constructor
  constructor (
    private readonly userRepository: UserRepositoryInterface,
    private readonly postRepository: PostRepositoryInterface
  ) {}

  public async add (request: AddSavedPostApplicationRequest): Promise<PostWithProducerAndMetaApplicationDto> {
    const user = await this.getUser(request.userId)
    const post = await this.getPost(request.postId)

    AddSavedPost.addPostToUserSavedPosts(user, post)

    await this.userRepository.addPostToSavedPosts(user.id, post.id)

    return PostWithProducerAndMetaApplicationDtoTranslator.fromDomain(post)
  }

  public async getUser (userId: AddSavedPostApplicationRequest['userId']): Promise<User> {
    const user = await this.userRepository.findById(userId, ['savedPosts'])

    if (user === null) {
      throw AddSavedPostApplicationException.userNotFound(userId)
    }

    return user
  }

  public async getPost (postId: AddSavedPostApplicationRequest['postId']): Promise<Post> {
    const post = await this.postRepository.findById(postId, [
      'meta',
      'producer',
      'actor',
      'translations',
    ])

    if (post === null) {
      throw AddSavedPostApplicationException.postNotFound(postId)
    }

    return post
  }

  public static addPostToUserSavedPosts (user: User, post: Post): void {
    try {
      user.addSavedPost(post)
    } catch (exception: unknown) {
      if (!(exception instanceof UserDomainException)) {
        throw exception
      }

      switch (exception.id) {
        case UserDomainException.postAlreadySavedId:
          throw AddSavedPostApplicationException.postAlreadyAdded(user.id, post.id)

        default:
          throw exception
      }
    }
  }
}
