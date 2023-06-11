import { DomainException } from '~/modules/Exceptions/Domain/DomainException'

export class PostReactionDomainException extends DomainException {
  public static invalidReactionTypeId = 'post_reaction_invalid_post_reaction_type'

  public static invalidReactionType (invalidReaction: string): PostReactionDomainException {
    return new PostReactionDomainException(
      `Reaction type ${invalidReaction} is not valid`,
      this.invalidReactionTypeId
    )
  }
}
