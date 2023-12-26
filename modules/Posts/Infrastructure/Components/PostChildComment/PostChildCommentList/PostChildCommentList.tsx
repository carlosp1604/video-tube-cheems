import { FC } from 'react'
import styles from './PostChildCommentList.module.scss'
import { PostCommentComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCommentComponentDto'
import { PostChildCommentComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostChildCommentComponentDto'
import { ReactionComponentDto } from '~/modules/Reactions/Infrastructure/Components/ReactionComponentDto'
// eslint-disable-next-line max-len
import { PostCommentCardSkeleton } from '~/modules/Posts/Infrastructure/Components/PostComment/PostCommentCard/PostCommentCardSkeleton/PostCommentCardSkeleton'
// eslint-disable-next-line max-len
import { PostCommentWithOptions } from '~/modules/Posts/Infrastructure/Components/PostComment/PostCommentCard/PostCommentWithOptions/PostCommentWithOptions'
// eslint-disable-next-line max-len
import { PostChildCommentWithOptions } from '~/modules/Posts/Infrastructure/Components/PostChildComment/PostChildCommentWithOptions/PostChildCommentWithOptions'

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
  creatingChildComment: boolean
}

export const PostChildCommentList: FC<Props> = ({
  postComment,
  postChildComments,
  onDeletePostChildComment,
  onClickLikeComment,
  onClickLikeChildComment,
  loading,
  creatingChildComment,
}) => {
  let postChildCommentSkeletonNumber = 10

  if (postComment.repliesNumber > 0 && postComment.repliesNumber < 10) {
    postChildCommentSkeletonNumber = postComment.repliesNumber
  }
  const postChildCommentSkeleton = (
    Array.from(Array(postChildCommentSkeletonNumber).keys()).map((index) => (
      <div key={ index } className={ styles.postCommentChildList__postChildCommentSkeletonContainer }>
        <PostCommentCardSkeleton />
      </div>
    ))
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
          optionsDisabled={ loading }
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
          optionsDisabled={ loading }
          onDeletePostComment={ undefined }
          onClickReply={ undefined }
          showOptions={ false }
        />
      </div>

      <div className={ loading ? styles.postCommentChildList__postChildCommentListContainerLoading : '' }>
        { creatingChildComment
          ? <div className={ styles.postCommentChildList__postChildCommentSkeletonContainer }>
              <PostCommentCardSkeleton/>
            </div>
          : null
        }
        { childCommentElements }
        { loading && !creatingChildComment && postChildComments.length === 0 ? postChildCommentSkeleton : null }
      </div>
    </div>
  )
}
