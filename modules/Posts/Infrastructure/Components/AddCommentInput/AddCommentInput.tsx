import { FC, ReactNode, useState } from 'react'
import styles from './AddCommentInput.module.scss'
import { BsChatDots } from 'react-icons/bs'
import { AutoSizableTextArea } from './AutoSizableTextArea'
import Avatar from 'react-avatar'
import { useUserContext } from '~/hooks/UserContext'
import { usePostCommentable } from '~/hooks/CommentableContext'
import { useTranslation } from 'next-i18next'
import { useLoginContext } from '~/hooks/LoginContext'
import Image from 'next/image'

interface Props {
  onAddComment: (comment: string) => void
}

export const AddCommentInput: FC<Props> = ({ onAddComment }) => {
  const [comment, setComment] = useState<string>('')
  const { t } = useTranslation('post_comments')

  const { setLoginModalOpen } = useLoginContext()

  const { user } = useUserContext()
  const commentable = usePostCommentable()

  let avatar = null

  if (user !== null) {
    if (user?.image !== null) {
      avatar = (
        <Image
          className={ styles.commentCard__userLogo }
          src={ user.image ?? '' }
          alt={ user.name }
          width={ 0 }
          height={ 0 }
          sizes={ '100vw' }
        />
      )
    } else {
      avatar = (
        <Avatar
          className={ styles.commentCard__userLogo }
          round={ true }
          size={ '28' }
          name={ user.name }
          textSizeRatio={ 2 }
        />)
    }
  }

  let content: ReactNode | null

  if (commentable) {
    content = (
      <div className={ styles.addCommentInput__addCommentSection }>
        { avatar }
        <AutoSizableTextArea
          placeHolder={ t('add_comment_placeholder') }
          comment={ comment }
          onCommentChange={ (value) => setComment(value) }
        />
        <button className={ styles.addCommentInput__addCommentButton }>
          <BsChatDots
            className={ styles.addCommentInput__addCommentIcon }
            onClick={ () => {
              onAddComment(comment)
              setComment('')
            } }
            title={ t('add_comment_button_title') }
          />
        </button>
      </div>
    )
  } else {
    content = (
      <div className={ styles.addCommentInput__loginToCommentSection }>
        { t('add_comment_section_login_title') }
        <button
          className={ styles.addCommentInput__loginButton }
          onClick={ () => setLoginModalOpen(true) }
        >
          { t('add_comment_section_login_button_title') }
        </button>
      </div>
    )
  }

  return content
}
