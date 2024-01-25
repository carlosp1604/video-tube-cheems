import { Dispatch, FC, ReactElement, ReactNode, SetStateAction, useState } from 'react'
import styles from './PostCommentOptions.module.scss'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { MenuDropdown } from '~/components/MenuDropdown/MenuDropdown'
import { FiTrash } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useTranslation } from 'next-i18next'
import { CommentsApiService } from '~/modules/Posts/Infrastructure/Frontend/CommentsApiService'
import { APIException } from '~/modules/Shared/Infrastructure/FrontEnd/ApiException'
import { signOut, useSession } from 'next-auth/react'
import { POST_COMMENT_USER_NOT_FOUND } from '~/modules/Posts/Infrastructure/Api/PostApiExceptionCodes'

interface Props {
  ownerId: string
  onDeleteComment: (postCommentId: string) => void
  postId: string
  postCommentId: string
  parentCommentId: string | null
  loading: boolean
  setLoading: Dispatch<SetStateAction<boolean>>
}

export const PostCommentOptions: FC<Props> = ({
  ownerId,
  postId,
  parentCommentId,
  postCommentId,
  onDeleteComment,
  loading,
  setLoading,
}) => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false)

  const { t } = useTranslation(['post_comments', 'api_exceptions'])
  const { data } = useSession()

  const onClickDelete = async () => {
    if (loading) {
      toast.error('No se puede ejecutar esta acción en este momento')

      return
    }

    setLoading(true)

    try {
      await new CommentsApiService().delete(postId, postCommentId, parentCommentId)
      onDeleteComment(postCommentId)

      toast.success(t('post_comment_deleted_success_message'))
    } catch (exception: unknown) {
      if (!(exception instanceof APIException)) {
        console.error(exception)

        return
      }

      if (exception.code === POST_COMMENT_USER_NOT_FOUND) {
        await signOut({ redirect: false })
      }

      toast.error(t(exception.translationKey, { ns: 'api_exceptions' }))
    }

    setLoading(false)
  }

  let content: ReactNode | null = null
  const menuDropdownIcon: ReactElement = (
    <BsThreeDotsVertical className={ `
      ${styles.postCommentOptions__optionsIcon}
      ${menuOpen ? styles.postCommentOptions__optionsIcon_open : ''}
    ` }
      onClick={ () => setMenuOpen(!menuOpen) }
    />
  )

  if (ownerId === data?.user.id) {
    content = (
      <MenuDropdown
        buttonIcon={ menuDropdownIcon }
        isOpen={ menuOpen }
        setIsOpen={ setMenuOpen }
        options={ [{
          title: t('delete_comment_option_title'),
          icon: <FiTrash />,
          onClick: async () => { await onClickDelete() },
        }] }
        title={ t('post_comment_menu_options_title') }
      />
    )
  }

  return content
}
