import { FC } from 'react'
import { PostCommentCard } from './PostCommentCard'
import styles from './PostCommentList.module.scss'
import { PostCommentComponentDto } from '~/modules/Posts/Infrastructure/Dtos/PostCommentComponentDto'
import { useTranslation } from 'next-i18next'
import { PostCommentOptions } from '~/modules/Posts/Infrastructure/Components/PostCommentOptions/PostCommentOptions'

interface Props {
  postComments: PostCommentComponentDto[]
  onDeletePostComment: (postCommentId: string) => void
  onClickReply: (comment: PostCommentComponentDto) => void
}

export const PostCommentList: FC<Props> = ({ postComments, onDeletePostComment, onClickReply }) => {
  const { t } = useTranslation('post_comments')

  return (
    <div className={ styles.postCommentList__container }>
      { postComments.map((comment) => {
        return (
          <div className={ styles.postCommentList__postCommentContainer } key={ comment.id }>
            <div className={ styles.postCommentList__commentWithOptions }>
              <PostCommentCard
                postComment={ comment }
                key={ comment.id }
              />
              <PostCommentOptions
                ownerId={ comment.user.id }
                onDeleteComment={ () => onDeletePostComment(comment.id) }
                parentCommentId={ null }
                postCommentId={ comment.id }
                postId={ comment.postId }
              />

            </div>
            <button
              className={ styles.postCommentList__repliesButton }
              onClick={ () => onClickReply(comment) }
            >
              { comment.repliesNumber > 0
                ? t('comment_replies_button', { replies: comment.repliesNumber })
                : t('comment_reply_button')
              }
            </button>
          </div>
        )
      }) }
    </div>
  )
}
