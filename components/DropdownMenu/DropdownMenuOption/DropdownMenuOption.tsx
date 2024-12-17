import { FC, ReactElement, ReactNode } from 'react'
import styles from './DropdownMenuOption.module.scss'
import Link, { LinkProps } from 'next/link'
import { IoIosCheckmark } from 'react-icons/io'

export interface Props {
  title: string
}

export interface OptionalPros {
  icon: ReactElement | string
  onClick: () => void
  link: LinkProps
  active: boolean
}

export type DropdownMenuOptionProps = Props & Partial<OptionalPros>

export const DropdownMenuOption: FC<DropdownMenuOptionProps> = ({
  title,
  icon = undefined,
  onClick = undefined,
  link = undefined,
  active = false,
}) => {
  let content: ReactNode | null = null

  const onClickAction = () => {
    if (onClick !== undefined) {
      onClick()
    }
  }

  if (!link) {
    content = (
      <button
        className={
          `${styles.dropDownMenuOption__container} ${active ? styles.dropDownMenuOption__container__active : ''}`
        }
        onClick={ onClickAction }
        title={ title }
      >
        { icon }
        { title }
        { active ? <IoIosCheckmark /> : null }
      </button>
    )
  }

  if (link) {
    content = (
      <Link
        { ...link }
        className={
          `${styles.dropDownMenuOption__container} ${active ? styles.dropDownMenuOption__container__active : ''}`
        }
        onClick={ onClickAction }
        title={ title }
      >
        { icon }
        { title }
        { active ? <IoIosCheckmark /> : null }
      </Link>
    )
  }

  return content
}
