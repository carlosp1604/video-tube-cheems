import { Actor } from '../Domain/Actor'
import { ActorApplicationDtoTranslator } from './ActorApplicationDtoTranslator'
import { GetActorsApplicationDto } from './GetActorsApplicationDto.ts'

export class GetActorsApplicationDtoTranslator {
  public static fromDomain(
    actors: Actor[],
    actorsNumber: number
  ): GetActorsApplicationDto {
    return {
      actors: actors.map((actor) => ActorApplicationDtoTranslator.fromDomain(actor)),
      actorsNumber
    }
  }
}