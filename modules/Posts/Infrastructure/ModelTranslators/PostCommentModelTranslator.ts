import { DateTime } from 'luxon'
import { ObjectionPostCommentModel } from '../ObjectionModels/ObjectionPostCommentModel'
import { PostComment } from '../../Domain/PostComment'
import { UserModelTranslator } from '../../../Auth/Infrastructure/UserModelTranslator'
import { ModelObject } from 'objection'

type MysqlPostCommentRow = Partial<ModelObject<ObjectionPostCommentModel>>

export class PostCommentModelTranslator {
  public static toDomain(objectionPostCommentModel: ObjectionPostCommentModel): PostComment {
    let deletedAt: DateTime | null = null

    if (objectionPostCommentModel.deleted_at !== null) {
      deletedAt = DateTime.fromJSDate(objectionPostCommentModel.deleted_at)
    }

    const postComment = new PostComment(
      objectionPostCommentModel.id,
      objectionPostCommentModel.comment,
      objectionPostCommentModel.post_id,
      objectionPostCommentModel.user_id,
      objectionPostCommentModel.parent_comment_id,
      DateTime.fromJSDate(objectionPostCommentModel.created_at),
      DateTime.fromJSDate(objectionPostCommentModel.updated_at),
      deletedAt
    )

    const userDomain = UserModelTranslator.toDomain(objectionPostCommentModel.user)
    postComment.setUser(userDomain)

    if (objectionPostCommentModel.childComments !== undefined) {
      objectionPostCommentModel.childComments.forEach((childComment) => {
        postComment.addChildComment(PostCommentModelTranslator.toDomain(childComment))
      })
    }

    return postComment
  }

  public static toDatabase(postComment: PostComment): MysqlPostCommentRow {
    return {
      id: postComment.id,
      comment: postComment.comment,
      user_id: postComment.userId,
      parent_comment_id: postComment.parentCommentId,
      created_at: postComment.createdAt.toJSDate(),
      deleted_at: postComment.deletedAt?.toJSDate() ?? null,
      updated_at: postComment.updatedAt.toJSDate(),
      post_id: postComment.postId
    }
  }
}