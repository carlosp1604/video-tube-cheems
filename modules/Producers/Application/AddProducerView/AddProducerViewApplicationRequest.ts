import { Producer } from '~/modules/Producers/Domain/Producer'

export interface AddProducerViewApplicationRequest {
  producerId: Producer['slug']
}
