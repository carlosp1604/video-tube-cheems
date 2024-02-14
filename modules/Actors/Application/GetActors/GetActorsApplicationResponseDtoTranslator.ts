import { ActorApplicationDtoTranslator } from '~/modules/Actors/Application/ActorApplicationDtoTranslator'
import { GetActorsApplicationResponseDto } from './GetActorsApplicationResponseDto'
import { ActorsWithPostsCountViewsCountWithTotalCount } from '~/modules/Actors/Domain/ActorWithCountInterface'

export class GetActorsApplicationResponseDtoTranslator {
  public static fromDomain (domainDto: ActorsWithPostsCountViewsCountWithTotalCount): GetActorsApplicationResponseDto {
    const actors = domainDto.actors.map((actorWithPostsCount) => {
      return {
        actor: ActorApplicationDtoTranslator.fromDomain(actorWithPostsCount.actor),
        postsNumber: actorWithPostsCount.postsNumber,
        actorViews: actorWithPostsCount.actorViews,
      }
    })

    return {
      actors,
      actorsNumber: domainDto.actorsNumber,
    }
  }
}
