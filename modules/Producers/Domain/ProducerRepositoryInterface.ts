import { RepositoryOptions } from '../../Posts/Domain/PostRepositoryInterface'
import { Producer } from './Producer'

export interface ProducerRepositoryInterface {
  get(repositoryOptions: RepositoryOptions[]): Promise<Producer[]>
}