import { DateTime } from 'luxon'
import { PostReaction, Reaction } from '~/modules/Posts/Domain/PostReaction'

/**
 * PostReaction model builder for tests
 */
export class TestPostReactionBuilder {
  private postId: string
  private userId: string
  private _reactionType: Reaction
  private createdAt: DateTime
  private updatedAt: DateTime
  private deletedAt: DateTime | null

  constructor () {
    this.postId = 'test-post-reaction-id'
    this.userId = 'test-post-reaction-user-id'
    this._reactionType = Reaction.LIKE
    this.createdAt = DateTime.now()
    this.updatedAt = DateTime.now()
    this.deletedAt = null
  }

  public build (): PostReaction {
    return new PostReaction(
      this.postId,
      this.userId,
      this._reactionType,
      this.createdAt,
      this.updatedAt,
      this.deletedAt
    )
  }

  public withPostId (postId: string): TestPostReactionBuilder {
    this.postId = postId

    return this
  }

  public withUserId (userId: string): TestPostReactionBuilder {
    this.userId = userId

    return this
  }

  public withReactionType (reactionType: Reaction): TestPostReactionBuilder {
    this._reactionType = reactionType

    return this
  }

  public withCreatedAt (createdAt: DateTime): TestPostReactionBuilder {
    this.createdAt = createdAt

    return this
  }

  public withDeletedAt (deletedAt: DateTime | null): TestPostReactionBuilder {
    this.deletedAt = deletedAt

    return this
  }
}
