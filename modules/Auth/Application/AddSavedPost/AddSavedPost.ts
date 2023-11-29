import { UserRepositoryInterface } from '~/modules/Auth/Domain/UserRepositoryInterface'
import { PostRepositoryInterface } from '~/modules/Posts/Domain/PostRepositoryInterface'
import { AddSavedPostApplicationRequest } from '~/modules/Auth/Application/AddSavedPost/AddSavedPostApplicationRequest'
import { Post } from '~/modules/Posts/Domain/Post'
import { User } from '~/modules/Auth/Domain/User'
import {
  AddSavedPostApplicationException
} from '~/modules/Auth/Application/AddSavedPost/AddSavedPostApplicationException'
import { UserDomainException } from '~/modules/Auth/Domain/UserDomainException'
import { PostWithViewsInterface } from '~/modules/Posts/Domain/PostWithCountInterface'
import {
  PostWithRelationsAndViewsApplicationDto
} from '~/modules/Posts/Application/Dtos/PostWithRelationsAndViewsApplicationDto'
import {
  PostWithRelationsAndViewsApplicationDtoTranslator
} from '~/modules/Posts/Application/Translators/PostWithRelationsAndViewsDtoTranslator'

export class AddSavedPost {
  // eslint-disable-next-line no-useless-constructor
  constructor (
    private readonly userRepository: UserRepositoryInterface,
    private readonly postRepository: PostRepositoryInterface
  ) {}

  public async add (request: AddSavedPostApplicationRequest): Promise<PostWithRelationsAndViewsApplicationDto> {
    const user = await this.getUser(request.userId)
    const post = await this.getPost(request.postId)

    AddSavedPost.addPostToUserSavedPosts(user, post.post)

    await this.userRepository.addPostToSavedPosts(user.id, post.post.id)

    return PostWithRelationsAndViewsApplicationDtoTranslator.fromDomain(post.post, post.postViews)
  }

  public async getUser (userId: AddSavedPostApplicationRequest['userId']): Promise<User> {
    const user = await this.userRepository.findById(userId, ['savedPosts'])

    if (user === null) {
      throw AddSavedPostApplicationException.userNotFound(userId)
    }

    return user
  }

  public async getPost (postId: AddSavedPostApplicationRequest['postId']): Promise<PostWithViewsInterface> {
    const post = await this.postRepository.findById(postId, [
      'meta',
      'producer',
      'actor',
      'translations',
      'viewsCount',
    ])

    if (post === null) {
      throw AddSavedPostApplicationException.postNotFound(postId)
    }

    return post as PostWithViewsInterface
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
