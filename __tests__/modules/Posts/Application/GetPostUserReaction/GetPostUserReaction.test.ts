import { PostReaction, Reaction } from '~/modules/Posts/Domain/PostReaction'
import { TestPostReactionBuilder } from '~/__tests__/modules/Posts/Domain/TestPostReactionBuilder'
import { mock } from 'jest-mock-extended'
import { PostRepositoryInterface } from '~/modules/Posts/Domain/PostRepositoryInterface'
import { GetPostUserReaction } from '~/modules/Posts/Application/GetPostUserReaction/GetPostUserReaction'
import {
  PostReactionApplicationDtoTranslator
} from '~/modules/Posts/Application/Translators/PostReactionApplicationDtoTranslator'

describe('~/modules/Posts/Application/GetPostUserReaction/GetPostUserReaction.ts', () => {
  const postRepository = mock<PostRepositoryInterface>()
  let postReaction: PostReaction

  const buildUseCase = (): GetPostUserReaction => {
    return new GetPostUserReaction(postRepository)
  }

  beforeEach(() => {
    postReaction = new TestPostReactionBuilder().build()

    postRepository.findUserReaction.mockResolvedValueOnce(Promise.resolve(postReaction))

    jest.spyOn(PostReactionApplicationDtoTranslator, 'fromDomain').mockReturnValueOnce({
      postId: 'expected-post-id',
      reactionType: Reaction.LIKE,
      userId: 'expected-user-id',
    })
  })

  it('should call to repository correctly', async () => {
    const useCase = buildUseCase()

    await useCase.get({
      postId: 'expected-post-id',
      userId: 'expected-user-id',
    })

    expect(postRepository.findUserReaction).toBeCalledWith('expected-post-id', 'expected-user-id')
  })

  it('should return correct data', async () => {
    const useCase = buildUseCase()

    const userReaction = await useCase.get({
      postId: 'expected-post-id',
      userId: 'expected-user-id',
    })

    expect(userReaction).toStrictEqual({
      postId: 'expected-post-id',
      reactionType: Reaction.LIKE,
      userId: 'expected-user-id',
    })
  })
})
