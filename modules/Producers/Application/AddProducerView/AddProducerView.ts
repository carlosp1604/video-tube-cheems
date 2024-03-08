import { User } from '~/modules/Auth/Domain/User'
import { randomUUID } from 'crypto'
import { DateTime } from 'luxon'
import { UserRepositoryInterface } from '~/modules/Auth/Domain/UserRepositoryInterface'
import { View } from '~/modules/Views/Domain/View'
import {
  AddActorViewApplicationException
} from '~/modules/Actors/Application/AddActorView/AddActorViewApplicationException'
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
  constructor (
    private readonly producerRepository: ProducerRepositoryInterface,
    private readonly userRepository: UserRepositoryInterface
  ) {}

  public async add (request: AddProducerViewApplicationRequest): Promise<void> {
    const producer = await this.getProducer(request.producerSlug)

    if (request.userId !== null) {
      await this.getUser(request.userId)
    }

    try {
      const postView = new View(
        randomUUID(),
        producer.id,
        'Producer',
        request.userId,
        DateTime.now()
      )

      await this.producerRepository.createProducerView(producer.id, postView)
    } catch (exception: unknown) {
      console.error(exception)
      throw AddProducerViewApplicationException.cannotAddView(producer.id)
    }
  }

  private async getProducer (producerSlug: AddProducerViewApplicationRequest['producerSlug']): Promise<Producer> {
    const producer = await this.producerRepository.findBySlug(producerSlug)

    if (producer === null) {
      throw AddProducerViewApplicationException.producerNotFound(producerSlug)
    }

    return producer as Producer
  }

  private async getUser (userId: AddProducerViewApplicationRequest['userId']): Promise<User> {
    const user = await this.userRepository.findById(userId as string)

    if (user === null) {
      throw AddActorViewApplicationException.userNotFound(userId as string)
    }

    return user
  }
}
