import { DomainException } from '~/modules/Exceptions/Domain/DomainException'
import { Reaction } from '~/modules/Reactions/Domain/Reaction'

export class ReactionableModelDomainException extends DomainException {
  public static cannotAddReactionId = 'reactionable_model_domain_cannot_add_reaction'
  public static cannotUpdateReactionId = 'reactionable_model_domain_cannot_update_reaction'
  public static userAlreadyReactedId = 'reactionable_model_domain_user_already_reacted'
  public static userHasNotReactedId = 'reactionable_model_domain_user_has_not_reacted'
  public static cannotDeleteReactionId = 'reactionable_model_domain_cannot_delete_reaction'

  constructor (message: string, id: string) {
    super(message, id)

    Object.setPrototypeOf(this, ReactionableModelDomainException.prototype)
  }

  public static cannotAddReaction (
    userId: Reaction['userId'],
    reactionableId: Reaction['reactionableId'],
    reactionableType: Reaction['reactionableType']
  ): ReactionableModelDomainException {
    return new ReactionableModelDomainException(
      `Cannot add reaction from user with ID ${userId} to ${reactionableType} with ID ${reactionableId}`,
      this.cannotAddReactionId
    )
  }

  public static cannotUpdateReaction (
    userId: Reaction['userId'],
    reactionableId: Reaction['reactionableId'],
    reactionableType: Reaction['reactionableType']
  ): ReactionableModelDomainException {
    return new ReactionableModelDomainException(
      `Cannot update reaction from user with ID ${userId} in the ${reactionableType} with ID ${reactionableId}`,
      this.cannotUpdateReactionId
    )
  }

  public static userAlreadyReacted (
    userId: Reaction['userId'],
    reactionableId: Reaction['reactionableId'],
    reactionableType: Reaction['reactionableType']
  ): ReactionableModelDomainException {
    return new ReactionableModelDomainException(
      `User with ID ${userId} already reacted to ${reactionableType} with ID ${reactionableId}`,
      this.userAlreadyReactedId
    )
  }

  public static userHasNotReacted (
    userId: Reaction['userId'],
    reactionableId: Reaction['reactionableId'],
    reactionableType: Reaction['reactionableType']
  ): ReactionableModelDomainException {
    return new ReactionableModelDomainException(
      `User with ID ${userId} has not reacted to ${reactionableType} with ID ${reactionableId}`,
      this.userHasNotReactedId
    )
  }

  public static cannotDeleteReaction (
    userId: Reaction['userId'],
    reactionableId: Reaction['reactionableId'],
    reactionableType: Reaction['reactionableType']
  ): ReactionableModelDomainException {
    return new ReactionableModelDomainException(
      `Cannot delete reaction from user with ID ${userId} in ${reactionableType} with ID ${reactionableId}`,
      this.cannotDeleteReactionId
    )
  }
}
