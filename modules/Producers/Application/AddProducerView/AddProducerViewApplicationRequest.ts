import { Producer } from '~/modules/Producers/Domain/Producer'
import { User } from '~/modules/Auth/Domain/User'

export interface AddProducerViewApplicationRequest {
  userId: User['id'] | null
  producerSlug: Producer['slug']
}
