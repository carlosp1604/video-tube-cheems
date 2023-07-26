import { FC, ReactElement, ReactNode, useState } from 'react'
import styles from './PostCommentOptions.module.scss'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { MenuDropdown } from '~/components/MenuDropdown/MenuDropdown'
import { useUserContext } from '~/hooks/UserContext'
import { FiTrash } from 'react-icons/fi'
import { PostsApiService } from '~/modules/Posts/Infrastructure/Frontend/PostsApiService'
import toast from 'react-hot-toast'
import { useTranslation } from 'next-i18next'
import {
  POST_CHILD_COMMENT_PARENT_COMMENT_NOT_FOUND, POST_COMMENT_COMMENT_NOT_FOUND,
  POST_COMMENT_POST_NOT_FOUND
} from '~/modules/Posts/Infrastructure/PostApiExceptionCodes'

interface Props {
  ownerId: string
  onDeleteComment: (postCommentId: string) => void
  postId: string
  postCommentId: string
  parentCommentId: string | null
}

export const PostCommentOptions: FC<Props> = ({ ownerId, postId, parentCommentId, postCommentId, onDeleteComment }) => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false)

  const { t } = useTranslation('post_comments')

  const postsApiService = new PostsApiService()

  const { user } = useUserContext()

  const onClickDelete = async () => {
    try {
      const response = await postsApiService.deletePostComment(postId, postCommentId, parentCommentId)

      if (!response.ok) {
        switch (response.status) {
          case 400:
            toast.error(t('bad_request_error_message'))
            break

          case 401:
            toast.error(t('user_must_be_authenticated_error_message'))
            break

          case 403:
            toast.error(t('post_comment_does_not_belong_to_user_error_message'))
            break

          case 404: {
            const jsonResponse = await response.json()

            switch (jsonResponse.code) {
              case POST_COMMENT_POST_NOT_FOUND:
                toast.error('delete_post_comment_post_not_found_error_message')
                break

              case POST_CHILD_COMMENT_PARENT_COMMENT_NOT_FOUND:
                toast.error('parent_comment_not_found_error_message')
                break

              case POST_COMMENT_COMMENT_NOT_FOUND:
                toast.error('post_comment_not_found_error_message')
                break

              default:
                toast.error('server_error_error_message')
                break
            }
            break
          }

          default:
            toast.error('server_error_error_message')
            break
        }
      } else {
        onDeleteComment(postCommentId)
      }
    } catch (exception: unknown) {
      console.error(exception)
      toast.error('server_error_error_message')
    }
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

  if (ownerId === user?.id) {
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
