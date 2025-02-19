import { ActorApplicationDto } from '~/modules/Actors/Application/ActorApplicationDto'
import { ProducerApplicationDto } from '~/modules/Producers/Application/ProducerApplicationDto'
import { ProfileCardDto } from '~/modules/Shared/Infrastructure/FrontEnd/ProfileCardDto'

export class ProfileCardDtoTranslator {
  public static fromApplicationDto (
    applicationDto: ActorApplicationDto | ProducerApplicationDto,
    postsNumber: number,
    viewsNumber: number
  ): ProfileCardDto {
    return {
      id: applicationDto.id,
      imageUrl: applicationDto.imageUrl,
      name: applicationDto.name,
      slug: applicationDto.slug,
      postsNumber,
      viewsNumber,
    }
  }
}
