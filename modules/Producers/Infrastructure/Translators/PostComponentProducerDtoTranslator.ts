import { ProducerApplicationDto } from '../../Application/ProducerApplicationDto'
import { PostComponentProducerDto } from '../Dtos/PostComponentProducerDto'

export class PostComponentProducerDtoTranslator {
  public static fromApplicationDto(applicationDto: ProducerApplicationDto): PostComponentProducerDto {
    return {
      id: applicationDto.id,
      // TODO: Set a default avatar
      imageUrl: applicationDto.imageUrl ?? '',
      name: applicationDto.name,
    }
  }
}