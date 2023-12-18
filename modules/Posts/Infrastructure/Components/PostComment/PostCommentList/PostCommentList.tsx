import { FC } from 'react'
import styles from './PostCommentList.module.scss'
import { PostCommentComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCommentComponentDto'
import { ReactionComponentDto } from '~/modules/Reactions/Infrastructure/Components/ReactionComponentDto'
// eslint-disable-next-line max-len
import { PostCommentCardSkeleton } from '~/modules/Posts/Infrastructure/Components/PostComment/PostCommentCard/PostCommentCardSkeleton/PostCommentCardSkeleton'
// eslint-disable-next-line max-len
import { PostCommentWithOptions } from '~/modules/Posts/Infrastructure/Components/PostComment/PostCommentCard/PostCommentWithOptions/PostCommentWithOptions'

interface Props {
  postComments: PostCommentComponentDto[]
  onDeletePostComment: (postCommentId: string) => void
  onClickReply: (comment: PostCommentComponentDto) => void
  onClickLikeComment: (postId: string, userReaction: ReactionComponentDto | null, reactionsNumber: number) => void
  loading: boolean
}

export const PostCommentList: FC<Props> = ({
  postComments,
  onDeletePostComment,
  onClickReply,
  onClickLikeComment,
  loading,
}) => {
  const postCommentSkeleton = Array.from(Array(5).keys())
    .map((index) => <PostCommentCardSkeleton key={ index }/>)

  const postCommentElements = postComments.map((postComment) => {
    return (
      <div
        key={ postComment.id }
        className={ styles.postCommentList__postCommentContainer }
      >
        <PostCommentWithOptions
          postComment={ postComment }
          onDeletePostComment={ onDeletePostComment }
          onClickReply={ onClickReply }
          onClickLikeComment={ onClickLikeComment }
          optionsDisabled={ loading }
        />
      </div>

    )
  })

  return (
    <div className={ `
      ${styles.postCommentList__container}
      ${loading ? styles.postCommentList__container_loading : ''}
    ` } >
      { postCommentElements }
      { loading && postComments.length === 0 ? postCommentSkeleton : null }
    </div>
  )
}
