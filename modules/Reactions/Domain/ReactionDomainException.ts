import { DomainException } from '~/modules/Exceptions/Domain/DomainException'

export class ReactionDomainException extends DomainException {
  public static invalidReactionTypeId = 'reaction_invalid_reaction_type'
  public static invalidReactionableTypeId = 'reaction_invalid_reactionable_type'

  public static invalidReactionType (invalidReaction: string): ReactionDomainException {
    return new ReactionDomainException(
      `Reaction type ${invalidReaction} is not valid`,
      this.invalidReactionTypeId
    )
  }

  public static invalidReactionableType (invalidReactionable: string): ReactionDomainException {
    return new ReactionDomainException(
      `Reactionable type ${invalidReactionable} is not valid`,
      this.invalidReactionableTypeId
    )
  }
}
