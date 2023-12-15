import { Dispatch, FC, SetStateAction } from 'react'
import styles from './PostCommentList.module.scss'
import { PostCommentComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCommentComponentDto'
import { PostCommentOptions } from '~/modules/Posts/Infrastructure/Components/PostCommentOptions/PostCommentOptions'
import {
  PostCommentInteractionSection
} from '~/modules/Posts/Infrastructure/Components/PostComment/PostCommentInteractionSection/PostCommentInteractionSection'
import { ReactionComponentDto } from '~/modules/Reactions/Infrastructure/Components/ReactionComponentDto'
import { PostCommentCard } from '~/modules/Posts/Infrastructure/Components/PostComment/PostCommentCard/PostCommentCard'
import {
  PostCommentCardSkeleton
} from '~/modules/Posts/Infrastructure/Components/PostComment/PostCommentCard/PostCommentCardSkeleton/PostCommentCardSkeleton'

interface Props {
  postComments: PostCommentComponentDto[]
  onDeletePostComment: (postCommentId: string) => void
  onClickReply: (comment: PostCommentComponentDto) => void
  onClickLikeComment: (postId: string, userReaction: ReactionComponentDto | null, reactionsNumber: number) => void
  loading: boolean
  setLoading: Dispatch<SetStateAction<boolean>>
}

export const PostCommentList: FC<Props> = ({
  postComments,
  onDeletePostComment,
  onClickReply,
  onClickLikeComment,
  loading,
  setLoading,
}) => {
  const postCommentSkeleton = Array.from(Array(5).keys())
    .map((index) => <PostCommentCardSkeleton key={ index }/>)

  const postCommentElements = postComments.map((comment) => {
    return (
      <div
        className={ styles.postCommentList__postCommentContainer }
        key={ comment.id }
      >
        <div className={ styles.postCommentList__commentWithOptions }>
          <PostCommentCard postComment={ comment } />
          <PostCommentOptions
            ownerId={ comment.user.id }
            onDeleteComment={ () => onDeletePostComment(comment.id) }
            parentCommentId={ null }
            postCommentId={ comment.id }
            postId={ comment.postId }
            loading={ loading }
            setLoading={ setLoading }
          />
        </div>
        <PostCommentInteractionSection
          key={ comment.id }
          postComment={ comment }
          onClickReply={ onClickReply }
          onClickLikeComment={ onClickLikeComment }
          loading={ loading }
          setLoading={ setLoading }
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
