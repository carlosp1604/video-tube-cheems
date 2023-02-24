import { ActorApplicationDto } from '../Application/ActorApplicationDto'
import { ActorComponentDto } from './ActorComponentDto'

export class ActorComponentDtoTranslator {
  public static fromApplicationDto(applicationDto: ActorApplicationDto): ActorComponentDto {
    return {
      id: applicationDto.id,
      // TODO: Set a default avatar
      imageUrl: applicationDto.imageUrl ?? '',
      name: applicationDto.name
    }
  }
}