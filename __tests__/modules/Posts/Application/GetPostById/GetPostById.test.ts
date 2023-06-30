import { PostRepositoryInterface } from '~/modules/Posts/Domain/PostRepositoryInterface'
import { mock } from 'jest-mock-extended'
import { GetPostById } from '~/modules/Posts/Application/GetPostById/GetPostById'

describe('~/modules/Posts/Application/GetPostById/GetPostById.ts', () => {
  const postRepository = mock<PostRepositoryInterface>()

  const buildUseCase = (): GetPostById => {
    return new GetPostById(postRepository)
  }
})
