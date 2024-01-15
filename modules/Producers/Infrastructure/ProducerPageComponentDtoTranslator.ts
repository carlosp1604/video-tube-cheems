import { ProducerApplicationDto } from '~/modules/Producers/Application/ProducerApplicationDto'
import { ProducerPageComponentDto } from '~/modules/Producers/Infrastructure/ProducerPageComponentDto'

export class ProducerPageComponentDtoTranslator {
  public static fromApplicationDto (applicationDto: ProducerApplicationDto): ProducerPageComponentDto {
    return {
      id: applicationDto.id,
      slug: applicationDto.slug,
      imageUrl: applicationDto.imageUrl,
      name: applicationDto.name,
      description: applicationDto.description,
      brandHexColor: applicationDto.brandHexColor,
    }
  }
}
