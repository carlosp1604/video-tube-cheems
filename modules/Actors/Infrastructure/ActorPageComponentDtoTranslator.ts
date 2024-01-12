import { ActorPageComponentDto } from './ActorPageComponentDto'
import { ActorApplicationDto } from '~/modules/Actors/Application/ActorApplicationDto'

export class ActorPageComponentDtoTranslator {
  public static fromApplicationDto (applicationDto: ActorApplicationDto): ActorPageComponentDto {
    return {
      id: applicationDto.id,
      slug: applicationDto.slug,
      imageUrl: applicationDto.imageUrl,
      name: applicationDto.name,
      description: applicationDto.description,
    }
  }
}
