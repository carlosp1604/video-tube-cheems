import { Producer } from './Producer'
import { RepositoryOptions } from '~/modules/Posts/Domain/PostRepositoryInterface'

export interface ProducerRepositoryInterface {
  get(repositoryOptions: RepositoryOptions[]): Promise<Producer[]>
}
