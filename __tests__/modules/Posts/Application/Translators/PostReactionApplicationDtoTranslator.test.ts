import { PostReaction, Reaction } from '~/modules/Posts/Domain/PostReaction'
import { TestPostReactionBuilder } from '~/__tests__/modules/Posts/Domain/TestPostReactionBuilder'
import {
  PostReactionApplicationDtoTranslator
} from '~/modules/Posts/Application/Translators/PostReactionApplicationDtoTranslator'

describe('~/modules/Posts/Application/Translators/PostReactionApplicationDtoTranslator.ts', () => {
  let postReaction: PostReaction

  beforeEach(() => {
    postReaction = new TestPostReactionBuilder()
      .withPostId('expected-post-id')
      .withReactionType(Reaction.LIKE)
      .withUserId('expected-user-id')
      .build()
  })

  it('should translate data correctly', () => {
    const translatedData = PostReactionApplicationDtoTranslator.fromDomain(postReaction)

    expect(translatedData).toStrictEqual({
      postId: 'expected-post-id',
      reactionType: Reaction.LIKE,
      userId: 'expected-user-id',
    })
  })
})
