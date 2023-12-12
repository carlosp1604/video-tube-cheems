import { FC, ReactNode, useState } from 'react'
import styles from './AddCommentInput.module.scss'
import { BsChatDots } from 'react-icons/bs'
import { AutoSizableTextArea } from './AutoSizableTextArea'
import { useTranslation } from 'next-i18next'
import { useLoginContext } from '~/hooks/LoginContext'
import { useSession } from 'next-auth/react'
import { AiOutlineLoading } from 'react-icons/ai'
import { AvatarImage } from '~/components/AvatarImage/AvatarImage'

interface Props {
  onAddComment: (comment: string) => void
}

export const AddCommentInput: FC<Props> = ({ onAddComment }) => {
  const [comment, setComment] = useState<string>('')
  const { t } = useTranslation('post_comments')

  const { setLoginModalOpen } = useLoginContext()

  const { status, data } = useSession()

  let avatar = null

  if (status === 'authenticated' && data && data.user) {
    avatar = (
      <AvatarImage
        imageUrl={ data.user.image ?? null }
        avatarClassName={ styles.addCommentInput__userAvatar }
        imageClassName={ styles.addCommentInput__userAvatar }
        avatarName={ data.user.name ?? '' }
        size={ '28' }
        round={ true }
        imageAlt={ data.user.name ?? '' }
      />
    )
  }

  let content: ReactNode | null = null

  if (status === 'loading') {
    content = (
      <div className={ styles.addCommentInput__loadingSection }>
        <AiOutlineLoading className={ styles.addCommentInput__loadingIcon }/>
      </div>
    )
  }

  if (status === 'unauthenticated') {
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

  if (status === 'authenticated') {
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
  }

  return content
}
