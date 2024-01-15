import { TagApplicationDto } from '~/modules/PostTag/Application/TagApplicationDto'
import { TagComponentDto } from '~/modules/Posts/Infrastructure/Dtos/TagComponentDto'

export class TagComponentDtoTranslator {
  public static fromApplicationDto (applicationDto: TagApplicationDto): TagComponentDto {
    return {
      id: applicationDto.id,
      name: applicationDto.name,
    }
  }
}
