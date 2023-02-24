import { TagApplicationDto } from '../../Application/Dtos/TagApplicationDto'
import { TagComponentDto } from '../Dtos/TagComponentDto'

export class TagComponentDtoTranslator {
  public static fromApplicationDto(applicationDto: TagApplicationDto): TagComponentDto {
    return {
      id: applicationDto.id,
      name: applicationDto.name,
    }
  }
}