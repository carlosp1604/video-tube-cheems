import { ActorApplicationDtoTranslator } from './ActorApplicationDtoTranslator'
import { GetActorsApplicationDto } from './GetActorsApplicationDto'
import { Actor } from '~/modules/Actors/Domain/Actor'

export class GetActorsApplicationDtoTranslator {
  public static fromDomain (
    actors: Actor[],
    actorsNumber: number
  ): GetActorsApplicationDto {
    return {
      actors: actors.map((actor) => ActorApplicationDtoTranslator.fromDomain(actor)),
      actorsNumber,
    }
  }
}
