import { ActorApplicationDtoTranslator } from '~/modules/Actors/Application/ActorApplicationDtoTranslator'
import { GetActorsApplicationResponseDto } from './GetActorsApplicationResponseDto'
import { ActorsWithPostsCountWithTotalCount } from '~/modules/Actors/Domain/ActorWithCountInterface'

export class GetActorsApplicationResponseDtoTranslator {
  public static fromDomain (domainDto: ActorsWithPostsCountWithTotalCount): GetActorsApplicationResponseDto {
    const actors = domainDto.actors.map((actorWithPostsCount) => {
      return {
        actor: ActorApplicationDtoTranslator.fromDomain(actorWithPostsCount.actor),
        postsNumber: actorWithPostsCount.postsNumber,
      }
    })

    return {
      actors,
      actorsNumber: domainDto.actorsNumber,
    }
  }
}
