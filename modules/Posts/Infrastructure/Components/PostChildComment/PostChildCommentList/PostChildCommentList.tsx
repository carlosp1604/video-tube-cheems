import { FC } from 'react'
import styles from './PostChildCommentList.module.scss'
import { PostCommentComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCommentComponentDto'
import { PostChildCommentComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostChildCommentComponentDto'
import { ReactionComponentDto } from '~/modules/Reactions/Infrastructure/Components/ReactionComponentDto'
// eslint-disable-next-line max-len
// eslint-disable-next-line max-len
import {
  PostCommentCardSkeleton
} from '~/modules/Posts/Infrastructure/Components/PostComment/PostCommentCard/PostCommentCardSkeleton/PostCommentCardSkeleton'
import {
  PostCommentWithOptions
} from '~/modules/Posts/Infrastructure/Components/PostComment/PostCommentCard/PostCommentWithOptions/PostCommentWithOptions'
import {
  PostChildCommentWithOptions
} from '~/modules/Posts/Infrastructure/Components/PostChildComment/PostChildCommentWithOptions/PostChildCommentWithOptions'

interface Props {
  postComment: PostCommentComponentDto
  postChildComments: PostChildCommentComponentDto[]
  onDeletePostChildComment: (postCommentId: string) => void
  onClickLikeComment: (commentId: string, userReaction: ReactionComponentDto | null, reactionsNumber: number) => void
  onClickLikeChildComment: (
    childCommentId: string,
    userReaction: ReactionComponentDto | null,
    reactionsNumber: number
  ) => void
  loading:boolean
}

export const PostChildCommentList: FC<Props> = ({
  postComment,
  postChildComments,
  onDeletePostChildComment,
  onClickLikeComment,
  onClickLikeChildComment,
  loading,
}) => {
  const postCommentSkeleton = (
    Array.from(Array(5).keys()).map((index) => (
      <div key={ index } className={ styles.postCommentChildList__postChildCommentSkeletonContainer }>
        <PostCommentCardSkeleton />
      </div>
    )
    )
  )

  const childCommentElements = postChildComments.map((childComment) => {
    return (
      <div
        key={ childComment.id }
        className={ styles.postCommentChildList__postChildCommentContainer }
      >
        <PostChildCommentWithOptions
          postId={ postComment.postId }
          postChildComment={ childComment }
          onDeletePostComment={ () => onDeletePostChildComment(childComment.id) }
          onClickLikeComment={ onClickLikeChildComment }
          optionsDisabled={ false }
        />
      </div>
    )
  })

  return (
    <div className={ styles.postCommentChildList__container }>
      <div className={ styles.postCommentChildList__postCommentContainer }>
        <PostCommentWithOptions
          postComment={ postComment }
          onClickLikeComment={ onClickLikeComment }
          optionsDisabled={ false }
          onDeletePostComment={ undefined }
          onClickReply={ undefined }
          showOptions={ false }
        />
      </div>

      <div className={ styles.postCommentChildList__postChildCommentsListContainer }>
        { childCommentElements }
        { loading && postChildComments.length === 0 ? postCommentSkeleton : null }
      </div>
    </div>
  )
}
