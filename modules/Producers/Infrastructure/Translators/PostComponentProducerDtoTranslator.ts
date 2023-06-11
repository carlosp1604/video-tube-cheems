import { ProducerApplicationDto } from '~/modules/Producers/Application/ProducerApplicationDto'
import { PostComponentProducerDto } from '~/modules/Producers/Infrastructure/Dtos/PostComponentProducerDto'

export class PostComponentProducerDtoTranslator {
  public static fromApplicationDto (applicationDto: ProducerApplicationDto): PostComponentProducerDto {
    return {
      id: applicationDto.id,
      // TODO: Set a default avatar
      imageUrl: applicationDto.imageUrl ?? '',
      name: applicationDto.name,
    }
  }
}
