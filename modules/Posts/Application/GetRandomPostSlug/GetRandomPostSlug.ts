import { PostRepositoryInterface } from '~/modules/Posts/Domain/PostRepositoryInterface'

export class GetRandomPostSlug {
  // eslint-disable-next-line no-useless-constructor
  constructor (private readonly postRepository: PostRepositoryInterface) {}

  public async get (): Promise<string> {
    return this.postRepository.getRandomPostSlug()
  }
}
