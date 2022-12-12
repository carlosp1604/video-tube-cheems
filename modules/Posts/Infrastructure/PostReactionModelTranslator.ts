import { DateTime } from 'luxon'
import { ObjectionPostReactionModel } from './ObjectionPostReactionModel'
import { PostReaction, Reaction } from '../Domain/PostReaction'
import { ModelObject } from 'objection'

type MysqlPostReactionRow = Partial<ModelObject<ObjectionPostReactionModel>>

export class PostReactionModelTranslator {
  public static toDomain(objectionPostReactionModel: ObjectionPostReactionModel): PostReaction {
    let deletedAt: DateTime | null = null

    if (objectionPostReactionModel.deleted_at !== null) {
      deletedAt = DateTime.fromJSDate(objectionPostReactionModel.deleted_at)
    }

    return new PostReaction(
      objectionPostReactionModel.post_id,
      objectionPostReactionModel.user_id,
      objectionPostReactionModel.reaction_type as Reaction,
      DateTime.fromJSDate(objectionPostReactionModel.created_at),
      DateTime.fromJSDate(objectionPostReactionModel.updated_at),
      deletedAt
    )
  }

  public static toDatabase(postReaction: PostReaction): MysqlPostReactionRow {
    return {
      reaction_type: postReaction.reactionType,
      user_id: postReaction.userId,
      created_at: postReaction.createdAt.toJSDate(),
      deleted_at: postReaction.deletedAt?.toJSDate() ?? null,
      updated_at: postReaction.updatedAt.toJSDate(),
      post_id: postReaction.postId
    }
  }
}