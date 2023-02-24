import { ActorApplicationDto } from '../../../Actors/Application/ActorApplicationDto'
import { ActorComponentDto } from '../Dtos/ActorComponentDto'

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