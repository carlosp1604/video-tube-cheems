import { ProducerApplicationDto } from '~/modules/Producers/Application/ProducerApplicationDto'
import { ProducerComponentDto } from '~/modules/Producers/Infrastructure/Dtos/ProducerComponentDto'

export class ProducerListComponentDtoTranslator {
  public static fromApplication (applicationDto: ProducerApplicationDto): ProducerComponentDto {
    return {
      id: applicationDto.id,
      name: applicationDto.name,
      brandHexColor: applicationDto.brandHexColor,
    }
  }
}
