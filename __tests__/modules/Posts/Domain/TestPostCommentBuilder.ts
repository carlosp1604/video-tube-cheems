import { DateTime } from 'luxon'
import { PostComment } from '~/modules/Posts/Domain/PostComment'
import { Relationship } from '~/modules/Shared/Domain/Relationship/Relationship'
import { User } from '~/modules/Auth/Domain/User'
import { Collection } from '~/modules/Shared/Domain/Relationship/Collection'
import { PostChildComment } from '~/modules/Posts/Domain/PostChildComment'

/**
 * PostComment model builder for tests
 */
export class TestPostCommentBuilder {
  private id: string
  private comment: string
  private postId: string
  private userId: string
  private createdAt: DateTime
  private updatedAt: DateTime
  private deletedAt: DateTime | null
  private user: Relationship<User>
  private childComments: Collection<PostChildComment, PostChildComment['id']>

  constructor () {
    this.id = 'test-post-comment-id'
    this.comment = 'test-post-comment-comment'
    this.postId = 'test-post-comment-post-id'
    this.userId = 'test-post-comment-user-id'
    this.createdAt = DateTime.now()
    this.updatedAt = DateTime.now()
    this.deletedAt = null
    this.user = Relationship.notLoaded()
    this.childComments = Collection.notLoaded()
  }

  public build (): PostComment {
    return new PostComment(
      this.id,
      this.comment,
      this.postId,
      this.userId,
      this.createdAt,
      this.updatedAt,
      this.deletedAt,
      this.user,
      this.childComments
    )
  }

  public withId (id: string): TestPostCommentBuilder {
    this.id = id

    return this
  }

  public withComment (comment: string): TestPostCommentBuilder {
    this.comment = comment

    return this
  }

  public withPostId (postId: string): TestPostCommentBuilder {
    this.postId = postId

    return this
  }

  public withUserId (userId: string): TestPostCommentBuilder {
    this.userId = userId

    return this
  }

  public withCreatedAt (createdAt: DateTime): TestPostCommentBuilder {
    this.createdAt = createdAt

    return this
  }

  public withUpdatedAt (updatedAt: DateTime): TestPostCommentBuilder {
    this.updatedAt = updatedAt

    return this
  }

  public withUser (userRelationShip: Relationship<User>): TestPostCommentBuilder {
    this.user = userRelationShip

    return this
  }
}
