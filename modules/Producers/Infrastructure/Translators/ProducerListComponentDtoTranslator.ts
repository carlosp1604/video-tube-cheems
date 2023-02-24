import { ProducerApplicationDto } from '../../Application/ProducerApplicationDto'
import { ProducerComponentDto } from '../Dtos/ProducerComponentDto'

export class ProducerListComponentDtoTranslator {
  public static fromApplication(applicationDto: ProducerApplicationDto): ProducerComponentDto {
    return {
      id: applicationDto.id,
      name: applicationDto.name,
      brandHexColor: applicationDto.brandHexColor
    }
  }
}