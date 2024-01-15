import { ApplicationException } from '~/modules/Exceptions/Application/ApplicationException'
import { Producer } from '~/modules/Producers/Domain/Producer'

export class GetProducerBySlugApplicationException extends ApplicationException {
  public static producerNotFoundId = 'get_producer_by_slug_producer_not_found'

  constructor (message: string, id: string) {
    super(message, id)

    Object.setPrototypeOf(this, GetProducerBySlugApplicationException.prototype)
  }

  public static producerNotFound (producerSlug: Producer['slug']): GetProducerBySlugApplicationException {
    return new GetProducerBySlugApplicationException(
      `Producer with slug ${producerSlug} was not found`,
      this.producerNotFoundId
    )
  }
}
