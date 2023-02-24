import { ActorApplicationDto } from '../Application/ActorApplicationDto'
import { ActorPageComponentDto } from './ActorPageComponentDto'

export class ActorPageComponentDtoTranslator {
  public static fromApplicationDto(applicationDto: ActorApplicationDto): ActorPageComponentDto {
    return {
      id: applicationDto.id,
      // TODO: Set a default avatar
      imageUrl: applicationDto.imageUrl ?? '',
      name: applicationDto.name,
      description: applicationDto.description 
    }
  }
}