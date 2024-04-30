import { FC, ReactElement } from 'react'
import styles from './PaginationBarButton.module.scss'
import Link from 'next/link'
import { ElementLinkMode } from '~/modules/Shared/Infrastructure/FrontEnd/ElementLinkMode'
import { Url } from 'url'

export type HideDirectionOnDisable = 'left' | 'right'

interface Props {
  title: string
  linkTitle: string | ReactElement
  href: Partial<Url>
  active: boolean
  disabled: boolean
  hideDirection: HideDirectionOnDisable | null
  linkMode: ElementLinkMode | undefined
  onClickButton: () => void

}

export const PaginationBarButton: FC<Partial<Props> & Omit<Props, 'disabled' | 'hideDirection' >> = ({
  title,
  linkTitle,
  href,
  active,
  disabled = false,
  hideDirection = null,
  linkMode,
  onClickButton,
}) => {
  let content: ReactElement

  if (linkMode) {
    content = (
      <Link
        href={ href }
        className={ `
          ${styles.paginationBarButton__pageNumberLink}
          ${active ? styles.paginationBarButton__pageNumberLink_currentPage : ''}
          ${disabled ? styles.paginationBarButton__pageNumberLink__disabled : ''}
        ` }
        scroll={ linkMode.scrollOnClick }
        shallow={ linkMode.shallowNavigation }
        replace={ linkMode.replace }
        title={ title }
      >
        { linkTitle }
      </Link>
    )
  } else {
    content = (
      <span
        className={ `
          ${styles.paginationBarButton__pageNumberLink}
          ${active ? styles.paginationBarButton__pageNumberLink_currentPage : ''}
          ${disabled ? styles.paginationBarButton__pageNumberLink__disabled : ''}
        ` }
        title={ title }
      >
        { linkTitle }
      </span>
    )
  }

  return (
    <li
      className={ `
        ${styles.paginationBarButton__pageNumberItem}
        ${disabled && (hideDirection && hideDirection === 'right')
          ? styles.paginationBarButton__pageNumberItem__rightPageButtonHide
          : ''
        }
        ${disabled && (hideDirection && hideDirection === 'left')
          ? styles.paginationBarButton__pageNumberItem__leftPageButtonHide
          : ''
        }
      ` }
      title={ title }
      onClick={ onClickButton }
    >
      { content }
    </li>
  )
}
