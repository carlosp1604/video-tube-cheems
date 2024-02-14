import { ActorCardDto } from './ActorCardDto'
import { ActorApplicationDto } from '~/modules/Actors/Application/ActorApplicationDto'

export class ActorCardDtoTranslator {
  public static fromApplicationDto (
    applicationDto: ActorApplicationDto,
    postsNumber: number,
    actorViews: number
  ): ActorCardDto {
    return {
      id: applicationDto.id,
      imageUrl: applicationDto.imageUrl,
      name: applicationDto.name,
      slug: applicationDto.slug,
      postsNumber,
      actorViews,
    }
  }
}
