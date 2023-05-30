import { ActorComponentDto } from './ActorComponentDto'
import { ActorApplicationDto } from '~/modules/Actors/Application/ActorApplicationDto'

export class ActorComponentDtoTranslator {
  public static fromApplicationDto (applicationDto: ActorApplicationDto): ActorComponentDto {
    return {
      id: applicationDto.id,
      // TODO: Set a default avatar
      imageUrl: applicationDto.imageUrl ?? '',
      name: applicationDto.name,
    }
  }
}
