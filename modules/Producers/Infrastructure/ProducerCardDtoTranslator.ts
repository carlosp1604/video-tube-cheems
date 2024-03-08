import { ProducerCardDto } from '~/modules/Producers/Infrastructure/ProducerCardDto'
import { ProducerApplicationDto } from '~/modules/Producers/Application/ProducerApplicationDto'

export class ProducerCardDtoTranslator {
  public static fromApplicationDto (
    applicationDto: ProducerApplicationDto,
    postsNumber: number,
    producerViews: number
  ): ProducerCardDto {
    return {
      id: applicationDto.id,
      imageUrl: applicationDto.imageUrl,
      name: applicationDto.name,
      slug: applicationDto.slug,
      brandHexColor: applicationDto.brandHexColor,
      postsNumber,
      producerViews,
    }
  }
}
