import { DateTime } from 'luxon'
import { PostView } from '~/modules/Posts/Domain/PostView'

/**
 * PostView model builder for tests
 */
export class TestPostViewBuilder {
  private id: string
  private userId: string | null
  private postId: string
  private createdAt: DateTime

  constructor () {
    this.id = 'test-post-view-id'
    this.userId = null
    this.postId = 'test-post-id'
    this.createdAt = DateTime.now()
  }

  public build (): PostView {
    return new PostView(
      this.id,
      this.userId,
      this.postId,
      this.createdAt
    )
  }

  public withId (id: string): TestPostViewBuilder {
    this.id = id

    return this
  }

  public withPostId (postId: string): TestPostViewBuilder {
    this.postId = postId

    return this
  }

  public withUserId (userId: string | null): TestPostViewBuilder {
    this.userId = userId

    return this
  }

  public withCreatedAt (createdAt: DateTime): TestPostViewBuilder {
    this.createdAt = createdAt

    return this
  }
}
