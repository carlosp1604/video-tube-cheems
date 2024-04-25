import { ProducerRepositoryInterface } from '~/modules/Producers/Domain/ProducerRepositoryInterface'
import {
  AddProducerViewApplicationRequest
} from '~/modules/Producers/Application/AddProducerView/AddProducerViewApplicationRequest'
import {
  AddProducerViewApplicationException
} from '~/modules/Producers/Application/AddProducerView/AddProducerViewApplicationException'
import { Producer } from '~/modules/Producers/Domain/Producer'

export class AddProducerView {
  // eslint-disable-next-line no-useless-constructor
  constructor (private readonly producerRepository: ProducerRepositoryInterface) {}

  public async add (request: AddProducerViewApplicationRequest): Promise<void> {
    const producer = await this.getProducer(request.producerId)

    try {
      await this.producerRepository.addProducerView(producer.id)
    } catch (exception: unknown) {
      console.error(exception)
      throw AddProducerViewApplicationException.cannotAddView(producer.id)
    }
  }

  private async getProducer (producerId: AddProducerViewApplicationRequest['producerId']): Promise<Producer> {
    const producer = await this.producerRepository.findById(producerId)

    if (producer === null) {
      throw AddProducerViewApplicationException.producerNotFound(producerId)
    }

    return producer as Producer
  }
}
