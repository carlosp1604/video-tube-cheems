import { ProducerApplicationDto } from '~/modules/Producers/Application/ProducerApplicationDto'
import { ProducerComponentDto } from '~/modules/Producers/Infrastructure/Dtos/ProducerComponentDto'

export class ProducerComponentDtoTranslator {
  public static fromApplication (applicationDto: ProducerApplicationDto): ProducerComponentDto {
    return {
      id: applicationDto.id,
      slug: applicationDto.slug,
      name: applicationDto.name,
      brandHexColor: applicationDto.brandHexColor,
    }
  }
}
