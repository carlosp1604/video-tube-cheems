import { ApplicationException } from '~/modules/Exceptions/Application/ApplicationException'
import { Producer } from '~/modules/Producers/Domain/Producer'

export class AddProducerViewApplicationException extends ApplicationException {
  public static cannotAddProducerViewId = 'add_producer_view_cannot_add_producer_view'
  public static producerNotFoundId = 'add_producer_view_producer_not_found'

  constructor (message: string, id: string) {
    super(message, id)

    Object.setPrototypeOf(this, AddProducerViewApplicationException.prototype)
  }

  public static producerNotFound (producerId: Producer['id']): AddProducerViewApplicationException {
    return new AddProducerViewApplicationException(
      `Producer with ID ${producerId} was not found`,
      this.producerNotFoundId
    )
  }

  public static cannotAddView (producerId: Producer['id']): AddProducerViewApplicationException {
    return new AddProducerViewApplicationException(
      `Cannot add a new view for producer with ID ${producerId}`,
      this.cannotAddProducerViewId
    )
  }
}
