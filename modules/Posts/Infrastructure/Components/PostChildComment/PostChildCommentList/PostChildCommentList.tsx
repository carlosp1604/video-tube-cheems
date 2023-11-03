import { FC } from 'react'
import styles from './PostChildCommentList.module.scss'
import { PostCommentComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCommentComponentDto'
import { PostCommentOptions } from '~/modules/Posts/Infrastructure/Components/PostCommentOptions/PostCommentOptions'
import { PostChildCommentComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostChildCommentComponentDto'
import { PostCommentCard } from '~/modules/Posts/Infrastructure/Components/PostComment/PostCommentCard/PostCommentCard'
import {
  PostChildCommentCard
} from '~/modules/Posts/Infrastructure/Components/PostChildComment/PostChildCommentCard/PostChildCommentCard'
import { ReactionComponentDto } from '~/modules/Reactions/Infrastructure/Components/ReactionComponentDto'
// eslint-disable-next-line max-len
import { PostChildCommentInteractionSection } from '~/modules/Posts/Infrastructure/Components/PostChildComment/PostChildCommentInteractionSection/PostChildCommentInteractionSection'
// eslint-disable-next-line max-len
import { PostCommentInteractionSection } from '~/modules/Posts/Infrastructure/Components/PostComment/PostCommentInteractionSection/PostCommentInteractionSection'

interface Props {
  postComment: PostCommentComponentDto
  postChildComments: PostChildCommentComponentDto[]
  onDeletePostChildComment: (postCommentId: string) => void
  onClickLikeComment: (postId: string, userReaction: ReactionComponentDto | null, reactionsNumber: number) => void
}

export const PostChildCommentList: FC<Props> = ({
  postComment,
  postChildComments,
  onDeletePostChildComment,
  onClickLikeComment,
}) => {
  const childCommentElements = postChildComments.map((childComment) => {
    return (
      <div className={ styles.postCommentChildList__postChildCommentContainer } key={ childComment.id }>
        <div className={ styles.postCommentChildList__commentWithOptions }>
          <PostChildCommentCard
            postChildComment={ childComment }
            key={ childComment.id }
          />
          <PostCommentOptions
            ownerId={ childComment.user.id }
            postId={ postComment.postId }
            postCommentId={ childComment.id }
            parentCommentId={ childComment.parentCommentId }
            onDeleteComment={ () => onDeletePostChildComment(childComment.id) }
          />
        </div>
        <PostChildCommentInteractionSection postChildComment={ childComment }/>
      </div>
    )
  })

  return (
    <div className={ styles.postCommentChildList__container }>
      <div className={ styles.postCommentChildList__postCommentContainer }>
        <PostCommentCard
          postComment={ postComment }
        />
        <PostCommentInteractionSection
          postComment={ postComment }
          onClickReply={ undefined }
          onClickLikeComment={ onClickLikeComment }
        />
      </div>

      <div className={ styles.postCommentChildList__postChildCommentsListContainer }>
        { childCommentElements }
      </div>
    </div>
  )
}
