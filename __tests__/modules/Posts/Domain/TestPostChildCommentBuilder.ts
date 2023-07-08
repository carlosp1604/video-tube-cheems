import { DateTime } from 'luxon'
import { Relationship } from '~/modules/Shared/Domain/Relationship/Relationship'
import { User } from '~/modules/Auth/Domain/User'
import { PostChildComment } from '~/modules/Posts/Domain/PostChildComment'

/**
 * PostChildComment model builder for tests
 */
export class TestPostChildCommentBuilder {
  private id: string
  private comment: string
  private userId: string
  private parentCommentId: string
  private createdAt: DateTime
  private updatedAt: DateTime
  private deletedAt: DateTime | null
  private user: Relationship<User>

  constructor () {
    this.id = 'test-post-child-comment-id'
    this.comment = 'test-post-child-comment-comment'
    this.parentCommentId = 'test-parent-comment-id'
    this.userId = 'test-post-child-comment-user-id'
    this.createdAt = DateTime.now()
    this.updatedAt = DateTime.now()
    this.deletedAt = null
    this.user = Relationship.notLoaded()
  }

  public build (): PostChildComment {
    return new PostChildComment(
      this.id,
      this.comment,
      this.userId,
      this.parentCommentId,
      this.createdAt,
      this.updatedAt,
      this.deletedAt,
      this.user
    )
  }

  public withId (id: string): TestPostChildCommentBuilder {
    this.id = id

    return this
  }

  public withComment (comment: string): TestPostChildCommentBuilder {
    this.comment = comment

    return this
  }

  public withParentCommentId (parentCommentId: string): TestPostChildCommentBuilder {
    this.parentCommentId = parentCommentId

    return this
  }

  public withUserId (userId: string): TestPostChildCommentBuilder {
    this.userId = userId

    return this
  }

  public withCreatedAt (createdAt: DateTime): TestPostChildCommentBuilder {
    this.createdAt = createdAt

    return this
  }

  public withUpdatedAt (updatedAt: DateTime): TestPostChildCommentBuilder {
    this.updatedAt = updatedAt

    return this
  }

  public withUser (userRelationShip: Relationship<User>): TestPostChildCommentBuilder {
    this.user = userRelationShip

    return this
  }
}
