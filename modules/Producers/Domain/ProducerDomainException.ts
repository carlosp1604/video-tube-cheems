import { Producer } from './Producer'
import { DomainException } from '~/modules/Exceptions/Domain/DomainException'

export class ProducerDomainException extends DomainException {
  public static producerParentAlreadySetId = 'producer_domain_parent_producer_already_set'

  public static parentCommentNotFound (
    producerId: Producer['id']
  ): ProducerDomainException {
    return new ProducerDomainException(
      `Producer with ID ${producerId} already set`,
      this.producerParentAlreadySetId
    )
  }
}
