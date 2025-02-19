import { FC, ReactNode, useState } from 'react'
import styles from './AddCommentInput.module.scss'
import { AutoSizableTextArea } from './AutoSizableTextArea'
import useTranslation from 'next-translate/useTranslation'
import { useLoginContext } from '~/hooks/LoginContext'
import { useSession } from 'next-auth/react'
import { AiOutlineLoading } from 'react-icons/ai'
import { AvatarImage } from '~/components/AvatarImage/AvatarImage'
import { CommonButton } from '~/modules/Shared/Infrastructure/Components/CommonButton/CommonButton'
import { useToast } from '~/components/AppToast/ToastContext'
import { IconButton } from '~/components/IconButton/IconButton'
import { BiCommentAdd } from 'react-icons/bi'

interface Props {
  onAddComment: (comment: string) => void
  disabled: boolean
}

export const AddCommentInput: FC<Props> = ({ onAddComment, disabled }) => {
  const [comment, setComment] = useState<string>('')
  const { t } = useTranslation('post_comments')

  const { setLoginModalOpen } = useLoginContext()
  const { error } = useToast()
  const { status, data } = useSession()

  let avatar = null

  if (status === 'authenticated' && data && data.user) {
    avatar = (
      <AvatarImage
        imageUrl={ data.user.image ?? null }
        avatarClassName={ styles.addCommentInput__userAvatar }
        imageClassName={ styles.addCommentInput__userAvatar }
        avatarName={ data.user.name ?? '' }
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
        <CommonButton
          title={ t('add_comment_section_login_button_title') }
          disabled={ false }
          onClick={ () => setLoginModalOpen(true) }
        />
      </div>
    )
  }

  if (status === 'authenticated') {
    const onClickAddComment = (comment: string) => {
      if (disabled) {
        error(t('action_cannot_be_performed_error_message'))

        return
      }

      onAddComment(comment)
      setComment('')
    }

    content = (
      <div className={ styles.addCommentInput__addCommentSection }>
        { avatar }
        <AutoSizableTextArea
          placeHolder={ t('add_comment_placeholder') }
          comment={ comment }
          onCommentChange={ (value) => setComment(value) }
          disabled={ disabled }
        />
        <div className={ styles.addCommentInput__addCommentButton }>
          <IconButton
            onClick={ () => onClickAddComment(comment) }
            icon={ <BiCommentAdd /> }
            title={ t('add_comment_button_title') }
            disabled={ disabled }
            showTooltip={ true }
          />
        </div>
      </div>
    )
  }

  return content
}
