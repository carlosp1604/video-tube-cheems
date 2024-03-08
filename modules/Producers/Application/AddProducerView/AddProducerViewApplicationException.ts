import { ApplicationException } from '~/modules/Exceptions/Application/ApplicationException'
import { User } from '~/modules/Auth/Domain/User'
import { Producer } from '~/modules/Producers/Domain/Producer'

export class AddProducerViewApplicationException extends ApplicationException {
  public static cannotAddProducerViewId = 'add_producer_view_cannot_add_producer_view'
  public static producerNotFoundId = 'add_producer_view_producer_not_found'
  public static userNotFoundId = 'add_producer_view_user_not_found'

  constructor (message: string, id: string) {
    super(message, id)

    Object.setPrototypeOf(this, AddProducerViewApplicationException.prototype)
  }

  public static producerNotFound (producerSlug: Producer['slug']): AddProducerViewApplicationException {
    return new AddProducerViewApplicationException(
      `Producer with slug ${producerSlug} was not found`,
      this.producerNotFoundId
    )
  }

  public static userNotFound (userId: User['id']): AddProducerViewApplicationException {
    return new AddProducerViewApplicationException(
      `User with ID ${userId} was not found`,
      this.userNotFoundId
    )
  }

  public static cannotAddView (producerId: Producer['id']): AddProducerViewApplicationException {
    return new AddProducerViewApplicationException(
      `Cannot add a new view for producer with ID ${producerId}`,
      this.cannotAddProducerViewId
    )
  }
}
